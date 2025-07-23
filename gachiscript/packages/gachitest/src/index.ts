// Main GachiTest exports
export * from './gachitest';
export * from './test-processor';

// Re-export common Jest types for compatibility
export type {
  Config,
  Global,
  TestContext,
  TestResult
} from '@jest/types';

import {
  describeHole,
  itMuscle,
  probe,
  anticipate,
  beforeEachRound,
  afterEachRound,
  beforeShow,
  afterShow,
  createSpy,
  spyOn,
  clearAllMocks,
  resetAllMocks,
  restoreAllMocks,
  configureGachiTest,
  getGachiTestConfig,
  resetGachiTestConfig,
  BILLY_QUOTES,
  getRandomBillyQuote
} from './gachitest';

import { GachiTestProcessor } from './test-processor';

// Default exports for easy access
export {
  describeHole,
  itMuscle,
  probe,
  anticipate,
  beforeEachRound,
  afterEachRound,
  beforeShow,
  afterShow,
  createSpy,
  spyOn,
  clearAllMocks,
  resetAllMocks,
  restoreAllMocks,
  configureGachiTest,
  getGachiTestConfig,
  resetGachiTestConfig,
  BILLY_QUOTES,
  getRandomBillyQuote,
  GachiTestProcessor
};

// Quick setup function for projects
export function setupGachiTest(config?: {
  enableBillyQuotes?: boolean;
  verboseOutput?: boolean;
  autoTranspile?: boolean;
}) {
  configureGachiTest({
    enableGachiSyntax: true,
    billyQuotes: config?.enableBillyQuotes ?? true,
    verboseOutput: config?.verboseOutput ?? false,
    autoTranspile: config?.autoTranspile ?? true
  });

  if (config?.enableBillyQuotes !== false) {
    console.log(`🏋️ GachiTest initialized! ${getRandomBillyQuote()}`);
  }
}

// Global setup for easy import
declare global {
  var describeHole: typeof describeHole;
  var itMuscle: typeof itMuscle;
  var probe: typeof probe;
  var anticipate: typeof anticipate;
  var beforeEachRound: typeof beforeEachRound;
  var afterEachRound: typeof afterEachRound;
  var beforeShow: typeof beforeShow;
  var afterShow: typeof afterShow;
}

// Auto-setup if in test environment
if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
  setupGachiTest();
}