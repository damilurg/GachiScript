import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { gachiTransformer, TransformOptions } from '@gachiscript/dictionary';

export interface TranspilerOptions extends TransformOptions {
  sourceType?: 'module' | 'script';
  plugins?: string[];
  allowImportExportEverywhere?: boolean;
  allowAwaitOutsideFunction?: boolean;
  allowReturnOutsideFunction?: boolean;
  allowSuperOutsideMethod?: boolean;
  allowUndeclaredExports?: boolean;
  attachComments?: boolean;
  strictMode?: boolean;
  ranges?: boolean;
  tokens?: boolean;
}

export interface TranspileResult {
  code: string;
  map?: any;
  ast?: any;
  errors?: string[];
  warnings?: string[];
}

export class GachiTranspiler {
  private options: TranspilerOptions;

  constructor(options: TranspilerOptions = {}) {
    this.options = {
      sourceType: 'module',
      plugins: [
        'typescript',
        'jsx',
        'decorators-legacy',
        'classProperties',
        'objectRestSpread',
        'asyncGenerators',
        'functionBind',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'dynamicImport',
        'nullishCoalescingOperator',
        'optionalChaining',
        'optionalCatchBinding',
        'throwExpressions',
        'bigInt',
        'importMeta'
      ],
      ...options
    };
  }

  /**
   * Transform JavaScript/TypeScript to GachiScript
   */
  jsToGachi(code: string, options?: TranspilerOptions): TranspileResult {
    try {
      const mergedOptions = { ...this.options, ...options };
      
      // Parse the code into AST
      const ast = parse(code, {
        sourceType: mergedOptions.sourceType,
        plugins: mergedOptions.plugins,
        allowImportExportEverywhere: mergedOptions.allowImportExportEverywhere,
        allowAwaitOutsideFunction: mergedOptions.allowAwaitOutsideFunction,
        allowReturnOutsideFunction: mergedOptions.allowReturnOutsideFunction,
        allowSuperOutsideMethod: mergedOptions.allowSuperOutsideMethod,
        allowUndeclaredExports: mergedOptions.allowUndeclaredExports,
        attachComments: mergedOptions.attachComments,
        strictMode: mergedOptions.strictMode,
        ranges: mergedOptions.ranges,
        tokens: mergedOptions.tokens
      });

      // Transform AST from JS to Gachi
      this.transformAstToGachi(ast, mergedOptions);

      // Generate code from transformed AST
      const result = generate(ast, {
        comments: mergedOptions.preserveComments !== false,
        compact: false,
        minified: false
      });

      return {
        code: result.code,
        map: result.map,
        ast: ast,
        errors: [],
        warnings: []
      };

    } catch (error) {
      return {
        code: '',
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: []
      };
    }
  }

  /**
   * Transform GachiScript to JavaScript/TypeScript
   */
  gachiToJs(code: string, options?: TranspilerOptions): TranspileResult {
    try {
      const mergedOptions = { ...this.options, ...options };
      
      // First, reverse transform the code using simple string replacement
      // This is a simplified approach - for production, we'd want full AST parsing
      let transformedCode = code;
      
      // Transform back to JS using the dictionary
      transformedCode = gachiTransformer.transformExpression(transformedCode, false);

      // Parse the transformed code to validate
      const ast = parse(transformedCode, {
        sourceType: mergedOptions.sourceType,
        plugins: mergedOptions.plugins,
        allowImportExportEverywhere: mergedOptions.allowImportExportEverywhere,
        allowAwaitOutsideFunction: mergedOptions.allowAwaitOutsideFunction,
        allowReturnOutsideFunction: mergedOptions.allowReturnOutsideFunction,
        allowSuperOutsideMethod: mergedOptions.allowSuperOutsideMethod,
        allowUndeclaredExports: mergedOptions.allowUndeclaredExports,
        attachComments: mergedOptions.attachComments,
        strictMode: mergedOptions.strictMode,
        ranges: mergedOptions.ranges,
        tokens: mergedOptions.tokens
      });

      // Generate clean JavaScript code
      const result = generate(ast, {
        comments: mergedOptions.preserveComments !== false,
        compact: false,
        minified: false
      });

      return {
        code: result.code,
        map: result.map,
        ast: ast,
        errors: [],
        warnings: []
      };

    } catch (error) {
      return {
        code: '',
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: []
      };
    }
  }

  private transformAstToGachi(ast: any, options: TranspilerOptions): void {
    traverse(ast, {
      // Transform identifiers (variable names, function names, etc.)
      Identifier(path) {
        if (this.shouldTransformIdentifier(path)) {
          const gachiName = gachiTransformer.jsToGachi(path.node.name, options);
          if (gachiName !== path.node.name) {
            path.node.name = gachiName;
          }
        }
      },

      // Transform variable declarations
      VariableDeclaration(path) {
        const gachiKind = gachiTransformer.jsToGachi(path.node.kind, options);
        if (gachiKind !== path.node.kind) {
          path.node.kind = gachiKind as any;
        }
      },

      // Transform function declarations
      FunctionDeclaration(path) {
        // Transform function keyword in comments or special handling
        if (options.addRandomQuotes) {
          this.addRandomComment(path, gachiTransformer.getRandomBillyQuote());
        }
      },

      // Transform class declarations
      ClassDeclaration(path) {
        if (options.addRandomQuotes) {
          this.addRandomComment(path, gachiTransformer.getRandomBillyQuote());
        }
      },

      // Transform import/export statements
      ImportDeclaration(path) {
        // Handle framework-specific imports
        if (options.framework === 'react' && path.node.source.value === 'react') {
          this.transformReactImports(path, options);
        }
      },

      // Transform JSX elements for React
      JSXElement(path) {
        if (options.framework === 'react') {
          this.transformJSXElement(path, options);
        }
      },

      // Transform method calls
      CallExpression(path) {
        if (t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.property)) {
          const methodName = path.node.callee.property.name;
          const gachiMethod = gachiTransformer.jsToGachi(methodName, options);
          if (gachiMethod !== methodName) {
            path.node.callee.property.name = gachiMethod;
          }
        }
      },

      // Transform binary expressions (operators)
      BinaryExpression(path) {
        const gachiOperator = gachiTransformer.jsToGachi(path.node.operator, options);
        if (gachiOperator !== path.node.operator) {
          // For complex operators, we might need to create custom handling
          if (options.strictMode) {
            this.addComment(path, `// GACHI: ${path.node.operator} -> ${gachiOperator}`);
          }
        }
      },

      // Transform comments
      Comment(path) {
        if (options.preserveComments) {
          this.transformComment(path as any);
        }
      }
    });
  }

  private shouldTransformIdentifier(path: any): boolean {
    // Don't transform property names in object expressions
    if (path.isObjectProperty() && path.node.key === path.parent.key) {
      return false;
    }
    
    // Don't transform member expression properties
    if (path.isMemberExpression() && path.node.property === path.parent.property) {
      return false;
    }
    
    // Don't transform import specifiers
    if (path.isImportSpecifier() || path.isExportSpecifier()) {
      return false;
    }
    
    return true;
  }

  private transformReactImports(path: any, options: TranspilerOptions): void {
    // Transform React-specific imports
    path.node.specifiers.forEach((specifier: any) => {
      if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
        const importName = specifier.imported.name;
        const gachiName = gachiTransformer.jsToGachi(importName, options);
        if (gachiName !== importName) {
          specifier.imported.name = gachiName;
          if (t.isIdentifier(specifier.local)) {
            specifier.local.name = gachiName;
          }
        }
      }
    });
  }

  private transformJSXElement(path: any, options: TranspilerOptions): void {
    // Transform JSX element names if they match React components
    if (t.isJSXIdentifier(path.node.openingElement.name)) {
      const elementName = path.node.openingElement.name.name;
      const gachiName = gachiTransformer.jsToGachi(elementName, options);
      if (gachiName !== elementName) {
        path.node.openingElement.name.name = gachiName;
        if (path.node.closingElement && t.isJSXIdentifier(path.node.closingElement.name)) {
          path.node.closingElement.name.name = gachiName;
        }
      }
    }
  }

  private addRandomComment(path: any, quote: string): void {
    const comment = {
      type: 'CommentBlock',
      value: ` ${quote} `
    };
    path.addComment('leading', comment);
  }

  private addComment(path: any, text: string): void {
    const comment = {
      type: 'CommentLine',
      value: ` ${text}`
    };
    path.addComment('trailing', comment);
  }

  private transformComment(path: any): void {
    if (path.node.type === 'CommentLine') {
      path.node.value = path.node.value.replace(/\/\//, '// DEEP DARK COMMENT:');
    } else if (path.node.type === 'CommentBlock') {
      path.node.value = ` FISTING IS 300 BUCKS ${path.node.value} RIGHT VERSION! `;
    }
  }

  /**
   * Detect the framework from code content
   */
  static detectFramework(code: string): 'react' | 'angular' | 'vue' | null {
    if (code.includes('import React') || code.includes('from \'react\'') || code.includes('jsx')) {
      return 'react';
    }
    if (code.includes('@Component') || code.includes('@Injectable') || code.includes('angular')) {
      return 'angular';
    }
    if (code.includes('Vue') || code.includes('vue') || code.includes('<template>')) {
      return 'vue';
    }
    return null;
  }

  /**
   * Validate GachiScript syntax
   */
  validateGachiScript(code: string): { valid: boolean; errors: string[]; suggestions: string[] } {
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    // Simple validation - check for unknown keywords
    const words = code.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
    
    for (const word of words) {
      if (!gachiTransformer.isValidGachiKeyword(word) && 
          !this.isValidJavaScriptIdentifier(word)) {
        errors.push(`Unknown GachiScript keyword: "${word}"`);
        const wordSuggestions = gachiTransformer.getSuggestions(word);
        if (wordSuggestions.length > 0) {
          suggestions.push(`Did you mean: ${wordSuggestions.join(', ')}?`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      suggestions
    };
  }

  private isValidJavaScriptIdentifier(word: string): boolean {
    // Basic check for valid JavaScript identifiers
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(word);
  }
}

// Export singleton instance
export const gachiTranspiler = new GachiTranspiler();