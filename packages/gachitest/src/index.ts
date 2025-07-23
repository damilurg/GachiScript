import { gachiTransformer } from '@gachiscript/dictionary';

// Re-export Jest types for convenience
export type { expect as ExpectType } from '@jest/types';

// Global GachiTest functions (Jest wrappers)
declare global {
  namespace GachiTest {
    interface GachiMatchers<R = void> {
      toBeTight(): R;
      toBeLoose(): R;
      toBeHard(): R;
      toBeSoft(): R;
      toBeDominated(): R;
      toBeDominant(): R;
      toMoanWith(expected: any): R;
      toPerformLike(expected: any): R;
      toBeInDungeon(dungeonName: string): R;
    }
  }

  var describeHole: typeof describe;
  var describeDungeon: typeof describe;
  var itMuscle: typeof it;
  var itPerformance: typeof it;
  var beforeDomination: typeof beforeEach;
  var afterCleanup: typeof afterEach;
  var beforeEntering: typeof beforeAll;
  var afterLeaving: typeof afterAll;
  var expectTight: typeof expect;
}

/**
 * GachiTest wrapper for Jest describe
 * Describes a test hole (suite)
 */
export function describeHole(name: string, fn: () => void): void {
  const gachiName = `🕳️ Hole: ${name}`;
  return describe(gachiName, fn);
}

/**
 * GachiTest wrapper for Jest describe with dungeon theme
 * Describes a test dungeon (suite)
 */
export function describeDungeon(name: string, fn: () => void): void {
  const gachiName = `🏰 Dungeon: ${name}`;
  return describe(gachiName, fn);
}

/**
 * GachiTest wrapper for Jest it with muscle theme
 * Defines a test case with muscle power
 */
export function itMuscle(name: string, fn?: () => void | Promise<void>, timeout?: number): void {
  const gachiName = `💪 Muscle: ${name}`;
  return it(gachiName, fn, timeout);
}

/**
 * GachiTest wrapper for Jest it with performance theme
 * Defines a test case with performance focus
 */
export function itPerformance(name: string, fn?: () => void | Promise<void>, timeout?: number): void {
  const gachiName = `🎭 Performance: ${name}`;
  return it(gachiName, fn, timeout);
}

/**
 * GachiTest wrapper for Jest beforeEach
 * Runs before each test with domination theme
 */
export function beforeDomination(fn: () => void | Promise<void>, timeout?: number): void {
  return beforeEach(fn, timeout);
}

/**
 * GachiTest wrapper for Jest afterEach
 * Runs after each test with cleanup theme
 */
export function afterCleanup(fn: () => void | Promise<void>, timeout?: number): void {
  return afterEach(fn, timeout);
}

/**
 * GachiTest wrapper for Jest beforeAll
 * Runs before all tests in suite
 */
export function beforeEntering(fn: () => void | Promise<void>, timeout?: number): void {
  return beforeAll(fn, timeout);
}

/**
 * GachiTest wrapper for Jest afterAll
 * Runs after all tests in suite
 */
export function afterLeaving(fn: () => void | Promise<void>, timeout?: number): void {
  return afterAll(fn, timeout);
}

/**
 * GachiTest wrapper for Jest expect
 * Enhanced expect with Gachi-style assertions
 */
export function expectTight<T>(actual: T): jest.Matchers<void> & GachiMatchers {
  const jestExpect = expect(actual) as jest.Matchers<void>;
  
  // Add custom GachiTest matchers
  const gachiMatchers: GachiMatchers = {
    toBeTight() {
      return jestExpect.toBeTruthy();
    },
    
    toBeLoose() {
      return jestExpect.toBeFalsy();
    },
    
    toBeHard() {
      return jestExpect.toBeDefined();
    },
    
    toBeSoft() {
      return jestExpect.toBeUndefined();
    },
    
    toBeDominated() {
      return jestExpect.toBeNull();
    },
    
    toBeDominant() {
      return jestExpect.not.toBeNull();
    },
    
    toMoanWith(expected: any) {
      return jestExpect.toEqual(expected);
    },
    
    toPerformLike(expected: any) {
      return jestExpect.toStrictEqual(expected);
    },
    
    toBeInDungeon(dungeonName: string) {
      if (typeof actual === 'object' && actual !== null) {
        const obj = actual as any;
        if (obj.constructor && obj.constructor.name === dungeonName) {
          return jestExpect.toBeTruthy();
        }
      }
      return jestExpect.toBeInstanceOf(dungeonName as any);
    }
  };

  return Object.assign(jestExpect, gachiMatchers);
}

// Type definition for GachiMatchers
interface GachiMatchers<R = void> {
  toBeTight(): R;
  toBeLoose(): R;
  toBeHard(): R;
  toBeSoft(): R;
  toBeDominated(): R;
  toBeDominant(): R;
  toMoanWith(expected: any): R;
  toPerformLike(expected: any): R;
  toBeInDungeon(dungeonName: string): R;
}

/**
 * GachiTest configuration
 */
export interface GachiTestConfig {
  /** Add Billy quotes to test output */
  addQuotes?: boolean;
  
  /** Use strict mode for assertions */
  strictMode?: boolean;
  
  /** Custom timeout for tests */
  timeout?: number;
  
  /** Enable verbose output */
  verbose?: boolean;
  
  /** Custom reporter for test results */
  reporter?: 'default' | 'gachi' | 'dungeon';
}

/**
 * Configure GachiTest behavior
 */
export function configureGachiTest(config: GachiTestConfig): void {
  // Apply configuration to Jest if needed
  if (config.timeout) {
    jest.setTimeout(config.timeout);
  }
  
  // Store config for later use
  (global as any).__GACHITEST_CONFIG__ = config;
}

/**
 * GachiTest utilities
 */
export class GachiTestUtils {
  /**
   * Generate a random Billy quote for test descriptions
   */
  static getRandomQuote(): string {
    return gachiTransformer.getRandomBillyQuote();
  }
  
  /**
   * Transform a test name to Gachi style
   */
  static gachiTransform(testName: string): string {
    return gachiTransformer.transformExpression(testName, true);
  }
  
  /**
   * Create a mock with Gachi naming
   */
  static createGachiMock<T = any>(name: string = 'GachiMock'): jest.Mock<T> {
    const mock = jest.fn() as jest.Mock<T>;
    mock.mockName(`🔥 ${name} Mock`);
    return mock;
  }
  
  /**
   * Create a spy with Gachi naming
   */
  static createGachiSpy<T extends {}>(object: T, methodName: keyof T): jest.SpyInstance {
    const spy = jest.spyOn(object, methodName);
    (spy as any).mockName(`👁️ ${String(methodName)} Spy`);
    return spy;
  }
  
  /**
   * Advanced assertion: expect multiple conditions (like a performance)
   */
  static expectPerformance(conditions: Array<() => void>): void {
    conditions.forEach((condition, index) => {
      try {
        condition();
      } catch (error) {
        throw new Error(`🎭 Performance failed at step ${index + 1}: ${error}`);
      }
    });
  }
}

/**
 * Gachi-themed test reporters
 */
export class GachiReporter {
  static logTestStart(testName: string): void {
    console.log(`🔥 Starting: ${testName}`);
  }
  
  static logTestPass(testName: string): void {
    console.log(`✅ RIGHT VERSION! ${testName}`);
  }
  
  static logTestFail(testName: string, error: any): void {
    console.log(`❌ WRONG VERSION! ${testName}`);
    console.log(`💀 Error: ${error.message}`);
  }
  
  static logSuiteStart(suiteName: string): void {
    console.log(`🏰 Entering dungeon: ${suiteName}`);
  }
  
  static logSuiteEnd(suiteName: string): void {
    console.log(`🚪 Leaving dungeon: ${suiteName}`);
  }
}

/**
 * Async testing utilities with Gachi theme
 */
export class GachiAsyncUtils {
  /**
   * Wait for domination (async operation) to complete
   */
  static async waitForDomination<T>(
    promise: Promise<T>, 
    timeout: number = 5000,
    errorMessage: string = 'Domination timeout!'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`⏰ ${errorMessage}`));
      }, timeout);
      
      promise
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }
  
  /**
   * Expect an async operation to moan (resolve) with a value
   */
  static async expectToMoanWith<T>(promise: Promise<T>, expected: T): Promise<void> {
    const result = await promise;
    expect(result).toEqual(expected);
  }
  
  /**
   * Expect an async operation to scream (reject) with an error
   */
  static async expectToScream(promise: Promise<any>, expectedError?: string): Promise<void> {
    try {
      await promise;
      throw new Error('Expected promise to reject, but it resolved');
    } catch (error) {
      if (expectedError && error instanceof Error) {
        expect(error.message).toContain(expectedError);
      }
    }
  }
}

/**
 * Mock factory for creating Gachi-themed mocks
 */
export class GachiMockFactory {
  /**
   * Create a mock dungeon master (class mock)
   */
  static createDungeonMaster(methods: string[] = []): any {
    const mock = {};
    methods.forEach(method => {
      (mock as any)[method] = jest.fn().mockName(`🏰 ${method}`);
    });
    return mock;
  }
  
  /**
   * Create a mock performance (function mock)
   */
  static createPerformance<T extends (...args: any[]) => any>(
    impl?: T
  ): jest.Mock<ReturnType<T>, Parameters<T>> {
    const mock = jest.fn(impl);
    mock.mockName('🎭 Performance Mock');
    return mock;
  }
  
  /**
   * Create a mock with tight responses (predefined return values)
   */
  static createTightMock<T>(responses: T[]): jest.Mock<T> {
    const mock = jest.fn();
    responses.forEach((response, index) => {
      mock.mockReturnValueOnce(response);
    });
    mock.mockName('🔒 Tight Mock');
    return mock;
  }
}

// Make functions available globally for test files
if (typeof global !== 'undefined') {
  (global as any).describeHole = describeHole;
  (global as any).describeDungeon = describeDungeon;
  (global as any).itMuscle = itMuscle;
  (global as any).itPerformance = itPerformance;
  (global as any).beforeDomination = beforeDomination;
  (global as any).afterCleanup = afterCleanup;
  (global as any).beforeEntering = beforeEntering;
  (global as any).afterLeaving = afterLeaving;
  (global as any).expectTight = expectTight;
}

// Export everything for explicit imports
export {
  GachiReporter,
  GachiAsyncUtils,
  GachiMockFactory
};