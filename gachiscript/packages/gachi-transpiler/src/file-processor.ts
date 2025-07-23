import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import * as chokidar from 'chokidar';
import { GachiTranspiler, TranspilerOptions, TranspileResult } from './transpiler';

export interface ProcessingOptions extends TranspilerOptions {
  inputDir?: string;
  outputDir?: string;
  patterns?: string[];
  exclude?: string[];
  watch?: boolean;
  recursive?: boolean;
  createBackup?: boolean;
  verbose?: boolean;
}

export interface ProcessingResult {
  processedFiles: Array<{
    input: string;
    output: string;
    success: boolean;
    result?: TranspileResult;
    error?: string;
  }>;
  totalFiles: number;
  successCount: number;
  errorCount: number;
  duration: number;
}

export class GachiFileProcessor {
  private transpiler: GachiTranspiler;
  private options: ProcessingOptions;
  private watcher?: chokidar.FSWatcher;

  constructor(options: ProcessingOptions = {}) {
    this.options = {
      patterns: ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
      exclude: ['node_modules/**', 'dist/**', 'build/**', '**/*.d.ts'],
      recursive: true,
      createBackup: false,
      verbose: false,
      ...options
    };

    this.transpiler = new GachiTranspiler(options);
  }

  /**
   * Process files from JS/TS to GachiScript
   */
  async processToGachi(input: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    if (this.options.verbose) {
      console.log(`🏋️ Starting GachiScript conversion for: ${input}`);
    }

    const files = await this.findFiles(input);
    const results: ProcessingResult['processedFiles'] = [];

    for (const file of files) {
      try {
        const result = await this.processFileToGachi(file);
        results.push(result);
        
        if (this.options.verbose) {
          console.log(`${result.success ? '✅' : '❌'} ${file} -> ${result.output}`);
        }
      } catch (error) {
        results.push({
          input: file,
          output: '',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const duration = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.length - successCount;

    if (this.options.verbose) {
      console.log(`🎯 Completed in ${duration}ms: ${successCount} success, ${errorCount} errors`);
    }

    return {
      processedFiles: results,
      totalFiles: files.length,
      successCount,
      errorCount,
      duration
    };
  }

  /**
   * Process files from GachiScript to JS/TS
   */
  async processToJs(input: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    if (this.options.verbose) {
      console.log(`🔄 Starting reverse conversion for: ${input}`);
    }

    const files = await this.findFiles(input, ['**/*.gachi']);
    const results: ProcessingResult['processedFiles'] = [];

    for (const file of files) {
      try {
        const result = await this.processFileToJs(file);
        results.push(result);
        
        if (this.options.verbose) {
          console.log(`${result.success ? '✅' : '❌'} ${file} -> ${result.output}`);
        }
      } catch (error) {
        results.push({
          input: file,
          output: '',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const duration = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.length - successCount;

    if (this.options.verbose) {
      console.log(`🎯 Completed in ${duration}ms: ${successCount} success, ${errorCount} errors`);
    }

    return {
      processedFiles: results,
      totalFiles: files.length,
      successCount,
      errorCount,
      duration
    };
  }

  /**
   * Start watch mode
   */
  startWatch(input: string, direction: 'toGachi' | 'toJs' = 'toGachi'): void {
    if (this.watcher) {
      this.stopWatch();
    }

    const patterns = direction === 'toGachi' 
      ? this.options.patterns || ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx']
      : ['**/*.gachi'];

    this.watcher = chokidar.watch(patterns, {
      cwd: input,
      ignored: this.options.exclude,
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('add', (filePath) => this.onFileChange(path.join(input, filePath), direction))
      .on('change', (filePath) => this.onFileChange(path.join(input, filePath), direction))
      .on('unlink', (filePath) => this.onFileDelete(path.join(input, filePath), direction));

    if (this.options.verbose) {
      console.log(`👀 Watching ${input} for changes (${direction})...`);
    }
  }

  /**
   * Stop watch mode
   */
  stopWatch(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = undefined;
      
      if (this.options.verbose) {
        console.log('⏹️ Stopped watching for changes');
      }
    }
  }

  /**
   * Find files to process
   */
  private async findFiles(input: string, customPatterns?: string[]): Promise<string[]> {
    const stats = await fs.promises.stat(input);
    
    if (stats.isFile()) {
      return [input];
    }

    if (stats.isDirectory()) {
      const patterns = customPatterns || this.options.patterns || [];
      const globPatterns = patterns.map(pattern => path.join(input, pattern));
      
      const files: string[] = [];
      for (const pattern of globPatterns) {
        const matches = await glob(pattern, {
          ignore: this.options.exclude
        });
        files.push(...matches);
      }
      
      return [...new Set(files)]; // Remove duplicates
    }

    throw new Error(`Input path is neither file nor directory: ${input}`);
  }

  /**
   * Process a single file to GachiScript
   */
  private async processFileToGachi(filePath: string): Promise<ProcessingResult['processedFiles'][0]> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const outputPath = this.getOutputPath(filePath, '.gachi');

    if (this.options.createBackup) {
      await this.createBackup(filePath);
    }

    const result = this.transpiler.jsToGachi(content, filePath);
    
    if (result.diagnostics.some(d => d.severity === 'error')) {
      return {
        input: filePath,
        output: outputPath,
        success: false,
        result,
        error: result.diagnostics.filter(d => d.severity === 'error').map(d => d.message).join('; ')
      };
    }

    await this.ensureDirectoryExists(path.dirname(outputPath));
    await fs.promises.writeFile(outputPath, result.code, 'utf-8');

    return {
      input: filePath,
      output: outputPath,
      success: true,
      result
    };
  }

  /**
   * Process a single file from GachiScript to JS/TS
   */
  private async processFileToJs(filePath: string): Promise<ProcessingResult['processedFiles'][0]> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const originalExt = this.guessOriginalExtension(filePath);
    const outputPath = this.getOutputPath(filePath, originalExt);

    if (this.options.createBackup) {
      await this.createBackup(filePath);
    }

    const result = this.transpiler.gachiToJs(content, filePath);
    
    if (result.diagnostics.some(d => d.severity === 'error')) {
      return {
        input: filePath,
        output: outputPath,
        success: false,
        result,
        error: result.diagnostics.filter(d => d.severity === 'error').map(d => d.message).join('; ')
      };
    }

    await this.ensureDirectoryExists(path.dirname(outputPath));
    await fs.promises.writeFile(outputPath, result.code, 'utf-8');

    return {
      input: filePath,
      output: outputPath,
      success: true,
      result
    };
  }

  /**
   * Get output path for a file
   */
  private getOutputPath(inputPath: string, newExtension: string): string {
    if (this.options.outputDir) {
      const relativePath = path.relative(this.options.inputDir || process.cwd(), inputPath);
      const parsedPath = path.parse(relativePath);
      return path.join(this.options.outputDir, parsedPath.dir, parsedPath.name + newExtension);
    }

    const parsedPath = path.parse(inputPath);
    return path.join(parsedPath.dir, parsedPath.name + newExtension);
  }

  /**
   * Guess original extension for .gachi files
   */
  private guessOriginalExtension(gachiFilePath: string): string {
    // Look for hints in the file content or use sensible defaults
    const content = fs.readFileSync(gachiFilePath, 'utf-8');
    
    if (content.includes('JSX') || content.includes('jsx') || content.includes('<')) {
      return this.options.framework === 'react' ? '.tsx' : '.jsx';
    }
    
    if (content.includes('interface') || content.includes('type') || content.includes(':')) {
      return '.ts';
    }
    
    return '.js';
  }

  /**
   * Create backup of a file
   */
  private async createBackup(filePath: string): Promise<void> {
    const backupPath = filePath + '.backup';
    await fs.promises.copyFile(filePath, backupPath);
  }

  /**
   * Ensure directory exists
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.promises.access(dirPath);
    } catch {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Handle file change in watch mode
   */
  private async onFileChange(filePath: string, direction: 'toGachi' | 'toJs'): Promise<void> {
    try {
      if (direction === 'toGachi') {
        await this.processFileToGachi(filePath);
      } else {
        await this.processFileToJs(filePath);
      }
      
      if (this.options.verbose) {
        console.log(`🔄 Updated: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
    }
  }

  /**
   * Handle file deletion in watch mode
   */
  private async onFileDelete(filePath: string, direction: 'toGachi' | 'toJs'): Promise<void> {
    try {
      const outputExt = direction === 'toGachi' ? '.gachi' : this.guessOriginalExtension(filePath);
      const outputPath = this.getOutputPath(filePath, outputExt);
      
      await fs.promises.unlink(outputPath);
      
      if (this.options.verbose) {
        console.log(`🗑️ Deleted: ${outputPath}`);
      }
    } catch (error) {
      // File might not exist, which is fine
      if (this.options.verbose) {
        console.log(`ℹ️ Could not delete output file for: ${filePath}`);
      }
    }
  }

  /**
   * Update processing options
   */
  setOptions(options: Partial<ProcessingOptions>): void {
    this.options = { ...this.options, ...options };
    this.transpiler.setOptions(options);
  }

  /**
   * Get current processing options
   */
  getOptions(): ProcessingOptions {
    return { ...this.options };
  }
}