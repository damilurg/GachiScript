import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, jest } from '@jest/globals';
import { transpileToJs } from '@gachiscript/transpiler';

/**
 * GachiTest - Jest wrapper with Billy Herrington inspired testing syntax
 * "You gotta test it, boy!"
 */

// Global configuration for GachiTest
export interface GachiTestConfig {
  enableGachiSyntax: boolean;
  verboseOutput: boolean;
  billyQuotes: boolean;
  autoTranspile: boolean;
}

const defaultConfig: GachiTestConfig = {
  enableGachiSyntax: true,
  verboseOutput: false,
  billyQuotes: true,
  autoTranspile: true
};

let gachiConfig: GachiTestConfig = { ...defaultConfig };

// Billy Herrington motivational quotes for test output
const BILLY_QUOTES = [
  "♂ That turns me on ♂",
  "♂ Oh shit, I'm sorry ♂",
  "♂ Fisting is 300 bucks ♂",
  "♂ Take it boy ♂",
  "♂ Deep dark fantasy ♂",
  "♂ Get your ass back here ♂",
  "♂ Boss of this gym ♂",
  "♂ Stick your finger in my ass ♂",
  "♂ Performance ♂",
  "♂ Fucking slaves ♂"
];

function getRandomBillyQuote(): string {
  return BILLY_QUOTES[Math.floor(Math.random() * BILLY_QUOTES.length)];
}

// Core GachiTest functions
/**
 * describeHole - Like describe(), but with more Gachi energy
 * @param suiteName The name of the test suite
 * @param fn The test suite function
 */
export function describeHole(suiteName: string, fn: () => void): void {
  if (gachiConfig.verboseOutput) {
    console.log(`🏋️ Starting test hole: ${suiteName}`);
  }
  
  return describe(suiteName, () => {
    if (gachiConfig.billyQuotes) {
      console.log(`💪 ${getRandomBillyQuote()}`);
    }
    fn();
  });
}

/**
 * itMuscle - Like it(), but with Billy's power
 * @param testName The name of the test
 * @param fn The test function
 */
export function itMuscle(testName: string, fn: () => void | Promise<void>): void {
  return it(testName, async () => {
    if (gachiConfig.verboseOutput) {
      console.log(`💪 Flexing muscle: ${testName}`);
    }
    
    try {
      await fn();
      if (gachiConfig.verboseOutput) {
        console.log(`✅ Muscle test passed: ${testName}`);
      }
    } catch (error) {
      if (gachiConfig.verboseOutput) {
        console.log(`❌ Muscle test failed: ${testName}`);
      }
      throw error;
    }
  });
}

/**
 * probe - Like test(), alternative to itMuscle
 * @param testName The name of the test
 * @param fn The test function
 */
export function probe(testName: string, fn: () => void | Promise<void>): void {
  return test(testName, fn);
}

// Enhanced expectation functions with Gachi flavor
/**
 * anticipate - Like expect(), but with anticipation
 * @param actual The actual value to test
 */
export function anticipate<T>(actual: T): GachiExpectation<T> {
  const jestExpectation = expect(actual);
  return new GachiExpectation(jestExpectation, actual);
}

/**
 * GachiExpectation - Enhanced expectation object with Gachi methods
 */
export class GachiExpectation<T> {
  constructor(
    private jestExpectation: jest.Matchers<T>,
    private actual: T
  ) {}

  // Core assertions with Gachi naming
  becomes(expected: T): void {
    return this.jestExpectation.toBe(expected);
  }

  matches(expected: T): void {
    return this.jestExpectation.toEqual(expected);
  }

  deeplyMatches(expected: T): void {
    return this.jestExpectation.toStrictEqual(expected);
  }

  differs(expected: T): void {
    return this.jestExpectation.not.toBe(expected);
  }

  deeplyDiffers(expected: T): void {
    return this.jestExpectation.not.toStrictEqual(expected);
  }

  isEmpty(): void {
    return this.jestExpectation.toBeNull();
  }

  isMissing(): void {
    return this.jestExpectation.toBeUndefined();
  }

  exists(): void {
    return this.jestExpectation.toBeDefined();
  }

  isPresent(): void {
    return this.jestExpectation.not.toBeNull();
  }

  isTight(): void {
    return this.jestExpectation.toBeTruthy();
  }

  isLoose(): void {
    return this.jestExpectation.toBeFalsy();
  }

  holds(expected: any): void {
    return this.jestExpectation.toContain(expected);
  }

  lacksHold(expected: any): void {
    return this.jestExpectation.not.toContain(expected);
  }

  explodes(error?: string | RegExp | Error): void {
    return this.jestExpectation.toThrow(error);
  }

  staysCalm(): void {
    return this.jestExpectation.not.toThrow();
  }

  // Numeric comparisons with Gachi flair
  isBigger(expected: number): void {
    return (this.jestExpectation as any).toBeGreaterThan(expected);
  }

  isSmaller(expected: number): void {
    return (this.jestExpectation as any).toBeLessThan(expected);
  }

  isBiggerOrEqual(expected: number): void {
    return (this.jestExpectation as any).toBeGreaterThanOrEqual(expected);
  }

  isSmallerOrEqual(expected: number): void {
    return (this.jestExpectation as any).toBeLessThanOrEqual(expected);
  }

  isCloseEnough(expected: number, precision?: number): void {
    return (this.jestExpectation as any).toBeCloseTo(expected, precision);
  }

  // String and pattern matching
  matchesPattern(pattern: RegExp | string): void {
    return (this.jestExpectation as any).toMatch(pattern);
  }

  lacksPattern(pattern: RegExp | string): void {
    return (this.jestExpectation as any).not.toMatch(pattern);
  }

  hasLength(length: number): void {
    return (this.jestExpectation as any).toHaveLength(length);
  }

  hasProperty(property: string, value?: any): void {
    if (value !== undefined) {
      return (this.jestExpectation as any).toHaveProperty(property, value);
    }
    return (this.jestExpectation as any).toHaveProperty(property);
  }

  // Function and call verification
  wasCalledWith(...args: any[]): void {
    return (this.jestExpectation as any).toHaveBeenCalledWith(...args);
  }

  wasCalledTimes(times: number): void {
    return (this.jestExpectation as any).toHaveBeenCalledTimes(times);
  }

  wasCalled(): void {
    return (this.jestExpectation as any).toHaveBeenCalled();
  }

  wasNeverCalled(): void {
    return (this.jestExpectation as any).not.toHaveBeenCalled();
  }

  wasLastCalledWith(...args: any[]): void {
    return (this.jestExpectation as any).toHaveBeenLastCalledWith(...args);
  }

  returnedWith(value: any): void {
    return (this.jestExpectation as any).toHaveReturnedWith(value);
  }

  returnedTimes(times: number): void {
    return (this.jestExpectation as any).toHaveReturnedTimes(times);
  }

  // Promise and async testing
  async resolvesToBe(expected: any): Promise<void> {
    return (this.jestExpectation as any).resolves.toBe(expected);
  }

  async rejectsWith(error?: any): Promise<void> {
    return (this.jestExpectation as any).rejects.toThrow(error);
  }

  // Custom matchers can be added here
  // satisfies(predicate: (value: T) => boolean): void {
  //   return this.jestExpectation.toSatisfy(predicate);
  // }
}

// Lifecycle hooks with Gachi naming
/**
 * beforeEachRound - Like beforeEach(), but with wrestling terminology
 */
export function beforeEachRound(fn: () => void | Promise<void>): void {
  return beforeEach(fn);
}

/**
 * afterEachRound - Like afterEach(), for post-match cleanup
 */
export function afterEachRound(fn: () => void | Promise<void>): void {
  return afterEach(fn);
}

/**
 * beforeShow - Like beforeAll(), for pre-show preparation
 */
export function beforeShow(fn: () => void | Promise<void>): void {
  return beforeAll(fn);
}

/**
 * afterShow - Like afterAll(), for post-show cleanup
 */
export function afterShow(fn: () => void | Promise<void>): void {
  return afterAll(fn);
}

// Mock and spy functions with Gachi flavor
/**
 * createSpy - Create a jest spy function
 */
export function createSpy(name?: string): jest.Mock {
  return jest.fn();
}

/**
 * spyOn - Spy on an object method
 */
export function spyOn<T, K extends keyof T>(object: T, method: K): jest.SpyInstance<T[K]> {
  return jest.spyOn(object, method);
}

/**
 * mockImplementation - Mock a function implementation
 */
export function mockImplementation<T extends (...args: any[]) => any>(
  mockFn: jest.Mock<T>,
  implementation: T
): jest.Mock<T> {
  return mockFn.mockImplementation(implementation);
}

/**
 * clearAllMocks - Clear all mocks
 */
export function clearAllMocks(): void {
  return jest.clearAllMocks();
}

/**
 * resetAllMocks - Reset all mocks
 */
export function resetAllMocks(): void {
  return jest.resetAllMocks();
}

/**
 * restoreAllMocks - Restore all mocks
 */
export function restoreAllMocks(): void {
  return jest.restoreAllMocks();
}

// Configuration functions
/**
 * Configure GachiTest behavior
 */
export function configureGachiTest(config: Partial<GachiTestConfig>): void {
  gachiConfig = { ...gachiConfig, ...config };
}

/**
 * Get current GachiTest configuration
 */
export function getGachiTestConfig(): GachiTestConfig {
  return { ...gachiConfig };
}

/**
 * Reset GachiTest configuration to defaults
 */
export function resetGachiTestConfig(): void {
  gachiConfig = { ...defaultConfig };
}

// Utility functions for test writing
/**
 * skipTest - Skip a test with Billy's approval
 */
export function skipTest(reason?: string): void {
  const message = reason ? `Skipping test: ${reason}` : "Billy says skip this one";
  if (gachiConfig.verboseOutput) {
    console.log(`⏭️ ${message}`);
  }
}

/**
 * onlyTest - Run only this test
 */
export function onlyTest(testName: string, fn: () => void | Promise<void>): void {
  return it.only(testName, fn);
}

/**
 * todoTest - Mark a test as TODO
 */
export function todoTest(testName: string): void {
  return it.todo(testName);
}

// Export all Jest functions for compatibility
export {
  describe,
  it,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  jest
};

// Export Billy quotes for external use
export { BILLY_QUOTES, getRandomBillyQuote };