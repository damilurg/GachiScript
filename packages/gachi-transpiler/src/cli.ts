#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import { glob } from 'glob';
import path from 'path';
import chokidar from 'chokidar';
import { gachiTranspiler, GachiTranspiler } from './index.js';

const program = new Command();

// ASCII Art Banner
const banner = `
🔥 ${chalk.red('GACHI')}${chalk.yellow('SCRIPT')} ${chalk.blue('TRANSPILER')} 🔥
${chalk.gray('RIGHT VERSION! DEEP DARK FANTASY ACTIVATED!')}
`;

console.log(banner);

program
  .name('gachi')
  .description('🔥 GachiScript Transpiler - Transform between JS/TS and GachiScript')
  .version('1.0.0');

// Build command
program
  .command('build')
  .description('Transform JavaScript/TypeScript files to GachiScript')
  .argument('<input>', 'Input file or directory')
  .option('-o, --output <dir>', 'Output directory', './dist')
  .option('-f, --framework <framework>', 'Target framework (react, angular, vue)')
  .option('--reverse', 'Transform GachiScript back to JavaScript/TypeScript')
  .option('--quotes', 'Add random Billy quotes to the output')
  .option('--strict', 'Enable strict mode validation')
  .option('--watch', 'Watch for file changes')
  .action(async (input, options) => {
    try {
      if (options.watch) {
        await watchFiles(input, options);
      } else {
        await buildFiles(input, options);
      }
    } catch (error) {
      console.error(chalk.red('💀 Build failed:'), error);
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate')
  .description('Validate GachiScript syntax')
  .argument('<input>', 'Input GachiScript file')
  .action(async (input) => {
    try {
      const content = await fs.readFile(input, 'utf-8');
      const result = gachiTranspiler.validateGachiScript(content);
      
      if (result.valid) {
        console.log(chalk.green('✅ RIGHT VERSION! Your GachiScript is valid!'));
      } else {
        console.log(chalk.red('❌ WRONG VERSION! Validation errors found:'));
        result.errors.forEach(error => {
          console.log(chalk.red(`  • ${error}`));
        });
        
        if (result.suggestions.length > 0) {
          console.log(chalk.yellow('\n💡 Suggestions:'));
          result.suggestions.forEach(suggestion => {
            console.log(chalk.yellow(`  • ${suggestion}`));
          });
        }
      }
    } catch (error) {
      console.error(chalk.red('💀 Validation failed:'), error);
      process.exit(1);
    }
  });

// Info command
program
  .command('info')
  .description('Show GachiScript syntax information')
  .option('-c, --category <category>', 'Show specific category (keywords, operators, types, etc.)')
  .action((options) => {
    showSyntaxInfo(options.category);
  });

// Demo command
program
  .command('demo')
  .description('Show GachiScript transformation demo')
  .action(() => {
    showDemo();
  });

async function buildFiles(input: string, options: any): Promise<void> {
  const stats = await fs.stat(input);
  
  if (stats.isDirectory()) {
    // Process directory
    const pattern = path.join(input, '**/*.{ts,tsx,js,jsx,gachi}');
    const files = await glob(pattern);
    
    console.log(chalk.blue(`📁 Processing ${files.length} files...`));
    
    for (const file of files) {
      await processFile(file, options);
    }
  } else {
    // Process single file
    await processFile(input, options);
  }
  
  console.log(chalk.green('🎉 RIGHT VERSION! Build completed successfully!'));
}

async function processFile(filePath: string, options: any): Promise<void> {
  const content = await fs.readFile(filePath, 'utf-8');
  const ext = path.extname(filePath);
  const isGachiFile = ext === '.gachi';
  
  console.log(chalk.gray(`📄 Processing: ${filePath}`));
  
  // Auto-detect framework if not specified
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
    // Transform GachiScript to JS/TS
    result = gachiTranspiler.gachiToJs(content, transpilerOptions);
    outputExt = ext === '.gachi' ? '.js' : ext;
  } else {
    // Transform JS/TS to GachiScript
    result = gachiTranspiler.jsToGachi(content, transpilerOptions);
    outputExt = '.gachi';
  }
  
  if (result.errors && result.errors.length > 0) {
    console.error(chalk.red(`❌ Errors in ${filePath}:`));
    result.errors.forEach(error => console.error(chalk.red(`  • ${error}`)));
    return;
  }
  
  if (result.warnings && result.warnings.length > 0) {
    console.warn(chalk.yellow(`⚠️ Warnings in ${filePath}:`));
    result.warnings.forEach(warning => console.warn(chalk.yellow(`  • ${warning}`)));
  }
  
  // Determine output path
  const relativePath = path.relative(process.cwd(), filePath);
  const outputPath = path.join(options.output, relativePath.replace(ext, outputExt));
  
  // Ensure output directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // Write transformed content
  await fs.writeFile(outputPath, result.code, 'utf-8');
  
  console.log(chalk.green(`✅ ${filePath} -> ${outputPath}`));
}

async function watchFiles(input: string, options: any): Promise<void> {
  console.log(chalk.blue('👀 WATCHING FOR CHANGES... DADDY IS READY!'));
  
  const pattern = path.isAbsolute(input) ? input : path.resolve(input);
  const watchPattern = path.join(pattern, '**/*.{ts,tsx,js,jsx,gachi}');
  
  chokidar.watch(watchPattern).on('change', async (filePath) => {
    console.log(chalk.yellow(`🔄 File changed: ${filePath}`));
    try {
      await processFile(filePath, options);
      console.log(chalk.green('✅ Rebuild complete!'));
    } catch (error) {
      console.error(chalk.red('💀 Rebuild failed:'), error);
    }
  });
  
  // Keep the process running
  process.on('SIGINT', () => {
    console.log(chalk.red('\n👋 THANK YOU SIR! Stopping watch mode...'));
    process.exit(0);
  });
}

function showSyntaxInfo(category?: string): void {
  console.log(chalk.blue('\n🔥 GACHISCRIPT SYNTAX GUIDE 🔥\n'));
  
  if (!category || category === 'keywords') {
    console.log(chalk.yellow('📝 KEYWORDS:'));
    console.log('  const → tight');
    console.log('  let → flexible');
    console.log('  function → performance');
    console.log('  class → dungeon');
    console.log('  if → whenHard');
    console.log('  return → deliver');
    console.log('  async → delayed');
    console.log('  await → anticipate\n');
  }
  
  if (!category || category === 'operators') {
    console.log(chalk.yellow('🔧 OPERATORS:'));
    console.log('  === → exactlyLike');
    console.log('  !== → totallyNot');
    console.log('  && → and');
    console.log('  || → or');
    console.log('  ++ → pump');
    console.log('  -- → drain\n');
  }
  
  if (!category || category === 'types') {
    console.log(chalk.yellow('🏷️ TYPES:'));
    console.log('  string → verse');
    console.log('  number → count');
    console.log('  boolean → flag');
    console.log('  object → structure');
    console.log('  array → collection\n');
  }
  
  if (!category || category === 'react') {
    console.log(chalk.yellow('⚛️ REACT FRAMEWORK:'));
    console.log('  useState → manageTightness');
    console.log('  useEffect → onDomination');
    console.log('  Component → DungeonMaster');
    console.log('  props → gifts');
    console.log('  state → condition\n');
  }
}

function showDemo(): void {
  console.log(chalk.blue('\n🎬 GACHISCRIPT DEMO 🎬\n'));
  
  const jsCode = `
const name = "Billy";
function greet(user) {
  return "Hello " + user;
}
const result = greet(name);
console.log(result);
`.trim();
  
  console.log(chalk.yellow('📝 Original JavaScript:'));
  console.log(chalk.gray(jsCode));
  
  const gachiResult = gachiTranspiler.jsToGachi(jsCode);
  
  console.log(chalk.yellow('\n🔥 Transformed GachiScript:'));
  console.log(chalk.green(gachiResult.code));
  
  console.log(chalk.yellow('\n🔄 Back to JavaScript:'));
  const jsResult = gachiTranspiler.gachiToJs(gachiResult.code);
  console.log(chalk.gray(jsResult.code));
  
  console.log(chalk.blue('\n✨ RIGHT VERSION! DEEP DARK FANTASY COMPLETED! ✨'));
}

// Add autocomplete for common commands
program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => cmd.name() + ' ' + cmd.usage()
});

program.parse();