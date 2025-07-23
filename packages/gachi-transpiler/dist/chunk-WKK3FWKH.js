// src/index.ts
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { gachiTransformer } from "@gachiscript/dictionary";
var GachiTranspiler = class {
  options;
  constructor(options = {}) {
    this.options = {
      sourceType: "module",
      plugins: [
        "typescript",
        "jsx",
        "decorators-legacy",
        "classProperties",
        "objectRestSpread",
        "asyncGenerators",
        "functionBind",
        "exportDefaultFrom",
        "exportNamespaceFrom",
        "dynamicImport",
        "nullishCoalescingOperator",
        "optionalChaining",
        "optionalCatchBinding",
        "throwExpressions",
        "bigInt",
        "importMeta"
      ],
      ...options
    };
  }
  /**
   * Transform JavaScript/TypeScript to GachiScript
   */
  jsToGachi(code, options) {
    try {
      const mergedOptions = { ...this.options, ...options };
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
      this.transformAstToGachi(ast, mergedOptions);
      const result = generate(ast, {
        comments: mergedOptions.preserveComments !== false,
        compact: false,
        minified: false
      });
      return {
        code: result.code,
        map: result.map,
        ast,
        errors: [],
        warnings: []
      };
    } catch (error) {
      return {
        code: "",
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: []
      };
    }
  }
  /**
   * Transform GachiScript to JavaScript/TypeScript
   */
  gachiToJs(code, options) {
    try {
      const mergedOptions = { ...this.options, ...options };
      let transformedCode = code;
      transformedCode = gachiTransformer.transformExpression(transformedCode, false);
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
      const result = generate(ast, {
        comments: mergedOptions.preserveComments !== false,
        compact: false,
        minified: false
      });
      return {
        code: result.code,
        map: result.map,
        ast,
        errors: [],
        warnings: []
      };
    } catch (error) {
      return {
        code: "",
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: []
      };
    }
  }
  transformAstToGachi(ast, options) {
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
          path.node.kind = gachiKind;
        }
      },
      // Transform function declarations
      FunctionDeclaration(path) {
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
        if (options.framework === "react" && path.node.source.value === "react") {
          this.transformReactImports(path, options);
        }
      },
      // Transform JSX elements for React
      JSXElement(path) {
        if (options.framework === "react") {
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
          if (options.strictMode) {
            this.addComment(path, `// GACHI: ${path.node.operator} -> ${gachiOperator}`);
          }
        }
      },
      // Transform comments
      Comment(path) {
        if (options.preserveComments) {
          this.transformComment(path);
        }
      }
    });
  }
  shouldTransformIdentifier(path) {
    if (path.isObjectProperty() && path.node.key === path.parent.key) {
      return false;
    }
    if (path.isMemberExpression() && path.node.property === path.parent.property) {
      return false;
    }
    if (path.isImportSpecifier() || path.isExportSpecifier()) {
      return false;
    }
    return true;
  }
  transformReactImports(path, options) {
    path.node.specifiers.forEach((specifier) => {
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
  transformJSXElement(path, options) {
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
  addRandomComment(path, quote) {
    const comment = {
      type: "CommentBlock",
      value: ` ${quote} `
    };
    path.addComment("leading", comment);
  }
  addComment(path, text) {
    const comment = {
      type: "CommentLine",
      value: ` ${text}`
    };
    path.addComment("trailing", comment);
  }
  transformComment(path) {
    if (path.node.type === "CommentLine") {
      path.node.value = path.node.value.replace(/\/\//, "// DEEP DARK COMMENT:");
    } else if (path.node.type === "CommentBlock") {
      path.node.value = ` FISTING IS 300 BUCKS ${path.node.value} RIGHT VERSION! `;
    }
  }
  /**
   * Detect the framework from code content
   */
  static detectFramework(code) {
    if (code.includes("import React") || code.includes("from 'react'") || code.includes("jsx")) {
      return "react";
    }
    if (code.includes("@Component") || code.includes("@Injectable") || code.includes("angular")) {
      return "angular";
    }
    if (code.includes("Vue") || code.includes("vue") || code.includes("<template>")) {
      return "vue";
    }
    return null;
  }
  /**
   * Validate GachiScript syntax
   */
  validateGachiScript(code) {
    const errors = [];
    const suggestions = [];
    const words = code.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
    for (const word of words) {
      if (!gachiTransformer.isValidGachiKeyword(word) && !this.isValidJavaScriptIdentifier(word)) {
        errors.push(`Unknown GachiScript keyword: "${word}"`);
        const wordSuggestions = gachiTransformer.getSuggestions(word);
        if (wordSuggestions.length > 0) {
          suggestions.push(`Did you mean: ${wordSuggestions.join(", ")}?`);
        }
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      suggestions
    };
  }
  isValidJavaScriptIdentifier(word) {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(word);
  }
};
var gachiTranspiler = new GachiTranspiler();

export {
  GachiTranspiler,
  gachiTranspiler
};
