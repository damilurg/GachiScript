// GachiCore: Heart of GachiScript
// Written in TypeScript for max compatibility
import {GachiSyntaxMapper} from "./dictionary/dictionary";

// GachiCore transpiler
export function transpileGachiScript(code: string): string {
    const keywords = Object.entries(GachiSyntaxMapper);
    return keywords.reduce((output, [gachiWord, realWord]) => {
        const regex = new RegExp(`\\b${gachiWord}\\b`, 'g');
        return output.replace(regex, realWord);
    }, code);
}

// Example usage
const gachiCode = `
firmConst daddy = () => {
  muscleLoop (tightVar i = 0; i < 10; i++) {
    logMoan(i);
  }
};
`;

const transpiled = transpileGachiScript(gachiCode);
console.log(transpiled);
