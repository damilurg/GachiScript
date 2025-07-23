import { 
  describeHole, 
  itMuscle, 
  probe, 
  anticipate, 
  GachiExpectation,
  beforeEachRound,
  afterEachRound,
  beforeShow,
  afterShow,
  createSpy,
  spyOn,
  configureGachiTest,
  getGachiTestConfig,
  resetGachiTestConfig,
  BILLY_QUOTES,
  getRandomBillyQuote
} from '../src/gachitest';

// Note: These tests use regular Jest since we're testing the GachiTest wrappers
describe('GachiTest Core Functions', () => {
  beforeEach(() => {
    resetGachiTestConfig();
  });

  describe('Configuration', () => {
    test('should have default configuration', () => {
      const config = getGachiTestConfig();
      expect(config.enableGachiSyntax).toBe(true);
      expect(config.verboseOutput).toBe(false);
      expect(config.billyQuotes).toBe(true);
      expect(config.autoTranspile).toBe(true);
    });

    test('should allow configuration updates', () => {
      configureGachiTest({
        verboseOutput: true,
        billyQuotes: false
      });

      const config = getGachiTestConfig();
      expect(config.verboseOutput).toBe(true);
      expect(config.billyQuotes).toBe(false);
      expect(config.enableGachiSyntax).toBe(true); // Should remain unchanged
    });

    test('should reset configuration to defaults', () => {
      configureGachiTest({
        verboseOutput: true,
        billyQuotes: false
      });

      resetGachiTestConfig();

      const config = getGachiTestConfig();
      expect(config.verboseOutput).toBe(false);
      expect(config.billyQuotes).toBe(true);
    });
  });

  describe('Billy Quotes', () => {
    test('should have Billy Herrington quotes', () => {
      expect(BILLY_QUOTES.length).toBeGreaterThan(0);
      expect(BILLY_QUOTES).toContain("♂ That turns me on ♂");
      expect(BILLY_QUOTES).toContain("♂ Boss of this gym ♂");
      expect(BILLY_QUOTES).toContain("♂ Deep dark fantasy ♂");
    });

    test('should return random Billy quote', () => {
      const quote = getRandomBillyQuote();
      expect(typeof quote).toBe('string');
      expect(quote.length).toBeGreaterThan(0);
      expect(BILLY_QUOTES).toContain(quote);
    });

    test('should return different quotes on multiple calls', () => {
      const quotes = Array.from({ length: 20 }, () => getRandomBillyQuote());
      const uniqueQuotes = new Set(quotes);
      
      // With 10+ quotes, we should get some variety
      expect(uniqueQuotes.size).toBeGreaterThan(1);
    });
  });

  describe('GachiExpectation', () => {
    test('should support basic assertions', () => {
      const expectation = anticipate('test');
      expect(expectation).toBeInstanceOf(GachiExpectation);
      
      // Test that it wraps Jest expect properly
      expect(() => expectation.becomes('test')).not.toThrow();
      expect(() => expectation.becomes('wrong')).toThrow();
    });

    test('should support equality checks', () => {
      const obj = { name: 'Billy', power: 'Maximum' };
      
      anticipate(obj).matches({ name: 'Billy', power: 'Maximum' });
      anticipate(obj).deeplyMatches({ name: 'Billy', power: 'Maximum' });
    });

    test('should support truthiness checks', () => {
      anticipate(true).isTight();
      anticipate(false).isLoose();
      anticipate('non-empty').isTight();
      anticipate('').isLoose();
      anticipate(null).isLoose();
      anticipate(undefined).isLoose();
    });

    test('should support presence checks', () => {
      anticipate(null).isEmpty();
      anticipate(undefined).isMissing();
      anticipate('defined').exists();
      anticipate('not null').isPresent();
    });

    test('should support numeric comparisons', () => {
      anticipate(10).isBigger(5);
      anticipate(5).isSmaller(10);
      anticipate(10).isBiggerOrEqual(10);
      anticipate(5).isSmallerOrEqual(5);
      anticipate(3.14159).isCloseEnough(3.14, 2);
    });

    test('should support array and string operations', () => {
      anticipate([1, 2, 3]).holds(2);
      anticipate('hello world').holds('world');
      anticipate([1, 2, 3]).hasLength(3);
      anticipate('test').hasLength(4);
    });

    test('should support object properties', () => {
      const obj = { name: 'Billy', gym: 'Herrington Gym', level: 'Boss' };
      
      anticipate(obj).hasProperty('name');
      anticipate(obj).hasProperty('name', 'Billy');
      anticipate(obj).hasProperty('gym', 'Herrington Gym');
    });

    test('should support pattern matching', () => {
      anticipate('billy@gym.com').matchesPattern(/@gym\.com$/);
      anticipate('wrong@email.com').lacksPattern(/@gym\.com$/);
      anticipate('Boss of this gym').matchesPattern(/Boss/);
    });

    test('should support exception testing', () => {
      const throwingFn = () => { throw new Error('Gym is closed'); };
      const safeFn = () => 'All good';
      
      anticipate(throwingFn).explodes();
      anticipate(throwingFn).explodes(/Gym is closed/);
      anticipate(safeFn).staysCalm();
    });

    test('should support function call verification', () => {
      const mockFn = jest.fn();
      mockFn('arg1', 'arg2');
      mockFn('other');
      
      anticipate(mockFn).wasCalled();
      anticipate(mockFn).wasCalledTimes(2);
      anticipate(mockFn).wasCalledWith('arg1', 'arg2');
      anticipate(mockFn).wasLastCalledWith('other');
    });

    test('should support promise assertions', async () => {
      const resolvedPromise = Promise.resolve('gym membership');
      const rejectedPromise = Promise.reject(new Error('gym closed'));
      
      await anticipate(resolvedPromise).resolvesToBe('gym membership');
      await anticipate(rejectedPromise).rejectsWith(/gym closed/);
    });
  });

  describe('Mock and Spy Functions', () => {
    test('should create spies', () => {
      const spy = createSpy('testSpy');
      expect(jest.isMockFunction(spy)).toBe(true);
      
      spy('test');
      expect(spy).toHaveBeenCalledWith('test');
    });

    test('should spy on object methods', () => {
      const obj = {
        flex: () => 'flexing',
        pump: () => 'pumping'
      };
      
      const flexSpy = spyOn(obj, 'flex');
      obj.flex();
      
      expect(flexSpy).toHaveBeenCalled();
    });
  });

  describe('Test Structure Functions', () => {
    test('describeHole should be callable', () => {
      // This is a meta-test - we can't easily test the actual Jest integration
      expect(typeof describeHole).toBe('function');
    });

    test('itMuscle should be callable', () => {
      expect(typeof itMuscle).toBe('function');
    });

    test('probe should be callable', () => {
      expect(typeof probe).toBe('function');
    });

    test('lifecycle hooks should be callable', () => {
      expect(typeof beforeEachRound).toBe('function');
      expect(typeof afterEachRound).toBe('function');
      expect(typeof beforeShow).toBe('function');
      expect(typeof afterShow).toBe('function');
    });
  });
});

// Example of using GachiTest syntax in an actual test
describeHole('Example GachiTest Usage', () => {
  let gymEquipment: string[];

  beforeEachRound(() => {
    gymEquipment = ['dumbbells', 'barbell', 'bench'];
  });

  itMuscle('should handle gym equipment properly', () => {
    anticipate(gymEquipment).hasLength(3);
    anticipate(gymEquipment).holds('dumbbells');
    anticipate(gymEquipment).holds('barbell');
  });

  itMuscle('should test Billy\'s strength', () => {
    const billyStrength = 'Maximum';
    const otherStrength = 'Normal';
    
    anticipate(billyStrength).becomes('Maximum');
    anticipate(billyStrength).differs(otherStrength);
    anticipate(billyStrength).isTight();
  });

  itMuscle('should handle async gym sessions', async () => {
    const gymSession = new Promise(resolve => {
      setTimeout(() => resolve('Workout complete'), 10);
    });
    
    await anticipate(gymSession).resolvesToBe('Workout complete');
  });

  probe('should work with probe syntax too', () => {
    const result = 'probe successful';
    anticipate(result).matches('probe successful');
  });
});