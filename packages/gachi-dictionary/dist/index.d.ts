interface GachiDictionary {
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
interface TransformOptions {
    framework?: 'react' | 'angular' | 'vue';
    preserveComments?: boolean;
    addRandomQuotes?: boolean;
    strictMode?: boolean;
}
declare class GachiTransformer {
    private dictionary;
    private reverseDictionary;
    constructor();
    private buildReverseDictionary;
    /**
     * Transform JavaScript/TypeScript keywords to GachiScript
     */
    jsToGachi(keyword: string, options?: TransformOptions): string;
    /**
     * Transform GachiScript keywords to JavaScript/TypeScript
     */
    gachiToJs(gachiKeyword: string): string;
    /**
     * Get all available keywords for a category
     */
    getKeywordsByCategory(category: keyof GachiDictionary): any;
    /**
     * Get random Billy quote for comments or errors
     */
    getRandomBillyQuote(): string;
    /**
     * Get random Van quote
     */
    getRandomVanQuote(): string;
    /**
     * Transform a simple expression
     */
    transformExpression(expression: string, toGachi?: boolean, options?: TransformOptions): string;
    private transformToGachi;
    private transformToJs;
    private escapeRegex;
    /**
     * Validate if a keyword exists in GachiScript
     */
    isValidGachiKeyword(keyword: string): boolean;
    /**
     * Get suggestions for mistyped keywords
     */
    getSuggestions(keyword: string): string[];
}
declare const gachiTransformer: GachiTransformer;
declare const dictionary: GachiDictionary;
declare const keywords: Record<string, string>;
declare const operators: Record<string, string>;
declare const types: Record<string, string>;
declare const methods: Record<string, string>;
declare const framework_specific: {
    react: Record<string, string>;
    angular: Record<string, string>;
    vue: Record<string, string>;
};
declare const phrases: {
    billy_quotes: string[];
    van_quotes: string[];
    comments: {
        single_line: string;
        multi_line_start: string;
        multi_line_end: string;
    };
};
declare const special_constructs: Record<string, string>;
declare const builtin_objects: Record<string, string>;

export { type GachiDictionary, GachiTransformer, type TransformOptions, builtin_objects, dictionary, framework_specific, gachiTransformer, keywords, methods, operators, phrases, special_constructs, types };
