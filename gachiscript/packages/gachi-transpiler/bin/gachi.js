#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { GachiFileProcessor } = require('../dist/file-processor');
const { gachiDictionary } = require('@gachiscript/dictionary');

const program = new Command();

// ASCII Art Header
const gachiHeader = `
${chalk.bold.magenta('                                        ')}
${chalk.bold.magenta('  ██████   █████   ██████ ██   ██ ██')}
${chalk.bold.magenta(' ██       ██   ██ ██      ██   ██ ██')}
${chalk.bold.magenta(' ██   ███ ███████ ██      ███████ ██')}
${chalk.bold.magenta(' ██    ██ ██   ██ ██      ██   ██ ██')}
${chalk.bold.magenta('  ██████  ██   ██  ██████ ██   ██ ██')}
${chalk.bold.cyan('            GachiScript Platform')}
${chalk.gray('     Billy Herrington would be proud 💪')}
`;

// Helper functions
function showHeader() {
  console.log(gachiHeader);
}

function showStats(result) {
  console.log();
  console.log(chalk.bold('📊 Processing Results:'));
  console.log(`${chalk.green('✅ Success:')} ${result.successCount}/${result.totalFiles} files`);
  console.log(`${chalk.red('❌ Errors:')} ${result.errorCount} files`);
  console.log(`${chalk.blue('⏱️ Duration:')} ${result.duration}ms`);
  
  if (result.errorCount > 0) {
    console.log();
    console.log(chalk.red('❌ Errors:'));
    result.processedFiles
      .filter(f => !f.success)
      .forEach(f => {
        console.log(`  ${f.input}: ${f.error}`);
      });
  }
}

function getFrameworkFromPackageJson(dir) {
  try {
    const packagePath = path.join(dir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    
    if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
      return 'react';
    }
    if (packageJson.dependencies?.['@angular/core'] || packageJson.devDependencies?.['@angular/core']) {
      return 'angular';
    }
    if (packageJson.dependencies?.vue || packageJson.devDependencies?.vue) {
      return 'vue';
    }
    
    return 'vanilla';
  } catch {
    return 'vanilla';
  }
}

// Main program configuration
program
  .name('gachi')
  .description('🏋️ GachiScript Platform - Transform your code with Billy Herrington\'s power')
  .version('1.0.0')
  .hook('preAction', () => {
    showHeader();
  });

// Build command - convert JS/TS to GachiScript
program
  .command('build')
  .description('💪 Transform JavaScript/TypeScript files to GachiScript')
  .argument('<input>', 'Input file or directory')
  .option('-o, --output <dir>', 'Output directory')
  .option('-f, --framework <framework>', 'Target framework (react|angular|vue|node|vanilla)', 'auto')
  .option('-w, --watch', 'Watch for changes and rebuild automatically')
  .option('-v, --verbose', 'Show detailed output')
  .option('--backup', 'Create backup files before transformation')
  .option('--include <patterns...>', 'File patterns to include (e.g., "*.ts" "*.tsx")')
  .option('--exclude <patterns...>', 'File patterns to exclude (e.g., "node_modules/**")')
  .action(async (input, options) => {
    try {
      const framework = options.framework === 'auto' 
        ? getFrameworkFromPackageJson(path.resolve(input))
        : options.framework;

      console.log(`🎯 ${chalk.bold('Target:')} ${chalk.cyan(input)}`);
      console.log(`🏗️ ${chalk.bold('Framework:')} ${chalk.yellow(framework)}`);
      if (options.output) {
        console.log(`📁 ${chalk.bold('Output:')} ${chalk.cyan(options.output)}`);
      }

      const processor = new GachiFileProcessor({
        framework,
        inputDir: path.resolve(input),
        outputDir: options.output ? path.resolve(options.output) : undefined,
        patterns: options.include,
        exclude: options.exclude,
        createBackup: options.backup,
        verbose: options.verbose
      });

      if (options.watch) {
        console.log(`👀 ${chalk.bold('Watch mode enabled')} - Press Ctrl+C to stop`);
        processor.startWatch(path.resolve(input), 'toGachi');
        
        // Keep the process alive
        process.on('SIGINT', () => {
          console.log('\n⏹️ Stopping watch mode...');
          processor.stopWatch();
          process.exit(0);
        });
      } else {
        const result = await processor.processToGachi(path.resolve(input));
        showStats(result);
        
        if (result.errorCount > 0) {
          process.exit(1);
        }
      }
    } catch (error) {
      console.error(chalk.red('💥 Build failed:'), error.message);
      process.exit(1);
    }
  });

// Reverse command - convert GachiScript to JS/TS
program
  .command('reverse')
  .description('🔄 Transform GachiScript files back to JavaScript/TypeScript')
  .argument('<input>', 'Input file or directory with .gachi files')
  .option('-o, --output <dir>', 'Output directory')
  .option('-f, --framework <framework>', 'Original framework (react|angular|vue|node|vanilla)', 'vanilla')
  .option('-w, --watch', 'Watch for changes and rebuild automatically')
  .option('-v, --verbose', 'Show detailed output')
  .option('--backup', 'Create backup files before transformation')
  .action(async (input, options) => {
    try {
      console.log(`🔄 ${chalk.bold('Reversing:')} ${chalk.cyan(input)}`);
      console.log(`🏗️ ${chalk.bold('Framework:')} ${chalk.yellow(options.framework)}`);
      if (options.output) {
        console.log(`📁 ${chalk.bold('Output:')} ${chalk.cyan(options.output)}`);
      }

      const processor = new GachiFileProcessor({
        framework: options.framework,
        inputDir: path.resolve(input),
        outputDir: options.output ? path.resolve(options.output) : undefined,
        createBackup: options.backup,
        verbose: options.verbose
      });

      if (options.watch) {
        console.log(`👀 ${chalk.bold('Watch mode enabled')} - Press Ctrl+C to stop`);
        processor.startWatch(path.resolve(input), 'toJs');
        
        // Keep the process alive
        process.on('SIGINT', () => {
          console.log('\n⏹️ Stopping watch mode...');
          processor.stopWatch();
          process.exit(0);
        });
      } else {
        const result = await processor.processToJs(path.resolve(input));
        showStats(result);
        
        if (result.errorCount > 0) {
          process.exit(1);
        }
      }
    } catch (error) {
      console.error(chalk.red('💥 Reverse transformation failed:'), error.message);
      process.exit(1);
    }
  });

// Dictionary command - show dictionary information
program
  .command('dict')
  .description('📚 Show GachiScript dictionary information')
  .option('-s, --search <keyword>', 'Search for a specific keyword')
  .option('-r, --random', 'Show a random Gachi phrase')
  .option('--stats', 'Show dictionary statistics')
  .option('--export <file>', 'Export dictionary to JSON file')
  .action((options) => {
    if (options.random) {
      const phrase = gachiDictionary.getRandomGachiPhrase();
      console.log(`🎲 ${chalk.bold('Random Gachi Phrase:')} ${chalk.magenta(phrase)}`);
      return;
    }

    if (options.stats) {
      const stats = gachiDictionary.getStats();
      console.log(`📊 ${chalk.bold('Dictionary Statistics:')}`);
      console.log(`   Total mappings: ${chalk.cyan(stats.totalMappings)}`);
      console.log(`   JS keywords: ${chalk.cyan(stats.jsKeywords)}`);
      console.log(`   Gachi keywords: ${chalk.cyan(stats.gachiKeywords)}`);
      console.log(`   Total phrases: ${chalk.cyan(stats.totalPhrases)}`);
      return;
    }

    if (options.search) {
      const jsResult = gachiDictionary.jsToGachiKeyword(options.search);
      const gachiResult = gachiDictionary.gachiToJsKeyword(options.search);
      
      console.log(`🔍 ${chalk.bold('Search results for:')} ${chalk.yellow(options.search)}`);
      
      if (jsResult !== options.search) {
        console.log(`   JS → Gachi: ${chalk.green(options.search)} → ${chalk.magenta(jsResult)}`);
      }
      
      if (gachiResult !== options.search) {
        console.log(`   Gachi → JS: ${chalk.magenta(options.search)} → ${chalk.green(gachiResult)}`);
      }
      
      if (jsResult === options.search && gachiResult === options.search) {
        console.log(`   ${chalk.gray('No mappings found')}`);
      }
      return;
    }

    if (options.export) {
      const dictionary = gachiDictionary.exportToJson();
      fs.writeFileSync(options.export, JSON.stringify(dictionary, null, 2));
      console.log(`💾 ${chalk.bold('Dictionary exported to:')} ${chalk.cyan(options.export)}`);
      return;
    }

    // Default: show basic dictionary info
    const stats = gachiDictionary.getStats();
    console.log(`📚 ${chalk.bold('GachiScript Dictionary')}`);
    console.log(`   ${chalk.cyan(stats.totalMappings)} keyword mappings available`);
    console.log(`   ${chalk.cyan(stats.totalPhrases)} Gachi phrases in database`);
    console.log();
    console.log(`💡 ${chalk.bold('Examples:')}`);
    console.log(`   const → ${chalk.magenta('tight')}`);
    console.log(`   function → ${chalk.magenta('performance')}`);
    console.log(`   return → ${chalk.magenta('climax')}`);
    console.log(`   if → ${chalk.magenta('whenHard')}`);
    console.log(`   else → ${chalk.magenta('whenSoft')}`);
    console.log();
    console.log(`📖 ${chalk.bold('Use')} ${chalk.cyan('gachi dict --help')} ${chalk.bold('for more options')}`);
  });

// Test command - quick test transformation
program
  .command('test')
  .description('🧪 Test GachiScript transformation on sample code')
  .option('-c, --code <code>', 'Code to transform')
  .option('-f, --file <file>', 'File to transform')
  .option('-r, --reverse', 'Test reverse transformation (GachiScript → JS/TS)')
  .action((options) => {
    if (!options.code && !options.file) {
      // Use default test code
      options.code = `
function greetUser(name: string): string {
  if (name) {
    return \`Hello, \${name}!\`;
  } else {
    return "Hello, stranger!";
  }
}

const user = "Billy";
console.log(greetUser(user));
`;
    }

    let code = options.code;
    if (options.file) {
      code = fs.readFileSync(options.file, 'utf-8');
    }

    console.log(`🧪 ${chalk.bold('Testing transformation:')}`);
    console.log();
    
    const { GachiTranspiler } = require('../dist/transpiler');
    const transpiler = new GachiTranspiler();

    if (options.reverse) {
      console.log(`${chalk.bold('Input (GachiScript):')}`);
      console.log(chalk.gray(code));
      console.log();
      
      const result = transpiler.gachiToJs(code);
      console.log(`${chalk.bold('Output (JavaScript/TypeScript):')}`);
      console.log(chalk.green(result.code));
    } else {
      console.log(`${chalk.bold('Input (JavaScript/TypeScript):')}`);
      console.log(chalk.gray(code));
      console.log();
      
      const result = transpiler.jsToGachi(code);
      console.log(`${chalk.bold('Output (GachiScript):')}`);
      console.log(chalk.magenta(result.code));
    }
  });

// Version command
program
  .command('version')
  .description('📋 Show version information')
  .action(() => {
    const packageJson = require('../package.json');
    console.log(`${chalk.bold('GachiScript Platform')} ${chalk.cyan('v' + packageJson.version)}`);
    console.log(`${chalk.gray('Billy Herrington Memorial Edition')}`);
    console.log();
    console.log(`${chalk.bold('Components:')}`);
    console.log(`  Transpiler: ${chalk.cyan('v' + packageJson.version)}`);
    console.log(`  Dictionary: ${chalk.cyan('v1.0.0')}`);
    console.log();
    console.log(`${chalk.bold('Repository:')} ${chalk.blue('https://github.com/damilurg/GachiScript')}`);
  });

// Error handling
program.configureOutput({
  outputError: (str, write) => write(chalk.red(str))
});

// Parse CLI arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}