#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { GachiTestProcessor } = require('../dist/test-processor');
const { getRandomBillyQuote, BILLY_QUOTES } = require('../dist/gachitest');

const program = new Command();

// ASCII Art Header for GachiTest
const gachiTestHeader = `
${chalk.bold.yellow('████████╗███████╗███████╗████████╗')}
${chalk.bold.yellow('╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝')}
${chalk.bold.yellow('   ██║   █████╗  ███████╗   ██║   ')}
${chalk.bold.yellow('   ██║   ██╔══╝  ╚════██║   ██║   ')}
${chalk.bold.yellow('   ██║   ███████╗███████║   ██║   ')}
${chalk.bold.yellow('   ╚═╝   ╚══════╝╚══════╝   ╚═╝   ')}
${chalk.bold.magenta('           GachiTest Framework')}
${chalk.gray('        "You gotta test it, boy!" 💪')}
`;

// Helper functions
function showHeader() {
  console.log(gachiTestHeader);
  console.log(`💪 ${chalk.bold.magenta(getRandomBillyQuote())}`);
  console.log();
}

function findJestExecutable() {
  // Try to find Jest executable
  const possiblePaths = [
    path.join(process.cwd(), 'node_modules', '.bin', 'jest'),
    path.join(process.cwd(), 'node_modules', '.bin', 'jest.cmd'),
    'jest', // Global installation
    'npx jest' // Via npx
  ];

  for (const jestPath of possiblePaths) {
    try {
      if (fs.existsSync(jestPath) || jestPath === 'jest' || jestPath === 'npx jest') {
        return jestPath;
      }
    } catch (error) {
      // Continue searching
    }
  }

  throw new Error('Jest executable not found. Please install Jest: npm install --save-dev jest');
}

function createJestConfig(options = {}) {
  const baseConfig = {
    testEnvironment: 'node',
    testMatch: [
      '**/__tests__/**/*.(js|jsx|ts|tsx)',
      '**/*.(test|spec).(js|jsx|ts|tsx)',
      '**/*.gachi.(test|spec).(js|jsx|ts|tsx)'
    ],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest'
    },
    setupFilesAfterEnv: [
      require.resolve('../dist/index.js')
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverageFrom: [
      'src/**/*.(ts|tsx|js|jsx)',
      '!src/**/*.d.ts',
      '!src/**/*.test.*',
      '!src/**/*.spec.*'
    ],
    ...options
  };

  return baseConfig;
}

async function runJest(jestArgs, options = {}) {
  const jestExecutable = findJestExecutable();
  
  // Create temporary Jest config
  const jestConfig = createJestConfig(options.jestConfig);
  const configPath = path.join(process.cwd(), '.gachitest.config.js');
  
  const configContent = `module.exports = ${JSON.stringify(jestConfig, null, 2)};`;
  fs.writeFileSync(configPath, configContent);

  try {
    // Prepare Jest arguments
    const args = ['--config', configPath, ...jestArgs];
    
    if (options.verbose) {
      console.log(`🏋️ Running Jest with: ${jestExecutable} ${args.join(' ')}`);
    }

    // Run Jest
    const jestProcess = spawn(jestExecutable, args, {
      stdio: 'inherit',
      shell: true
    });

    return new Promise((resolve, reject) => {
      jestProcess.on('close', (code) => {
        // Clean up temporary config
        try {
          fs.unlinkSync(configPath);
        } catch (error) {
          // Ignore cleanup errors
        }

        if (code === 0) {
          console.log();
          console.log(`✅ ${chalk.green('All tests passed!')} ${getRandomBillyQuote()}`);
          resolve(0);
        } else {
          console.log();
          console.log(`❌ ${chalk.red('Some tests failed.')} Billy believes in you - try again!`);
          reject(code);
        }
      });

      jestProcess.on('error', (error) => {
        // Clean up temporary config
        try {
          fs.unlinkSync(configPath);
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
        
        console.error(chalk.red('Failed to run Jest:'), error.message);
        reject(1);
      });
    });
  } catch (error) {
    // Clean up temporary config
    try {
      fs.unlinkSync(configPath);
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    throw error;
  }
}

// Main program configuration
program
  .name('gachitest')
  .description('🏋️ GachiTest - Jest with Billy Herrington\'s testing power')
  .version('1.0.0')
  .hook('preAction', () => {
    showHeader();
  });

// Run command - the main test runner
program
  .command('run')
  .description('🏃 Run tests with Gachi power')
  .option('-w, --watch', 'Watch files for changes and rerun tests')
  .option('-c, --coverage', 'Collect test coverage information')
  .option('-v, --verbose', 'Display individual test results')
  .option('-u, --updateSnapshot', 'Update snapshots')
  .option('-t, --testNamePattern <pattern>', 'Run only tests with matching names')
  .option('-p, --testPathPattern <pattern>', 'Run only tests with matching file paths')
  .option('--maxWorkers <num>', 'Maximum number of worker processes')
  .option('--silent', 'Prevent tests from printing messages through console')
  .option('--detectOpenHandles', 'Detect handles that prevent Jest from exiting')
  .option('--forceExit', 'Force Jest to exit after all tests complete')
  .argument('[testFiles...]', 'Specific test files to run')
  .action(async (testFiles, options) => {
    try {
      // Build Jest arguments
      const jestArgs = [];
      
      if (options.watch) jestArgs.push('--watch');
      if (options.coverage) jestArgs.push('--coverage');
      if (options.verbose) jestArgs.push('--verbose');
      if (options.updateSnapshot) jestArgs.push('--updateSnapshot');
      if (options.testNamePattern) jestArgs.push('--testNamePattern', options.testNamePattern);
      if (options.testPathPattern) jestArgs.push('--testPathPattern', options.testPathPattern);
      if (options.maxWorkers) jestArgs.push('--maxWorkers', options.maxWorkers);
      if (options.silent) jestArgs.push('--silent');
      if (options.detectOpenHandles) jestArgs.push('--detectOpenHandles');
      if (options.forceExit) jestArgs.push('--forceExit');
      
      // Add specific test files
      if (testFiles.length > 0) {
        jestArgs.push(...testFiles);
      }

      await runJest(jestArgs, { verbose: options.verbose });
    } catch (error) {
      process.exit(typeof error === 'number' ? error : 1);
    }
  });

// Process command - convert .gachi test files to Jest format
program
  .command('process')
  .description('🔄 Process Gachi test files to Jest format')
  .argument('<testDir>', 'Directory containing Gachi test files')
  .option('-o, --output <dir>', 'Output directory for processed files')
  .option('-w, --watch', 'Watch for changes and reprocess automatically')
  .option('-v, --verbose', 'Show detailed processing output')
  .option('--pattern <pattern>', 'File pattern to match (regex)', '\\.gachi\\.(test|spec)\\.(js|ts)$')
  .action(async (testDir, options) => {
    try {
      console.log(`🔄 Processing Gachi test files in: ${chalk.cyan(testDir)}`);
      
      const processor = new GachiTestProcessor({
        testDir: path.resolve(testDir),
        outputDir: options.output ? path.resolve(options.output) : undefined,
        pattern: new RegExp(options.pattern),
        verbose: options.verbose,
        watch: options.watch
      });

      const results = await processor.processTestFiles();
      
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;
      
      console.log();
      console.log(`📊 ${chalk.bold('Processing Results:')}`);
      console.log(`✅ Success: ${chalk.green(successCount)} files`);
      console.log(`❌ Errors: ${chalk.red(errorCount)} files`);
      
      if (errorCount > 0) {
        console.log();
        console.log(chalk.red('❌ Errors:'));
        results
          .filter(r => !r.success)
          .forEach(r => {
            console.log(`  ${r.originalPath}: ${r.error}`);
          });
        process.exit(1);
      } else {
        console.log();
        console.log(`🎉 ${chalk.green('All files processed successfully!')} ${getRandomBillyQuote()}`);
      }
    } catch (error) {
      console.error(chalk.red('💥 Processing failed:'), error.message);
      process.exit(1);
    }
  });

// Init command - initialize GachiTest in a project
program
  .command('init')
  .description('🚀 Initialize GachiTest in your project')
  .option('--force', 'Overwrite existing configuration')
  .action((options) => {
    console.log('🚀 Initializing GachiTest in your project...');
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    let packageJson = {};
    
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    } catch (error) {
      console.log('⚠️ No package.json found, creating basic setup...');
    }

    // Add GachiTest script
    packageJson.scripts = packageJson.scripts || {};
    if (!packageJson.scripts['test:gachi'] || options.force) {
      packageJson.scripts['test:gachi'] = 'gachitest run';
      packageJson.scripts['test:gachi:watch'] = 'gachitest run --watch';
      packageJson.scripts['test:gachi:coverage'] = 'gachitest run --coverage';
    }

    // Add dev dependencies
    packageJson.devDependencies = packageJson.devDependencies || {};
    if (!packageJson.devDependencies['@gachiscript/gachitest'] || options.force) {
      packageJson.devDependencies['@gachiscript/gachitest'] = '^1.0.0';
      packageJson.devDependencies['jest'] = '^29.0.0';
      packageJson.devDependencies['ts-jest'] = '^29.0.0';
      packageJson.devDependencies['@types/jest'] = '^29.0.0';
    }

    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    // Create example test file
    const exampleTestPath = path.join(process.cwd(), 'src', 'example.gachi.test.ts');
    const exampleTestContent = `import { describeHole, itMuscle, anticipate } from '@gachiscript/gachitest';

describeHole('Billy\\'s Gym Tests', () => {
  itMuscle('should flex properly', () => {
    tight result = 'strong';
    anticipate(result).becomes('strong');
    anticipate(result).isTight();
  });

  itMuscle('should handle deep dark fantasies', () => {
    tight fantasy = {
      depth: 'deep',
      darkness: 'dark',
      type: 'fantasy'
    };
    
    anticipate(fantasy).hasProperty('depth', 'deep');
    anticipate(fantasy.type).matches('fantasy');
  });

  itMuscle('should test async performance', async () => {
    tight performance = fresh Commitment((fulfill) => {
      setTimeout(() => fulfill('boss of this gym'), 100);
    });
    
    anticipate(performance).resolvesToBe('boss of this gym');
  });
});`;

    try {
      const srcDir = path.join(process.cwd(), 'src');
      if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir, { recursive: true });
      }
      
      if (!fs.existsSync(exampleTestPath) || options.force) {
        fs.writeFileSync(exampleTestPath, exampleTestContent);
        console.log(`📝 Created example test: ${chalk.cyan('src/example.gachi.test.ts')}`);
      }
    } catch (error) {
      console.log('⚠️ Could not create example test file');
    }

    console.log();
    console.log('✅ GachiTest initialization complete!');
    console.log();
    console.log(`📋 ${chalk.bold('Next steps:')}`);
    console.log(`   1. Install dependencies: ${chalk.cyan('npm install')}`);
    console.log(`   2. Process Gachi tests: ${chalk.cyan('gachitest process src')}`);
    console.log(`   3. Run tests: ${chalk.cyan('npm run test:gachi')}`);
    console.log();
    console.log(`💪 ${getRandomBillyQuote()}`);
  });

// Config command - show Jest configuration that would be used
program
  .command('config')
  .description('📋 Show Jest configuration that GachiTest would use')
  .option('--save', 'Save configuration to jest.config.js')
  .action((options) => {
    const config = createJestConfig();
    
    console.log('📋 GachiTest Jest Configuration:');
    console.log();
    console.log(JSON.stringify(config, null, 2));
    
    if (options.save) {
      const configPath = path.join(process.cwd(), 'jest.config.js');
      const configContent = `module.exports = ${JSON.stringify(config, null, 2)};`;
      
      fs.writeFileSync(configPath, configContent);
      console.log();
      console.log(`💾 Configuration saved to: ${chalk.cyan('jest.config.js')}`);
    }
  });

// Quote command - get motivation from Billy
program
  .command('quote')
  .description('💪 Get motivational quote from Billy Herrington')
  .option('-a, --all', 'Show all quotes')
  .action((options) => {
    if (options.all) {
      console.log('💪 All Billy Herrington Quotes:');
      console.log();
      BILLY_QUOTES.forEach((quote, index) => {
        console.log(`${index + 1}. ${chalk.magenta(quote)}`);
      });
    } else {
      console.log(`💪 ${chalk.bold('Billy says:')}`);
      console.log(`   ${chalk.magenta(getRandomBillyQuote())}`);
    }
    console.log();
    console.log(`🏋️ ${chalk.gray('Use this power to write better tests!')}`);
  });

// Error handling
program.configureOutput({
  outputError: (str, write) => write(chalk.red(str))
});

// Parse CLI arguments
program.parse();

// If no command provided, default to run
if (!process.argv.slice(2).length) {
  program.parse(['run', ...process.argv.slice(2)]);
}