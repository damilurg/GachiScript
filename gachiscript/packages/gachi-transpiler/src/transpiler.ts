import { Project, SourceFile, SyntaxKind, Node, Identifier, ts } from 'ts-morph';
import { gachiDictionary } from '@gachiscript/dictionary';

export interface TranspilerOptions {
  framework?: 'react' | 'angular' | 'vue' | 'node' | 'vanilla';
  preserveComments?: boolean;
  preserveFormatting?: boolean;
  strict?: boolean;
}

export interface TranspileResult {
  code: string;
  sourceMap?: string;
  diagnostics: Array<{
    message: string;
    line?: number;
    column?: number;
    severity: 'error' | 'warning' | 'info';
  }>;
}

export class GachiTranspiler {
  private project: Project;
  private options: TranspilerOptions;

  constructor(options: TranspilerOptions = {}) {
    this.options = {
      framework: 'vanilla',
      preserveComments: true,
      preserveFormatting: true,
      strict: false,
      ...options
    };

    this.project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        jsx: this.options.framework === 'react' ? ts.JsxEmit.React : undefined,
        experimentalDecorators: this.options.framework === 'angular',
        emitDecoratorMetadata: this.options.framework === 'angular',
        strict: this.options.strict
      }
    });
  }

  /**
   * Convert JavaScript/TypeScript code to GachiScript
   */
  jsToGachi(code: string, filename: string = 'input.ts'): TranspileResult {
    try {
      const sourceFile = this.project.createSourceFile(filename, code, { overwrite: true });
      const diagnostics: TranspileResult['diagnostics'] = [];

      // Transform the AST
      this.transformToGachi(sourceFile, diagnostics);

      // Get the transformed code
      const transformedCode = sourceFile.getFullText();

      return {
        code: transformedCode,
        diagnostics
      };
    } catch (error) {
      return {
        code: '',
        diagnostics: [{
          message: `Transpilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        }]
      };
    }
  }

  /**
   * Convert GachiScript code to JavaScript/TypeScript
   */
  gachiToJs(code: string, filename: string = 'input.gachi'): TranspileResult {
    try {
      // First, convert GachiScript keywords back to JS/TS keywords
      const jsCode = this.preprocessGachiToJs(code);
      
      const sourceFile = this.project.createSourceFile(filename.replace('.gachi', '.ts'), jsCode, { overwrite: true });
      const diagnostics: TranspileResult['diagnostics'] = [];

      // The code is already converted, just validate and format
      const transformedCode = sourceFile.getFullText();

      return {
        code: transformedCode,
        diagnostics
      };
    } catch (error) {
      return {
        code: '',
        diagnostics: [{
          message: `Reverse transpilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        }]
      };
    }
  }

  /**
   * Transform AST from JS/TS to GachiScript
   */
  private transformToGachi(sourceFile: SourceFile, diagnostics: TranspileResult['diagnostics']): void {
    sourceFile.forEachDescendant((node) => {
      try {
        this.transformNode(node);
      } catch (error) {
        diagnostics.push({
          message: `Failed to transform node at ${node.getStartLineNumber()}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          line: node.getStartLineNumber(),
          column: node.getStartLinePos(),
          severity: 'warning'
        });
      }
    });
  }

  /**
   * Transform a single AST node
   */
  private transformNode(node: Node): void {
    // Handle identifiers (keywords, variable names, etc.)
    if (Node.isIdentifier(node)) {
      this.transformIdentifier(node);
    }
    
    // Handle string literals for framework-specific transformations
    else if (Node.isStringLiteral(node)) {
      this.transformStringLiteral(node);
    }
    
    // Handle template literals
    else if (Node.isTemplateExpression(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
      this.transformTemplateLiteral(node);
    }
    
    // Handle JSX elements (React)
    else if (this.options.framework === 'react' && (Node.isJsxElement(node) || Node.isJsxSelfClosingElement(node))) {
      this.transformJsxElement(node);
    }
    
    // Handle decorators (Angular)
    else if (this.options.framework === 'angular' && Node.isDecorator(node)) {
      this.transformDecorator(node);
    }
    
    // Handle property assignments (Vue, general objects)
    else if (Node.isPropertyAssignment(node)) {
      this.transformPropertyAssignment(node);
    }
    
    // Handle method declarations
    else if (Node.isMethodDeclaration(node)) {
      this.transformMethodDeclaration(node);
    }
    
    // Handle function declarations
    else if (Node.isFunctionDeclaration(node)) {
      this.transformFunctionDeclaration(node);
    }
    
    // Handle variable declarations
    else if (Node.isVariableDeclaration(node)) {
      this.transformVariableDeclaration(node);
    }
    
    // Handle type annotations
    else if (Node.isTypeNode(node)) {
      this.transformTypeNode(node);
    }
  }

  /**
   * Transform identifier nodes (keywords, variable names)
   */
  private transformIdentifier(node: Identifier): void {
    const text = node.getText();
    
    // Skip transformation for certain contexts
    if (this.shouldSkipIdentifier(node, text)) {
      return;
    }

    const gachiEquivalent = gachiDictionary.jsToGachiKeyword(text);
    if (gachiEquivalent !== text) {
      node.replaceWithText(gachiEquivalent);
    }
  }

  /**
   * Check if identifier should be skipped from transformation
   */
  private shouldSkipIdentifier(node: Identifier, text: string): boolean {
    // Skip if it's a property access (e.g., object.property)
    if (Node.isPropertyAccessExpression(node.getParent()) && node.getParent().getNameNode() === node) {
      return true;
    }
    
    // Skip if it's an import/export specifier name
    if (Node.isImportSpecifier(node.getParent()) || Node.isExportSpecifier(node.getParent())) {
      return true;
    }
    
    // Skip if it's a string literal property name
    if (Node.isPropertyAssignment(node.getParent()) && node.getParent().getNameNode() === node) {
      return true;
    }
    
    // Skip built-in browser/Node.js globals
    const builtinGlobals = ['console', 'window', 'document', 'process', 'global', 'Buffer', '__dirname', '__filename'];
    if (builtinGlobals.includes(text)) {
      return true;
    }
    
    return false;
  }

  /**
   * Transform string literals
   */
  private transformStringLiteral(node: Node): void {
    // Only transform specific string patterns, not general string content
    // This is mainly for framework-specific template strings
    if (this.options.framework === 'angular') {
      const text = node.getText();
      // Transform Angular template strings, selectors, etc.
      const transformed = this.transformAngularTemplates(text);
      if (transformed !== text) {
        node.replaceWithText(transformed);
      }
    }
  }

  /**
   * Transform template literals
   */
  private transformTemplateLiteral(node: Node): void {
    // Handle template literal transformations for specific patterns
    // Similar to string literals but for template strings
  }

  /**
   * Transform JSX elements (React)
   */
  private transformJsxElement(node: Node): void {
    // Transform React component names and props
    if (Node.isJsxElement(node)) {
      const openingElement = node.getOpeningElement();
      const tagName = openingElement.getTagNameNode();
      if (Node.isIdentifier(tagName)) {
        this.transformIdentifier(tagName);
      }
    } else if (Node.isJsxSelfClosingElement(node)) {
      const tagName = node.getTagNameNode();
      if (Node.isIdentifier(tagName)) {
        this.transformIdentifier(tagName);
      }
    }
  }

  /**
   * Transform decorators (Angular)
   */
  private transformDecorator(node: Node): void {
    if (Node.isDecorator(node)) {
      const callExpression = node.getCallExpression();
      if (callExpression) {
        const expression = callExpression.getExpression();
        if (Node.isIdentifier(expression)) {
          this.transformIdentifier(expression);
        }
      }
    }
  }

  /**
   * Transform property assignments
   */
  private transformPropertyAssignment(node: Node): void {
    if (Node.isPropertyAssignment(node)) {
      const nameNode = node.getNameNode();
      if (Node.isIdentifier(nameNode)) {
        this.transformIdentifier(nameNode);
      }
    }
  }

  /**
   * Transform method declarations
   */
  private transformMethodDeclaration(node: Node): void {
    if (Node.isMethodDeclaration(node)) {
      const nameNode = node.getNameNode();
      if (Node.isIdentifier(nameNode)) {
        this.transformIdentifier(nameNode);
      }
    }
  }

  /**
   * Transform function declarations
   */
  private transformFunctionDeclaration(node: Node): void {
    if (Node.isFunctionDeclaration(node)) {
      const nameNode = node.getNameNode();
      if (nameNode && Node.isIdentifier(nameNode)) {
        this.transformIdentifier(nameNode);
      }
    }
  }

  /**
   * Transform variable declarations
   */
  private transformVariableDeclaration(node: Node): void {
    if (Node.isVariableDeclaration(node)) {
      const nameNode = node.getNameNode();
      if (Node.isIdentifier(nameNode)) {
        this.transformIdentifier(nameNode);
      }
    }
  }

  /**
   * Transform type nodes
   */
  private transformTypeNode(node: Node): void {
    // Handle TypeScript type annotations
    if (Node.isTypeReferenceNode(node)) {
      const typeName = node.getTypeName();
      if (Node.isIdentifier(typeName)) {
        this.transformIdentifier(typeName);
      }
    }
  }

  /**
   * Transform Angular-specific templates and selectors
   */
  private transformAngularTemplates(text: string): string {
    // Transform Angular component selectors, template URLs, etc.
    // This is a simple implementation - could be more sophisticated
    return text
      .replace(/selector:\s*['"]([^'"]+)['"]/g, (match, selector) => {
        const gachiSelector = gachiDictionary.jsToGachiKeyword(selector);
        return match.replace(selector, gachiSelector);
      });
  }

  /**
   * Preprocess GachiScript code to convert back to JS/TS
   */
  private preprocessGachiToJs(code: string): string {
    let result = code;
    
    // Convert all Gachi keywords back to JS/TS
    gachiDictionary.getAllGachiKeywords().forEach(gachiKeyword => {
      const jsKeyword = gachiDictionary.gachiToJsKeyword(gachiKeyword);
      // Use word boundaries to avoid partial replacements
      const regex = new RegExp(`\\b${this.escapeRegex(gachiKeyword)}\\b`, 'g');
      result = result.replace(regex, jsKeyword);
    });
    
    return result;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Set transpiler options
   */
  setOptions(options: Partial<TranspilerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get current transpiler options
   */
  getOptions(): TranspilerOptions {
    return { ...this.options };
  }
}