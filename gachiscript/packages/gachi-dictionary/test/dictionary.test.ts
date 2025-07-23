import { GachiDictionary, gachiDictionary, jsToGachi, gachiToJs, hasJsKeyword, hasGachiKeyword, getRandomGachiPhrase, GACHI_PHRASES, JS_TO_GACHI_MAPPING } from '../src/index';

describe('GachiDictionary', () => {
  let dictionary: GachiDictionary;

  beforeEach(() => {
    dictionary = new GachiDictionary();
  });

  describe('Basic keyword conversion', () => {
    test('should convert JS keywords to Gachi', () => {
      expect(dictionary.jsToGachiKeyword('const')).toBe('tight');
      expect(dictionary.jsToGachiKeyword('let')).toBe('loose');
      expect(dictionary.jsToGachiKeyword('function')).toBe('performance');
      expect(dictionary.jsToGachiKeyword('return')).toBe('climax');
      expect(dictionary.jsToGachiKeyword('if')).toBe('whenHard');
      expect(dictionary.jsToGachiKeyword('else')).toBe('whenSoft');
    });

    test('should convert Gachi keywords to JS', () => {
      expect(dictionary.gachiToJsKeyword('tight')).toBe('const');
      expect(dictionary.gachiToJsKeyword('loose')).toBe('let');
      expect(dictionary.gachiToJsKeyword('performance')).toBe('function');
      expect(dictionary.gachiToJsKeyword('climax')).toBe('return');
      expect(dictionary.gachiToJsKeyword('whenHard')).toBe('if');
      expect(dictionary.gachiToJsKeyword('whenSoft')).toBe('else');
    });

    test('should return original keyword if not found', () => {
      expect(dictionary.jsToGachiKeyword('unknownKeyword')).toBe('unknownKeyword');
      expect(dictionary.gachiToJsKeyword('unknownGachi')).toBe('unknownGachi');
    });
  });

  describe('Keyword existence checks', () => {
    test('should correctly identify existing JS keywords', () => {
      expect(dictionary.hasJsKeyword('const')).toBe(true);
      expect(dictionary.hasJsKeyword('function')).toBe(true);
      expect(dictionary.hasJsKeyword('unknownKeyword')).toBe(false);
    });

    test('should correctly identify existing Gachi keywords', () => {
      expect(dictionary.hasGachiKeyword('tight')).toBe(true);
      expect(dictionary.hasGachiKeyword('performance')).toBe(true);
      expect(dictionary.hasGachiKeyword('unknownGachi')).toBe(false);
    });
  });

  describe('Framework-specific mappings', () => {
    test('should handle React keywords', () => {
      expect(dictionary.jsToGachiKeyword('React')).toBe('Gachi');
      expect(dictionary.jsToGachiKeyword('Component')).toBe('Performer');
      expect(dictionary.jsToGachiKeyword('useState')).toBe('holdState');
      expect(dictionary.jsToGachiKeyword('useEffect')).toBe('onAction');
      expect(dictionary.jsToGachiKeyword('props')).toBe('gifts');
    });

    test('should handle Angular keywords', () => {
      expect(dictionary.jsToGachiKeyword('@Component')).toBe('@Performer');
      expect(dictionary.jsToGachiKeyword('@Injectable')).toBe('@Useful');
      expect(dictionary.jsToGachiKeyword('ngOnInit')).toBe('onStart');
    });

    test('should handle Vue keywords', () => {
      expect(dictionary.jsToGachiKeyword('Vue')).toBe('GachiView');
      expect(dictionary.jsToGachiKeyword('data')).toBe('info');
      expect(dictionary.jsToGachiKeyword('computed')).toBe('calculated');
    });
  });

  describe('Testing framework mappings', () => {
    test('should handle Jest keywords', () => {
      expect(dictionary.jsToGachiKeyword('describe')).toBe('describeHole');
      expect(dictionary.jsToGachiKeyword('it')).toBe('itMuscle');
      expect(dictionary.jsToGachiKeyword('expect')).toBe('anticipate');
      expect(dictionary.jsToGachiKeyword('toBe')).toBe('becomes');
      expect(dictionary.jsToGachiKeyword('toBeTruthy')).toBe('isTight');
      expect(dictionary.jsToGachiKeyword('toBeFalsy')).toBe('isLoose');
    });
  });

  describe('Operators and symbols', () => {
    test('should handle comparison operators', () => {
      expect(dictionary.jsToGachiKeyword('===')).toBe('deeplyMatches');
      expect(dictionary.jsToGachiKeyword('==')).toBe('matches');
      expect(dictionary.jsToGachiKeyword('!==')).toBe('deeplyDiffers');
      expect(dictionary.jsToGachiKeyword('!=')).toBe('differs');
    });

    test('should handle brackets and delimiters', () => {
      expect(dictionary.jsToGachiKeyword('{')).toBe('openGym');
      expect(dictionary.jsToGachiKeyword('}')).toBe('closeGym');
      expect(dictionary.jsToGachiKeyword('(')).toBe('grab');
      expect(dictionary.jsToGachiKeyword(')')).toBe('release');
      expect(dictionary.jsToGachiKeyword('[')).toBe('enter');
      expect(dictionary.jsToGachiKeyword(']')).toBe('exit');
    });

    test('should handle arrow functions and spread', () => {
      expect(dictionary.jsToGachiKeyword('=>')).toBe('becomes');
      expect(dictionary.jsToGachiKeyword('...')).toBe('spread');
    });
  });

  describe('Array and object methods', () => {
    test('should handle array methods', () => {
      expect(dictionary.jsToGachiKeyword('push')).toBe('insert');
      expect(dictionary.jsToGachiKeyword('pop')).toBe('extract');
      expect(dictionary.jsToGachiKeyword('shift')).toBe('pullOut');
      expect(dictionary.jsToGachiKeyword('unshift')).toBe('pushIn');
      expect(dictionary.jsToGachiKeyword('map')).toBe('transform');
      expect(dictionary.jsToGachiKeyword('filter')).toBe('select');
      expect(dictionary.jsToGachiKeyword('reduce')).toBe('compress');
    });
  });

  describe('Custom mappings', () => {
    test('should allow adding custom mappings', () => {
      dictionary.addCustomMapping('customJS', 'customGachi');
      expect(dictionary.jsToGachiKeyword('customJS')).toBe('customGachi');
      expect(dictionary.gachiToJsKeyword('customGachi')).toBe('customJS');
    });

    test('should allow removing mappings', () => {
      expect(dictionary.removeMapping('const')).toBe(true);
      expect(dictionary.hasJsKeyword('const')).toBe(false);
      expect(dictionary.hasGachiKeyword('tight')).toBe(false);
      expect(dictionary.removeMapping('nonExistentKeyword')).toBe(false);
    });
  });

  describe('Statistics and utility methods', () => {
    test('should provide correct statistics', () => {
      const stats = dictionary.getStats();
      expect(stats.totalMappings).toBeGreaterThan(0);
      expect(stats.jsKeywords).toBe(stats.gachiKeywords);
      expect(stats.totalPhrases).toBeGreaterThan(0);
    });

    test('should get all keywords', () => {
      const jsKeywords = dictionary.getAllJsKeywords();
      const gachiKeywords = dictionary.getAllGachiKeywords();
      
      expect(jsKeywords.length).toBeGreaterThan(0);
      expect(gachiKeywords.length).toBeGreaterThan(0);
      expect(jsKeywords).toContain('const');
      expect(gachiKeywords).toContain('tight');
    });

    test('should export and import JSON', () => {
      const exported = dictionary.exportToJson();
      expect(exported.jsToGachi).toHaveProperty('const', 'tight');
      expect(exported.gachiToJs).toHaveProperty('tight', 'const');
      expect(exported.phrases).toBeDefined();

      const newDictionary = new GachiDictionary();
      newDictionary.importFromJson(exported);
      expect(newDictionary.jsToGachiKeyword('const')).toBe('tight');
    });

    test('should get random Gachi phrase', () => {
      const phrase = dictionary.getRandomGachiPhrase();
      expect(typeof phrase).toBe('string');
      expect(phrase.length).toBeGreaterThan(0);
      expect(Object.values(GACHI_PHRASES)).toContain(phrase);
    });
  });

  describe('Bidirectional conversion integrity', () => {
    test('should maintain conversion integrity', () => {
      const testKeywords = ['const', 'function', 'return', 'if', 'else', 'class', 'interface'];
      
      testKeywords.forEach(jsKeyword => {
        if (dictionary.hasJsKeyword(jsKeyword)) {
          const gachiKeyword = dictionary.jsToGachiKeyword(jsKeyword);
          const backToJs = dictionary.gachiToJsKeyword(gachiKeyword);
          expect(backToJs).toBe(jsKeyword);
        }
      });
    });
  });
});

describe('Convenience functions', () => {
  test('should work with default dictionary instance', () => {
    expect(jsToGachi('const')).toBe('tight');
    expect(gachiToJs('tight')).toBe('const');
    expect(hasJsKeyword('const')).toBe(true);
    expect(hasGachiKeyword('tight')).toBe(true);
    expect(hasJsKeyword('unknownKeyword')).toBe(false);
    expect(hasGachiKeyword('unknownGachi')).toBe(false);
  });

  test('should get random phrase', () => {
    const phrase = getRandomGachiPhrase();
    expect(typeof phrase).toBe('string');
    expect(phrase.length).toBeGreaterThan(0);
  });
});

describe('GACHI_PHRASES', () => {
  test('should contain Billy Herrington classics', () => {
    expect(GACHI_PHRASES.BOSS_OF_THIS_GYM).toBe('boss of this gym');
    expect(GACHI_PHRASES.TAKE_IT_BOY).toBe('take it boy');
    expect(GACHI_PHRASES.DEEP_DARK_FANTASY).toBe('deep dark fantasy');
    expect(GACHI_PHRASES.FISTING_IS_300_BUCKS).toBe('fisting is 300 bucks');
  });

  test('should contain Van Darkholme wisdom', () => {
    expect(GACHI_PHRASES.DUNGEON_MASTER).toBe('dungeon master');
    expect(GACHI_PHRASES.COLLEGE_BOY).toBe('college boy');
  });

  test('should contain technical Gachi terms', () => {
    expect(GACHI_PHRASES.MANHOLE).toBe('manhole');
    expect(GACHI_PHRASES.BOYHOLE).toBe('boyhole');
    expect(GACHI_PHRASES.TIGHT_COUPLING).toBe('tight coupling');
    expect(GACHI_PHRASES.PENETRATION_TESTING).toBe('penetration testing');
  });
});

describe('JS_TO_GACHI_MAPPING', () => {
  test('should be a complete mapping object', () => {
    expect(typeof JS_TO_GACHI_MAPPING).toBe('object');
    expect(JS_TO_GACHI_MAPPING.const).toBe('tight');
    expect(JS_TO_GACHI_MAPPING.function).toBe('performance');
    expect(JS_TO_GACHI_MAPPING['{']).toBe('openGym');
    expect(JS_TO_GACHI_MAPPING['}']).toBe('closeGym');
  });

  test('should cover all major JS/TS constructs', () => {
    // Variable declarations
    expect(JS_TO_GACHI_MAPPING.const).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.let).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.var).toBeDefined();
    
    // Functions
    expect(JS_TO_GACHI_MAPPING.function).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.async).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.await).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.return).toBeDefined();
    
    // Control flow
    expect(JS_TO_GACHI_MAPPING.if).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.else).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.for).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.while).toBeDefined();
    
    // Types
    expect(JS_TO_GACHI_MAPPING.interface).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.type).toBeDefined();
    expect(JS_TO_GACHI_MAPPING.class).toBeDefined();
  });
});