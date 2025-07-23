import gachiDict from './gachi-dictionary.json' assert { type: 'json' };

export interface GachiDictionary {
  keywords: Record<string, string>;
  operators: Record<string, string>;
  types: Record<string, string>;
  methods: Record<string, string>;
  framework_specific: {
    react: Record<string, string>;
    angular: Record<string, string>;
    vue: Record<string, string>;
  };
  phrases: {
    billy_quotes: string[];
    van_quotes: string[];
    comments: {
      single_line: string;
      multi_line_start: string;
      multi_line_end: string;
    };
  };
  special_constructs: Record<string, string>;
  builtin_objects: Record<string, string>;
}

export interface TransformOptions {
  framework?: 'react' | 'angular' | 'vue';
  preserveComments?: boolean;
  addRandomQuotes?: boolean;
  strictMode?: boolean;
}

export class GachiTransformer {
  private dictionary: GachiDictionary;
  private reverseDictionary: Map<string, string>;

  constructor() {
    this.dictionary = gachiDict as GachiDictionary;
    this.reverseDictionary = this.buildReverseDictionary();
  }

  private buildReverseDictionary(): Map<string, string> {
    const reverseMap = new Map<string, string>();
    
    // Add all mappings to reverse dictionary
    Object.entries(this.dictionary.keywords).forEach(([js, gachi]) => {
      reverseMap.set(gachi, js);
    });
    
    Object.entries(this.dictionary.operators).forEach(([js, gachi]) => {
      reverseMap.set(gachi, js);
    });
    
    Object.entries(this.dictionary.types).forEach(([js, gachi]) => {
      reverseMap.set(gachi, js);
    });
    
    Object.entries(this.dictionary.methods).forEach(([js, gachi]) => {
      reverseMap.set(gachi, js);
    });
    
    Object.entries(this.dictionary.builtin_objects).forEach(([js, gachi]) => {
      reverseMap.set(gachi, js);
    });
    
    Object.entries(this.dictionary.special_constructs).forEach(([js, gachi]) => {
      reverseMap.set(gachi, js);
    });

    return reverseMap;
  }

  /**
   * Transform JavaScript/TypeScript keywords to GachiScript
   */
  jsToGachi(keyword: string, options?: TransformOptions): string {
    // Check framework-specific mappings first
    if (options?.framework) {
      const frameworkDict = this.dictionary.framework_specific[options.framework];
      if (frameworkDict[keyword]) {
        return frameworkDict[keyword];
      }
    }

    // Check standard mappings
    return this.dictionary.keywords[keyword] ||
           this.dictionary.operators[keyword] ||
           this.dictionary.types[keyword] ||
           this.dictionary.methods[keyword] ||
           this.dictionary.builtin_objects[keyword] ||
           this.dictionary.special_constructs[keyword] ||
           keyword; // Return original if no mapping found
  }

  /**
   * Transform GachiScript keywords to JavaScript/TypeScript
   */
  gachiToJs(gachiKeyword: string): string {
    return this.reverseDictionary.get(gachiKeyword) || gachiKeyword;
  }

  /**
   * Get all available keywords for a category
   */
  getKeywordsByCategory(category: keyof GachiDictionary): any {
    return this.dictionary[category];
  }

  /**
   * Get random Billy quote for comments or errors
   */
  getRandomBillyQuote(): string {
    const quotes = this.dictionary.phrases.billy_quotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  /**
   * Get random Van quote
   */
  getRandomVanQuote(): string {
    const quotes = this.dictionary.phrases.van_quotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  /**
   * Transform a simple expression
   */
  transformExpression(expression: string, toGachi: boolean = true, options?: TransformOptions): string {
    if (toGachi) {
      return this.transformToGachi(expression, options);
    } else {
      return this.transformToJs(expression);
    }
  }

  private transformToGachi(expression: string, options?: TransformOptions): string {
    let result = expression;
    
    // Transform keywords
    Object.entries(this.dictionary.keywords).forEach(([js, gachi]) => {
      const regex = new RegExp(`\\b${this.escapeRegex(js)}\\b`, 'g');
      result = result.replace(regex, gachi);
    });
    
    // Transform operators
    Object.entries(this.dictionary.operators).forEach(([js, gachi]) => {
      result = result.replace(new RegExp(this.escapeRegex(js), 'g'), gachi);
    });
    
    // Transform types
    Object.entries(this.dictionary.types).forEach(([js, gachi]) => {
      const regex = new RegExp(`\\b${this.escapeRegex(js)}\\b`, 'g');
      result = result.replace(regex, gachi);
    });

    // Transform framework-specific if specified
    if (options?.framework) {
      const frameworkDict = this.dictionary.framework_specific[options.framework];
      Object.entries(frameworkDict).forEach(([js, gachi]) => {
        const regex = new RegExp(`\\b${this.escapeRegex(js)}\\b`, 'g');
        result = result.replace(regex, gachi);
      });
    }
    
    return result;
  }

  private transformToJs(expression: string): string {
    let result = expression;
    
    this.reverseDictionary.forEach((js, gachi) => {
      const regex = new RegExp(`\\b${this.escapeRegex(gachi)}\\b`, 'g');
      result = result.replace(regex, js);
    });
    
    return result;
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Validate if a keyword exists in GachiScript
   */
  isValidGachiKeyword(keyword: string): boolean {
    return this.reverseDictionary.has(keyword);
  }

  /**
   * Get suggestions for mistyped keywords
   */
  getSuggestions(keyword: string): string[] {
    const suggestions: string[] = [];
    const lowerKeyword = keyword.toLowerCase();
    
    // Check for similar gachi keywords
    for (const gachiKeyword of this.reverseDictionary.keys()) {
      if (gachiKeyword.toLowerCase().includes(lowerKeyword) || 
          lowerKeyword.includes(gachiKeyword.toLowerCase())) {
        suggestions.push(gachiKeyword);
      }
    }
    
    return suggestions.slice(0, 5); // Return top 5 suggestions
  }
}

// Export singleton instance
export const gachiTransformer = new GachiTransformer();

// Export dictionary for direct access
export const dictionary = gachiDict as GachiDictionary;

// Export individual categories for convenience
export const {
  keywords,
  operators,
  types,
  methods,
  framework_specific,
  phrases,
  special_constructs,
  builtin_objects
} = gachiDict as GachiDictionary;