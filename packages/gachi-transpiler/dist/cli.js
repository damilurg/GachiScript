#!/usr/bin/env node
import {
  GachiTranspiler,
  gachiTranspiler
} from "./chunk-WKK3FWKH.js";

// src/cli.ts
import { Command } from "commander";
import chalk from "chalk";
import { promises as fs } from "fs";
import { glob } from "glob";
import path from "path";
import chokidar from "chokidar";
var program = new Command();
var banner = `
\u{1F525} ${chalk.red("GACHI")}${chalk.yellow("SCRIPT")} ${chalk.blue("TRANSPILER")} \u{1F525}
${chalk.gray("RIGHT VERSION! DEEP DARK FANTASY ACTIVATED!")}
`;
console.log(banner);
program.name("gachi").description("\u{1F525} GachiScript Transpiler - Transform between JS/TS and GachiScript").version("1.0.0");
program.command("build").description("Transform JavaScript/TypeScript files to GachiScript").argument("<input>", "Input file or directory").option("-o, --output <dir>", "Output directory", "./dist").option("-f, --framework <framework>", "Target framework (react, angular, vue)").option("--reverse", "Transform GachiScript back to JavaScript/TypeScript").option("--quotes", "Add random Billy quotes to the output").option("--strict", "Enable strict mode validation").option("--watch", "Watch for file changes").action(async (input, options) => {
  try {
    if (options.watch) {
      await watchFiles(input, options);
    } else {
      await buildFiles(input, options);
    }
  } catch (error) {
    console.error(chalk.red("\u{1F480} Build failed:"), error);
    process.exit(1);
  }
});
program.command("validate").description("Validate GachiScript syntax").argument("<input>", "Input GachiScript file").action(async (input) => {
  try {
    const content = await fs.readFile(input, "utf-8");
    const result = gachiTranspiler.validateGachiScript(content);
    if (result.valid) {
      console.log(chalk.green("\u2705 RIGHT VERSION! Your GachiScript is valid!"));
    } else {
      console.log(chalk.red("\u274C WRONG VERSION! Validation errors found:"));
      result.errors.forEach((error) => {
        console.log(chalk.red(`  \u2022 ${error}`));
      });
      if (result.suggestions.length > 0) {
        console.log(chalk.yellow("\n\u{1F4A1} Suggestions:"));
        result.suggestions.forEach((suggestion) => {
          console.log(chalk.yellow(`  \u2022 ${suggestion}`));
        });
      }
    }
  } catch (error) {
    console.error(chalk.red("\u{1F480} Validation failed:"), error);
    process.exit(1);
  }
});
program.command("info").description("Show GachiScript syntax information").option("-c, --category <category>", "Show specific category (keywords, operators, types, etc.)").action((options) => {
  showSyntaxInfo(options.category);
});
program.command("demo").description("Show GachiScript transformation demo").action(() => {
  showDemo();
});
async function buildFiles(input, options) {
  const stats = await fs.stat(input);
  if (stats.isDirectory()) {
    const pattern = path.join(input, "**/*.{ts,tsx,js,jsx,gachi}");
    const files = await glob(pattern);
    console.log(chalk.blue(`\u{1F4C1} Processing ${files.length} files...`));
    for (const file of files) {
      await processFile(file, options);
    }
  } else {
    await processFile(input, options);
  }
  console.log(chalk.green("\u{1F389} RIGHT VERSION! Build completed successfully!"));
}
async function processFile(filePath, options) {
  const content = await fs.readFile(filePath, "utf-8");
  const ext = path.extname(filePath);
  const isGachiFile = ext === ".gachi";
  console.log(chalk.gray(`\u{1F4C4} Processing: ${filePath}`));
  const framework = options.framework || GachiTranspiler.detectFramework(content);
  const transpilerOptions = {
    framework,
    addRandomQuotes: options.quotes,
    strictMode: options.strict,
    preserveComments: true
  };
  let result;
  let outputExt;
  if (options.reverse || isGachiFile) {
    result = gachiTranspiler.gachiToJs(content, transpilerOptions);
    outputExt = ext === ".gachi" ? ".js" : ext;
  } else {
    result = gachiTranspiler.jsToGachi(content, transpilerOptions);
    outputExt = ".gachi";
  }
  if (result.errors && result.errors.length > 0) {
    console.error(chalk.red(`\u274C Errors in ${filePath}:`));
    result.errors.forEach((error) => console.error(chalk.red(`  \u2022 ${error}`)));
    return;
  }
  if (result.warnings && result.warnings.length > 0) {
    console.warn(chalk.yellow(`\u26A0\uFE0F Warnings in ${filePath}:`));
    result.warnings.forEach((warning) => console.warn(chalk.yellow(`  \u2022 ${warning}`)));
  }
  const relativePath = path.relative(process.cwd(), filePath);
  const outputPath = path.join(options.output, relativePath.replace(ext, outputExt));
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, result.code, "utf-8");
  console.log(chalk.green(`\u2705 ${filePath} -> ${outputPath}`));
}
async function watchFiles(input, options) {
  console.log(chalk.blue("\u{1F440} WATCHING FOR CHANGES... DADDY IS READY!"));
  const pattern = path.isAbsolute(input) ? input : path.resolve(input);
  const watchPattern = path.join(pattern, "**/*.{ts,tsx,js,jsx,gachi}");
  chokidar.watch(watchPattern).on("change", async (filePath) => {
    console.log(chalk.yellow(`\u{1F504} File changed: ${filePath}`));
    try {
      await processFile(filePath, options);
      console.log(chalk.green("\u2705 Rebuild complete!"));
    } catch (error) {
      console.error(chalk.red("\u{1F480} Rebuild failed:"), error);
    }
  });
  process.on("SIGINT", () => {
    console.log(chalk.red("\n\u{1F44B} THANK YOU SIR! Stopping watch mode..."));
    process.exit(0);
  });
}
function showSyntaxInfo(category) {
  console.log(chalk.blue("\n\u{1F525} GACHISCRIPT SYNTAX GUIDE \u{1F525}\n"));
  if (!category || category === "keywords") {
    console.log(chalk.yellow("\u{1F4DD} KEYWORDS:"));
    console.log("  const \u2192 tight");
    console.log("  let \u2192 flexible");
    console.log("  function \u2192 performance");
    console.log("  class \u2192 dungeon");
    console.log("  if \u2192 whenHard");
    console.log("  return \u2192 deliver");
    console.log("  async \u2192 delayed");
    console.log("  await \u2192 anticipate\n");
  }
  if (!category || category === "operators") {
    console.log(chalk.yellow("\u{1F527} OPERATORS:"));
    console.log("  === \u2192 exactlyLike");
    console.log("  !== \u2192 totallyNot");
    console.log("  && \u2192 and");
    console.log("  || \u2192 or");
    console.log("  ++ \u2192 pump");
    console.log("  -- \u2192 drain\n");
  }
  if (!category || category === "types") {
    console.log(chalk.yellow("\u{1F3F7}\uFE0F TYPES:"));
    console.log("  string \u2192 verse");
    console.log("  number \u2192 count");
    console.log("  boolean \u2192 flag");
    console.log("  object \u2192 structure");
    console.log("  array \u2192 collection\n");
  }
  if (!category || category === "react") {
    console.log(chalk.yellow("\u269B\uFE0F REACT FRAMEWORK:"));
    console.log("  useState \u2192 manageTightness");
    console.log("  useEffect \u2192 onDomination");
    console.log("  Component \u2192 DungeonMaster");
    console.log("  props \u2192 gifts");
    console.log("  state \u2192 condition\n");
  }
}
function showDemo() {
  console.log(chalk.blue("\n\u{1F3AC} GACHISCRIPT DEMO \u{1F3AC}\n"));
  const jsCode = `
const name = "Billy";
function greet(user) {
  return "Hello " + user;
}
const result = greet(name);
console.log(result);
`.trim();
  console.log(chalk.yellow("\u{1F4DD} Original JavaScript:"));
  console.log(chalk.gray(jsCode));
  const gachiResult = gachiTranspiler.jsToGachi(jsCode);
  console.log(chalk.yellow("\n\u{1F525} Transformed GachiScript:"));
  console.log(chalk.green(gachiResult.code));
  console.log(chalk.yellow("\n\u{1F504} Back to JavaScript:"));
  const jsResult = gachiTranspiler.gachiToJs(gachiResult.code);
  console.log(chalk.gray(jsResult.code));
  console.log(chalk.blue("\n\u2728 RIGHT VERSION! DEEP DARK FANTASY COMPLETED! \u2728"));
}
program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => cmd.name() + " " + cmd.usage()
});
program.parse();
