export * from './transpiler';
export * from './file-processor';

// Re-export dictionary for convenience
export * from '@gachiscript/dictionary';

import { GachiTranspiler } from './transpiler';
import { GachiFileProcessor } from './file-processor';

// Default instances for convenience
export const gachiTranspiler = new GachiTranspiler();
export const gachiFileProcessor = new GachiFileProcessor();

// Quick utility functions
export const transpileToGachi = (code: string, filename?: string) => gachiTranspiler.jsToGachi(code, filename);
export const transpileToJs = (code: string, filename?: string) => gachiTranspiler.gachiToJs(code, filename);