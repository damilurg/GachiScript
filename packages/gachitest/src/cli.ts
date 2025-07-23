#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { runCLI } from '@jest/core';
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { gachiTransformer } from '@gachiscript/dictionary';
import { gachiTranspiler } from '@gachiscript/transpiler';

const program = new Command();

// ASCII Art Banner
const banner = `
🔥 ${chalk.red('GACHI')}${chalk.yellow('TEST')} 🔥
${chalk.gray('DUNGEON MASTER IS READY FOR YOUR TESTS!')}
${chalk.blue('RIGHT VERSION!')}
`;

console.log(banner);

program
  .name('gachitest')
  .description('🔥 GachiTest - Jest wrapper with Gachi-style testing')
  .version('1.0.0');

// Test command (default)
program
  .command('test')
  .description('Run tests with GachiTest')
  .argument('[pattern]', 'Test file pattern', '**/*.{test,spec}.{js,ts,gachi}')
  .option('-w, --watch', 'Watch files for changes')
  .option('--coverage', 'Generate test coverage report')
  .option('--verbose', 'Verbose output')
  .option('--gachi-reporter', 'Use Gachi-themed test reporter')
  .option('--quotes', 'Add random Billy quotes to output')
  .option('--transpile', 'Auto-transpile .gachi files before testing')
  .action(async (pattern, options) => {
    try {
      await runGachiTests(pattern, options);
    } catch (error) {
      console.error(chalk.red('💀 Tests failed:'), error);
      process.exit(1);
    }
  });

// Create test command
program
  .command('create')
  .description('Create a new GachiTest file')
  .argument('<name>', 'Test file name')
  .option('-t, --template <template>', 'Test template (basic, dungeon, performance)', 'basic')
  .option('-d, --directory <dir>', 'Output directory', './tests')
  .action(async (name, options) => {
    try {
      await createTestFile(name, options);
    } catch (error) {
      console.error(chalk.red('💀 Failed to create test:'), error);
      process.exit(1);
    }
  });

// Init command
program
  .command('init')
  .description('Initialize GachiTest in your project')
  .option('--force', 'Overwrite existing configuration')
  .action(async (options) => {
    try {
      await initializeGachiTest(options);
    } catch (error) {
      console.error(chalk.red('💀 Initialization failed:'), error);
      process.exit(1);
    }
  });

// Quote command
program
  .command('quote')
  .description('Get a random Billy quote for motivation')
  .action(() => {
    const quote = gachiTransformer.getRandomBillyQuote();
    console.log(chalk.yellow(`\n🔥 Billy says: "${quote}"\n`));
  });

async function runGachiTests(pattern: string, options: any): Promise<void> {
  console.log(chalk.blue('🏰 Entering the test dungeon...'));
  
  // Find test files
  const testFiles = await glob(pattern);
  
  if (testFiles.length === 0) {
    console.log(chalk.yellow('⚠️ No test files found!'));
    return;
  }
  
  console.log(chalk.gray(`📁 Found ${testFiles.length} test files`));
  
  // Transpile .gachi files if needed
  if (options.transpile) {
    await transpileGachiTests(testFiles);
  }
  
  // Configure Jest options
  const jestConfig = {
    roots: ['<rootDir>'],
    testMatch: [pattern],
    testEnvironment: 'node',
    setupFilesAfterEnv: [require.resolve('./gachitest-setup.js')],
    collectCoverage: options.coverage,
    verbose: options.verbose,
    watchAll: options.watch,
    reporters: options.gachiReporter 
      ? [require.resolve('./gachi-reporter.js')] 
      : ['default']
  };
  
  // Add quotes configuration
  if (options.quotes) {
    process.env.GACHITEST_QUOTES = 'true';
  }
  
  try {
    const { results } = await runCLI(
      {
        ...jestConfig,
        _: [],
        $0: 'gachitest'
      } as any,
      [process.cwd()]
    );
    
    // Custom result reporting
    if (results.success) {
      console.log(chalk.green('\n🎉 RIGHT VERSION! All tests passed!'));
    } else {
      console.log(chalk.red('\n❌ WRONG VERSION! Some tests failed!'));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('💀 Test execution failed:'), error);
    process.exit(1);
  }
}

async function transpileGachiTests(testFiles: string[]): Promise<void> {
  const gachiFiles = testFiles.filter(file => file.endsWith('.gachi'));
  
  if (gachiFiles.length === 0) {
    return;
  }
  
  console.log(chalk.blue(`🔄 Transpiling ${gachiFiles.length} .gachi test files...`));
  
  for (const file of gachiFiles) {
    const content = await fs.readFile(file, 'utf-8');
    const result = gachiTranspiler.gachiToJs(content);
    
    if (result.errors && result.errors.length > 0) {
      console.error(chalk.red(`❌ Failed to transpile ${file}:`));
      result.errors.forEach(error => console.error(chalk.red(`  • ${error}`)));
      continue;
    }
    
    // Write transpiled version
    const jsFile = file.replace('.gachi', '.js');
    await fs.writeFile(jsFile, result.code, 'utf-8');
    console.log(chalk.gray(`  ✅ ${file} -> ${jsFile}`));
  }
}

async function createTestFile(name: string, options: any): Promise<void> {
  const { template, directory } = options;
  const fileName = name.endsWith('.gachi') ? name : `${name}.test.gachi`;
  const filePath = path.join(directory, fileName);
  
  // Ensure directory exists
  await fs.mkdir(directory, { recursive: true });
  
  // Generate test content based on template
  let content: string;
  
  switch (template) {
    case 'dungeon':
      content = generateDungeonTemplate(name);
      break;
    case 'performance':
      content = generatePerformanceTemplate(name);
      break;
    default:
      content = generateBasicTemplate(name);
      break;
  }
  
  await fs.writeFile(filePath, content, 'utf-8');
  
  console.log(chalk.green(`✅ Created test file: ${filePath}`));
  console.log(chalk.gray('🔥 RIGHT VERSION! Test file ready for domination!'));
}

function generateBasicTemplate(name: string): string {
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

function generateDungeonTemplate(name: string): string {
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

function generatePerformanceTemplate(name: string): string {
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

async function initializeGachiTest(options: any): Promise<void> {
  console.log(chalk.blue('🏗️ Initializing GachiTest in your project...'));
  
  // Check if already initialized
  const configExists = await fs.access('gachitest.config.js').then(() => true).catch(() => false);
  
  if (configExists && !options.force) {
    console.log(chalk.yellow('⚠️ GachiTest already initialized. Use --force to overwrite.'));
    return;
  }
  
  // Create configuration file
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
  
  await fs.writeFile('gachitest.config.js', configContent, 'utf-8');
  
  // Create setup file
  const setupContent = `
// GachiTest Setup - DEEP DARK FANTASY SETUP!
import '@gachiscript/gachitest';

// Global test configuration
beforeAll(() => {
  console.log('🔥 DUNGEON MASTER IS READY!');
});

afterAll(() => {
  console.log('👋 THANK YOU SIR! Tests completed!');
});
`.trim();
  
  await fs.mkdir('__tests__', { recursive: true });
  await fs.writeFile('__tests__/setup.js', setupContent, 'utf-8');
  
  // Create example test
  const exampleTest = generateBasicTemplate('Example');
  await fs.writeFile('__tests__/example.test.gachi', exampleTest, 'utf-8');
  
  // Update package.json if it exists
  try {
    const packageJsonPath = 'package.json';
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    packageJson.scripts['test'] = 'gachitest test';
    packageJson.scripts['test:watch'] = 'gachitest test --watch';
    packageJson.scripts['test:coverage'] = 'gachitest test --coverage';
    
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
    console.log(chalk.green('✅ Updated package.json scripts'));
  } catch (error) {
    console.log(chalk.yellow('⚠️ Could not update package.json automatically'));
  }
  
  console.log(chalk.green('\n🎉 RIGHT VERSION! GachiTest initialized successfully!'));
  console.log(chalk.gray('\nFiles created:'));
  console.log(chalk.gray('  • gachitest.config.js'));
  console.log(chalk.gray('  • __tests__/setup.js'));
  console.log(chalk.gray('  • __tests__/example.test.gachi'));
  console.log(chalk.blue('\n🔥 Run "gachitest test" to start testing!'));
}

program.parse();