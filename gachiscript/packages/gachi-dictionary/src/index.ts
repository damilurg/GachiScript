import { GACHI_PHRASES } from './gachi-phrases';
import { JS_TO_GACHI_MAPPING, GACHI_TO_JS_MAPPING, JSKeyword, GachiKeyword } from './syntax-mapping';

export * from './gachi-phrases';
export * from './syntax-mapping';

/**
 * GachiScript Dictionary API
 * Provides comprehensive mapping between JavaScript/TypeScript and GachiScript syntax
 */
export class GachiDictionary {
  private jsToGachi: Map<string, string>;
  private gachiToJs: Map<string, string>;

  constructor() {
    this.jsToGachi = new Map(Object.entries(JS_TO_GACHI_MAPPING));
    this.gachiToJs = new Map(Object.entries(GACHI_TO_JS_MAPPING));
  }

  /**
   * Convert a JavaScript/TypeScript keyword to GachiScript
   */
  jsToGachiKeyword(jsKeyword: string): string {
    return this.jsToGachi.get(jsKeyword) || jsKeyword;
  }

  /**
   * Convert a GachiScript keyword to JavaScript/TypeScript
   */
  gachiToJsKeyword(gachiKeyword: string): string {
    return this.gachiToJs.get(gachiKeyword) || gachiKeyword;
  }

  /**
   * Check if a keyword exists in JS to Gachi mapping
   */
  hasJsKeyword(keyword: string): boolean {
    return this.jsToGachi.has(keyword);
  }

  /**
   * Check if a keyword exists in Gachi to JS mapping
   */
  hasGachiKeyword(keyword: string): boolean {
    return this.gachiToJs.has(keyword);
  }

  /**
   * Get all JS keywords that can be converted
   */
  getAllJsKeywords(): string[] {
    return Array.from(this.jsToGachi.keys());
  }

  /**
   * Get all Gachi keywords that can be converted
   */
  getAllGachiKeywords(): string[] {
    return Array.from(this.gachiToJs.keys());
  }

  /**
   * Get the full JS to Gachi mapping
   */
  getJsToGachiMapping(): Map<string, string> {
    return new Map(this.jsToGachi);
  }

  /**
   * Get the full Gachi to JS mapping
   */
  getGachiToJsMapping(): Map<string, string> {
    return new Map(this.gachiToJs);
  }

  /**
   * Add a custom mapping (runtime extension)
   */
  addCustomMapping(jsKeyword: string, gachiKeyword: string): void {
    this.jsToGachi.set(jsKeyword, gachiKeyword);
    this.gachiToJs.set(gachiKeyword, jsKeyword);
  }

  /**
   * Remove a mapping
   */
  removeMapping(jsKeyword: string): boolean {
    const gachiKeyword = this.jsToGachi.get(jsKeyword);
    if (gachiKeyword) {
      this.jsToGachi.delete(jsKeyword);
      this.gachiToJs.delete(gachiKeyword);
      return true;
    }
    return false;
  }

  /**
   * Get a random Gachi phrase for fun
   */
  getRandomGachiPhrase(): string {
    const phrases = Object.values(GACHI_PHRASES);
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  /**
   * Get dictionary statistics
   */
  getStats(): {
    totalMappings: number;
    jsKeywords: number;
    gachiKeywords: number;
    totalPhrases: number;
  } {
    return {
      totalMappings: this.jsToGachi.size,
      jsKeywords: this.jsToGachi.size,
      gachiKeywords: this.gachiToJs.size,
      totalPhrases: Object.keys(GACHI_PHRASES).length
    };
  }

  /**
   * Export dictionary as JSON for external use
   */
  exportToJson(): {
    jsToGachi: Record<string, string>;
    gachiToJs: Record<string, string>;
    phrases: typeof GACHI_PHRASES;
  } {
    return {
      jsToGachi: Object.fromEntries(this.jsToGachi),
      gachiToJs: Object.fromEntries(this.gachiToJs),
      phrases: GACHI_PHRASES
    };
  }

  /**
   * Import dictionary from JSON
   */
  importFromJson(data: {
    jsToGachi?: Record<string, string>;
    gachiToJs?: Record<string, string>;
  }): void {
    if (data.jsToGachi) {
      this.jsToGachi = new Map(Object.entries(data.jsToGachi));
    }
    if (data.gachiToJs) {
      this.gachiToJs = new Map(Object.entries(data.gachiToJs));
    }
  }
}

// Default singleton instance
export const gachiDictionary = new GachiDictionary();

// Convenience functions for quick access
export const jsToGachi = (keyword: string): string => gachiDictionary.jsToGachiKeyword(keyword);
export const gachiToJs = (keyword: string): string => gachiDictionary.gachiToJsKeyword(keyword);
export const hasJsKeyword = (keyword: string): boolean => gachiDictionary.hasJsKeyword(keyword);
export const hasGachiKeyword = (keyword: string): boolean => gachiDictionary.hasGachiKeyword(keyword);
export const getRandomGachiPhrase = (): string => gachiDictionary.getRandomGachiPhrase();

// Export types for TypeScript users
export type { JSKeyword, GachiKeyword };

// Export the mapping constants
export { JS_TO_GACHI_MAPPING, GACHI_TO_JS_MAPPING, GACHI_PHRASES };