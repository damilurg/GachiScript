#!/usr/bin/env node
import {
  __require
} from "./chunk-3RG5ZIWI.js";

// src/cli.ts
import { Command } from "commander";
import chalk from "chalk";
import { runCLI } from "@jest/core";
import { promises as fs } from "fs";
import path from "path";
import { glob } from "glob";
import { gachiTransformer } from "@gachiscript/dictionary";
import { gachiTranspiler } from "@gachiscript/transpiler";
var program = new Command();
var banner = `
\u{1F525} ${chalk.red("GACHI")}${chalk.yellow("TEST")} \u{1F525}
${chalk.gray("DUNGEON MASTER IS READY FOR YOUR TESTS!")}
${chalk.blue("RIGHT VERSION!")}
`;
console.log(banner);
program.name("gachitest").description("\u{1F525} GachiTest - Jest wrapper with Gachi-style testing").version("1.0.0");
program.command("test").description("Run tests with GachiTest").argument("[pattern]", "Test file pattern", "**/*.{test,spec}.{js,ts,gachi}").option("-w, --watch", "Watch files for changes").option("--coverage", "Generate test coverage report").option("--verbose", "Verbose output").option("--gachi-reporter", "Use Gachi-themed test reporter").option("--quotes", "Add random Billy quotes to output").option("--transpile", "Auto-transpile .gachi files before testing").action(async (pattern, options) => {
  try {
    await runGachiTests(pattern, options);
  } catch (error) {
    console.error(chalk.red("\u{1F480} Tests failed:"), error);
    process.exit(1);
  }
});
program.command("create").description("Create a new GachiTest file").argument("<name>", "Test file name").option("-t, --template <template>", "Test template (basic, dungeon, performance)", "basic").option("-d, --directory <dir>", "Output directory", "./tests").action(async (name, options) => {
  try {
    await createTestFile(name, options);
  } catch (error) {
    console.error(chalk.red("\u{1F480} Failed to create test:"), error);
    process.exit(1);
  }
});
program.command("init").description("Initialize GachiTest in your project").option("--force", "Overwrite existing configuration").action(async (options) => {
  try {
    await initializeGachiTest(options);
  } catch (error) {
    console.error(chalk.red("\u{1F480} Initialization failed:"), error);
    process.exit(1);
  }
});
program.command("quote").description("Get a random Billy quote for motivation").action(() => {
  const quote = gachiTransformer.getRandomBillyQuote();
  console.log(chalk.yellow(`
\u{1F525} Billy says: "${quote}"
`));
});
async function runGachiTests(pattern, options) {
  console.log(chalk.blue("\u{1F3F0} Entering the test dungeon..."));
  const testFiles = await glob(pattern);
  if (testFiles.length === 0) {
    console.log(chalk.yellow("\u26A0\uFE0F No test files found!"));
    return;
  }
  console.log(chalk.gray(`\u{1F4C1} Found ${testFiles.length} test files`));
  if (options.transpile) {
    await transpileGachiTests(testFiles);
  }
  const jestConfig = {
    roots: ["<rootDir>"],
    testMatch: [pattern],
    testEnvironment: "node",
    setupFilesAfterEnv: [__require.resolve("./gachitest-setup.js")],
    collectCoverage: options.coverage,
    verbose: options.verbose,
    watchAll: options.watch,
    reporters: options.gachiReporter ? [__require.resolve("./gachi-reporter.js")] : ["default"]
  };
  if (options.quotes) {
    process.env.GACHITEST_QUOTES = "true";
  }
  try {
    const { results } = await runCLI(
      {
        ...jestConfig,
        _: [],
        $0: "gachitest"
      },
      [process.cwd()]
    );
    if (results.success) {
      console.log(chalk.green("\n\u{1F389} RIGHT VERSION! All tests passed!"));
    } else {
      console.log(chalk.red("\n\u274C WRONG VERSION! Some tests failed!"));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red("\u{1F480} Test execution failed:"), error);
    process.exit(1);
  }
}
async function transpileGachiTests(testFiles) {
  const gachiFiles = testFiles.filter((file) => file.endsWith(".gachi"));
  if (gachiFiles.length === 0) {
    return;
  }
  console.log(chalk.blue(`\u{1F504} Transpiling ${gachiFiles.length} .gachi test files...`));
  for (const file of gachiFiles) {
    const content = await fs.readFile(file, "utf-8");
    const result = gachiTranspiler.gachiToJs(content);
    if (result.errors && result.errors.length > 0) {
      console.error(chalk.red(`\u274C Failed to transpile ${file}:`));
      result.errors.forEach((error) => console.error(chalk.red(`  \u2022 ${error}`)));
      continue;
    }
    const jsFile = file.replace(".gachi", ".js");
    await fs.writeFile(jsFile, result.code, "utf-8");
    console.log(chalk.gray(`  \u2705 ${file} -> ${jsFile}`));
  }
}
async function createTestFile(name, options) {
  const { template, directory } = options;
  const fileName = name.endsWith(".gachi") ? name : `${name}.test.gachi`;
  const filePath = path.join(directory, fileName);
  await fs.mkdir(directory, { recursive: true });
  let content;
  switch (template) {
    case "dungeon":
      content = generateDungeonTemplate(name);
      break;
    case "performance":
      content = generatePerformanceTemplate(name);
      break;
    default:
      content = generateBasicTemplate(name);
      break;
  }
  await fs.writeFile(filePath, content, "utf-8");
  console.log(chalk.green(`\u2705 Created test file: ${filePath}`));
  console.log(chalk.gray("\u{1F525} RIGHT VERSION! Test file ready for domination!"));
}
function generateBasicTemplate(name) {
  const quote = gachiTransformer.getRandomBillyQuote();
  return `// ${quote}

describeHole('${name}', () => {
  beforeDomination(() => {
    // Setup before each test
  });

  afterCleanup(() => {
    // Cleanup after each test
  });

  itMuscle('should be tight and ready', () => {
    tight result = right;
    expectTight(result).toBeTight();
  });

  itPerformance('should perform with excellence', () => {
    tight value = 'DEEP DARK FANTASY';
    expectTight(value).toMoanWith('DEEP DARK FANTASY');
  });
});
`;
}
function generateDungeonTemplate(name) {
  return `// DUNGEON MASTER TEST SUITE

describeDungeon('${name} Dungeon', () => {
  flexible dungeonMaster;
  flexible prisoners = [];

  beforeEntering(() => {
    // Initialize the dungeon
    dungeonMaster = fresh DungeonMaster();
    prisoners = [];
  });

  afterLeaving(() => {
    // Clean up the dungeon
    dungeonMaster.destroy();
  });

  describeDungeon('Prisoner Management', () => {
    itMuscle('should capture new prisoners', () => {
      tight prisoner = { name: 'Billy', tightness: 'maximum' };
      dungeonMaster.capture(prisoner);
      
      expectTight(dungeonMaster.getPrisoners()).toContain(prisoner);
    });

    itPerformance('should release prisoners when done', () => {
      tight prisoner = { name: 'Van', status: 'captured' };
      dungeonMaster.capture(prisoner);
      dungeonMaster.release(prisoner);
      
      expectTight(dungeonMaster.getPrisoners()).not.toContain(prisoner);
    });
  });
});
`;
}
function generatePerformanceTemplate(name) {
  return `// PERFORMANCE TEST SUITE

describeHole('${name} Performance Tests', () => {
  flexible performanceMetrics;

  beforeDomination(() => {
    performanceMetrics = fresh PerformanceTracker();
  });

  itPerformance('should complete domination within time limit', delayed () => {
    tight startTime = Date.now();
    
    anticipate performanceMetrics.startDomination();
    
    tight endTime = Date.now();
    tight duration = endTime - startTime;
    
    expectTight(duration).toBeLessThan(1000); // Should complete in under 1 second
  });

  itMuscle('should handle multiple simultaneous performances', delayed () => {
    tight performances = [
      performanceMetrics.performance1(),
      performanceMetrics.performance2(),
      performanceMetrics.performance3()
    ];
    
    tight results = anticipate Promise.all(performances);
    
    expectTight(results).toHaveLength(3);
    results.forEach(result => {
      expectTight(result).toBeTight();
    });
  });
});
`;
}
async function initializeGachiTest(options) {
  console.log(chalk.blue("\u{1F3D7}\uFE0F Initializing GachiTest in your project..."));
  const configExists = await fs.access("gachitest.config.js").then(() => true).catch(() => false);
  if (configExists && !options.force) {
    console.log(chalk.yellow("\u26A0\uFE0F GachiTest already initialized. Use --force to overwrite."));
    return;
  }
  const configContent = `
// GachiTest Configuration - RIGHT VERSION!
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.{js,ts,gachi}',
    '**/*.(test|spec).{js,ts,gachi}'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['@gachiscript/gachitest'],
  
  // Transform .gachi files
  transform: {
    '\\\\.gachi$': '@gachiscript/gachitest/transformer'
  },
  
  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,ts,gachi}',
    '!src/**/*.d.ts'
  ],
  
  // GachiTest specific options
  gachiOptions: {
    addQuotes: true,
    strictMode: false,
    reporter: 'gachi'
  }
};
`.trim();
  await fs.writeFile("gachitest.config.js", configContent, "utf-8");
  const setupContent = `
// GachiTest Setup - DEEP DARK FANTASY SETUP!
import '@gachiscript/gachitest';

// Global test configuration
beforeAll(() => {
  console.log('\u{1F525} DUNGEON MASTER IS READY!');
});

afterAll(() => {
  console.log('\u{1F44B} THANK YOU SIR! Tests completed!');
});
`.trim();
  await fs.mkdir("__tests__", { recursive: true });
  await fs.writeFile("__tests__/setup.js", setupContent, "utf-8");
  const exampleTest = generateBasicTemplate("Example");
  await fs.writeFile("__tests__/example.test.gachi", exampleTest, "utf-8");
  try {
    const packageJsonPath = "package.json";
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    packageJson.scripts["test"] = "gachitest test";
    packageJson.scripts["test:watch"] = "gachitest test --watch";
    packageJson.scripts["test:coverage"] = "gachitest test --coverage";
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf-8");
    console.log(chalk.green("\u2705 Updated package.json scripts"));
  } catch (error) {
    console.log(chalk.yellow("\u26A0\uFE0F Could not update package.json automatically"));
  }
  console.log(chalk.green("\n\u{1F389} RIGHT VERSION! GachiTest initialized successfully!"));
  console.log(chalk.gray("\nFiles created:"));
  console.log(chalk.gray("  \u2022 gachitest.config.js"));
  console.log(chalk.gray("  \u2022 __tests__/setup.js"));
  console.log(chalk.gray("  \u2022 __tests__/example.test.gachi"));
  console.log(chalk.blue('\n\u{1F525} Run "gachitest test" to start testing!'));
}
program.parse();
