import "./chunk-3RG5ZIWI.js";

// src/index.ts
import { gachiTransformer } from "@gachiscript/dictionary";
function describeHole(name, fn) {
  const gachiName = `\u{1F573}\uFE0F Hole: ${name}`;
  return describe(gachiName, fn);
}
function describeDungeon(name, fn) {
  const gachiName = `\u{1F3F0} Dungeon: ${name}`;
  return describe(gachiName, fn);
}
function itMuscle(name, fn, timeout) {
  const gachiName = `\u{1F4AA} Muscle: ${name}`;
  return it(gachiName, fn, timeout);
}
function itPerformance(name, fn, timeout) {
  const gachiName = `\u{1F3AD} Performance: ${name}`;
  return it(gachiName, fn, timeout);
}
function beforeDomination(fn, timeout) {
  return beforeEach(fn, timeout);
}
function afterCleanup(fn, timeout) {
  return afterEach(fn, timeout);
}
function beforeEntering(fn, timeout) {
  return beforeAll(fn, timeout);
}
function afterLeaving(fn, timeout) {
  return afterAll(fn, timeout);
}
function expectTight(actual) {
  const jestExpect = expect(actual);
  const gachiMatchers = {
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
    toMoanWith(expected) {
      return jestExpect.toEqual(expected);
    },
    toPerformLike(expected) {
      return jestExpect.toStrictEqual(expected);
    },
    toBeInDungeon(dungeonName) {
      if (typeof actual === "object" && actual !== null) {
        const obj = actual;
        if (obj.constructor && obj.constructor.name === dungeonName) {
          return jestExpect.toBeTruthy();
        }
      }
      return jestExpect.toBeInstanceOf(dungeonName);
    }
  };
  return Object.assign(jestExpect, gachiMatchers);
}
function configureGachiTest(config) {
  if (config.timeout) {
    jest.setTimeout(config.timeout);
  }
  global.__GACHITEST_CONFIG__ = config;
}
var GachiTestUtils = class {
  /**
   * Generate a random Billy quote for test descriptions
   */
  static getRandomQuote() {
    return gachiTransformer.getRandomBillyQuote();
  }
  /**
   * Transform a test name to Gachi style
   */
  static gachiTransform(testName) {
    return gachiTransformer.transformExpression(testName, true);
  }
  /**
   * Create a mock with Gachi naming
   */
  static createGachiMock(name = "GachiMock") {
    const mock = jest.fn();
    mock.mockName(`\u{1F525} ${name} Mock`);
    return mock;
  }
  /**
   * Create a spy with Gachi naming
   */
  static createGachiSpy(object, methodName) {
    const spy = jest.spyOn(object, methodName);
    spy.mockName(`\u{1F441}\uFE0F ${String(methodName)} Spy`);
    return spy;
  }
  /**
   * Advanced assertion: expect multiple conditions (like a performance)
   */
  static expectPerformance(conditions) {
    conditions.forEach((condition, index) => {
      try {
        condition();
      } catch (error) {
        throw new Error(`\u{1F3AD} Performance failed at step ${index + 1}: ${error}`);
      }
    });
  }
};
var GachiReporter = class {
  static logTestStart(testName) {
    console.log(`\u{1F525} Starting: ${testName}`);
  }
  static logTestPass(testName) {
    console.log(`\u2705 RIGHT VERSION! ${testName}`);
  }
  static logTestFail(testName, error) {
    console.log(`\u274C WRONG VERSION! ${testName}`);
    console.log(`\u{1F480} Error: ${error.message}`);
  }
  static logSuiteStart(suiteName) {
    console.log(`\u{1F3F0} Entering dungeon: ${suiteName}`);
  }
  static logSuiteEnd(suiteName) {
    console.log(`\u{1F6AA} Leaving dungeon: ${suiteName}`);
  }
};
var GachiAsyncUtils = class {
  /**
   * Wait for domination (async operation) to complete
   */
  static async waitForDomination(promise, timeout = 5e3, errorMessage = "Domination timeout!") {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`\u23F0 ${errorMessage}`));
      }, timeout);
      promise.then((result) => {
        clearTimeout(timer);
        resolve(result);
      }).catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }
  /**
   * Expect an async operation to moan (resolve) with a value
   */
  static async expectToMoanWith(promise, expected) {
    const result = await promise;
    expect(result).toEqual(expected);
  }
  /**
   * Expect an async operation to scream (reject) with an error
   */
  static async expectToScream(promise, expectedError) {
    try {
      await promise;
      throw new Error("Expected promise to reject, but it resolved");
    } catch (error) {
      if (expectedError && error instanceof Error) {
        expect(error.message).toContain(expectedError);
      }
    }
  }
};
var GachiMockFactory = class {
  /**
   * Create a mock dungeon master (class mock)
   */
  static createDungeonMaster(methods = []) {
    const mock = {};
    methods.forEach((method) => {
      mock[method] = jest.fn().mockName(`\u{1F3F0} ${method}`);
    });
    return mock;
  }
  /**
   * Create a mock performance (function mock)
   */
  static createPerformance(impl) {
    const mock = jest.fn(impl);
    mock.mockName("\u{1F3AD} Performance Mock");
    return mock;
  }
  /**
   * Create a mock with tight responses (predefined return values)
   */
  static createTightMock(responses) {
    const mock = jest.fn();
    responses.forEach((response, index) => {
      mock.mockReturnValueOnce(response);
    });
    mock.mockName("\u{1F512} Tight Mock");
    return mock;
  }
};
if (typeof global !== "undefined") {
  global.describeHole = describeHole;
  global.describeDungeon = describeDungeon;
  global.itMuscle = itMuscle;
  global.itPerformance = itPerformance;
  global.beforeDomination = beforeDomination;
  global.afterCleanup = afterCleanup;
  global.beforeEntering = beforeEntering;
  global.afterLeaving = afterLeaving;
  global.expectTight = expectTight;
}
export {
  GachiAsyncUtils,
  GachiMockFactory,
  GachiReporter,
  GachiTestUtils,
  afterCleanup,
  afterLeaving,
  beforeDomination,
  beforeEntering,
  configureGachiTest,
  describeDungeon,
  describeHole,
  expectTight,
  itMuscle,
  itPerformance
};
