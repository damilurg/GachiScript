import * as fs from 'fs';
import * as path from 'path';
import { transpileToJs } from '@gachiscript/transpiler';

export interface TestProcessorOptions {
  testDir: string;
  outputDir?: string;
  pattern?: RegExp;
  watch?: boolean;
  verbose?: boolean;
  preserveOriginal?: boolean;
}

export interface ProcessedTestFile {
  originalPath: string;
  outputPath: string;
  success: boolean;
  error?: string;
  transpileResult?: any;
}

export class GachiTestProcessor {
  private options: TestProcessorOptions;

  constructor(options: TestProcessorOptions) {
    this.options = {
      pattern: /\.gachi\.(test|spec)\.(js|ts)$/,
      outputDir: options.testDir,
      preserveOriginal: true,
      verbose: false,
      ...options
    };
  }

  /**
   * Process all Gachi test files in the specified directory
   */
  async processTestFiles(): Promise<ProcessedTestFile[]> {
    const testFiles = await this.findGachiTestFiles();
    const results: ProcessedTestFile[] = [];

    if (this.options.verbose) {
      console.log(`🏋️ Found ${testFiles.length} Gachi test files to process`);
    }

    for (const filePath of testFiles) {
      try {
        const result = await this.processTestFile(filePath);
        results.push(result);
        
        if (this.options.verbose) {
          console.log(`${result.success ? '✅' : '❌'} ${filePath}`);
        }
      } catch (error) {
        results.push({
          originalPath: filePath,
          outputPath: '',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Process a single Gachi test file
   */
  async processTestFile(filePath: string): Promise<ProcessedTestFile> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const transformedContent = this.transformGachiTestSyntax(content);
    
    // Transpile from GachiScript to JavaScript/TypeScript if needed
    const transpileResult = transpileToJs(transformedContent, filePath);
    
    if (transpileResult.diagnostics.some(d => d.severity === 'error')) {
      return {
        originalPath: filePath,
        outputPath: '',
        success: false,
        error: transpileResult.diagnostics
          .filter(d => d.severity === 'error')
          .map(d => d.message)
          .join('; '),
        transpileResult
      };
    }

    const outputPath = this.getOutputPath(filePath);
    await this.ensureDirectoryExists(path.dirname(outputPath));
    await fs.promises.writeFile(outputPath, transpileResult.code, 'utf-8');

    return {
      originalPath: filePath,
      outputPath,
      success: true,
      transpileResult
    };
  }

  /**
   * Transform Gachi test syntax to Jest-compatible syntax
   */
  private transformGachiTestSyntax(content: string): string {
    let transformed = content;

    // Import transformations
    transformed = transformed.replace(
      /import\s*{([^}]+)}\s*from\s*['"]@gachiscript\/gachitest['"];?/g,
      (match, imports) => {
        // Map Gachi test imports to the actual gachitest functions
        const importMap: Record<string, string> = {
          'describeHole': 'describeHole',
          'itMuscle': 'itMuscle',
          'probe': 'probe',
          'anticipate': 'anticipate',
          'beforeEachRound': 'beforeEachRound',
          'afterEachRound': 'afterEachRound',
          'beforeShow': 'beforeShow',
          'afterShow': 'afterShow',
          'createSpy': 'createSpy',
          'spyOn': 'spyOn',
          'clearAllMocks': 'clearAllMocks',
          'resetAllMocks': 'resetAllMocks',
          'restoreAllMocks': 'restoreAllMocks'
        };

        const transformedImports = imports
          .split(',')
          .map(imp => imp.trim())
          .map(imp => importMap[imp] || imp)
          .join(', ');

        return `import { ${transformedImports} } from '@gachiscript/gachitest';`;
      }
    );

    // Add automatic import if Gachi test functions are used without import
    if (this.usesGachiTestFunctions(content) && !content.includes('@gachiscript/gachitest')) {
      const autoImports = this.detectUsedGachiTestFunctions(content);
      if (autoImports.length > 0) {
        transformed = `import { ${autoImports.join(', ')} } from '@gachiscript/gachitest';\n\n${transformed}`;
      }
    }

    // Transform test structure patterns
    transformed = this.transformTestStructurePatterns(transformed);

    return transformed;
  }

  /**
   * Transform common test structure patterns
   */
  private transformTestStructurePatterns(content: string): string {
    let transformed = content;

    // Transform describe blocks with Gachi naming patterns
    transformed = transformed.replace(
      /describeHole\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\(\)\s*=>\s*{/g,
      "describeHole('$1', () => {"
    );

    // Transform it blocks with Gachi naming patterns
    transformed = transformed.replace(
      /itMuscle\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(async\s*)?\(\)\s*=>\s*{/g,
      "itMuscle('$1', $2() => {"
    );

    // Transform expect to anticipate patterns
    transformed = transformed.replace(/\bexpect\(/g, 'anticipate(');

    // Transform common Jest matchers to Gachi equivalents
    const matcherMap: Record<string, string> = {
      '.toBe(': '.becomes(',
      '.toEqual(': '.matches(',
      '.toStrictEqual(': '.deeplyMatches(',
      '.not.toBe(': '.differs(',
      '.not.toStrictEqual(': '.deeplyDiffers(',
      '.toBeNull()': '.isEmpty()',
      '.toBeUndefined()': '.isMissing()',
      '.toBeDefined()': '.exists()',
      '.not.toBeNull()': '.isPresent()',
      '.toBeTruthy()': '.isTight()',
      '.toBeFalsy()': '.isLoose()',
      '.toContain(': '.holds(',
      '.not.toContain(': '.lacksHold(',
      '.toThrow(': '.explodes(',
      '.not.toThrow()': '.staysCalm()',
      '.toBeGreaterThan(': '.isBigger(',
      '.toBeLessThan(': '.isSmaller(',
      '.toBeGreaterThanOrEqual(': '.isBiggerOrEqual(',
      '.toBeLessThanOrEqual(': '.isSmallerOrEqual(',
      '.toBeCloseTo(': '.isCloseEnough(',
      '.toMatch(': '.matchesPattern(',
      '.not.toMatch(': '.lacksPattern(',
      '.toHaveLength(': '.hasLength(',
      '.toHaveProperty(': '.hasProperty(',
      '.toHaveBeenCalledWith(': '.wasCalledWith(',
      '.toHaveBeenCalledTimes(': '.wasCalledTimes(',
      '.toHaveBeenCalled()': '.wasCalled()',
      '.not.toHaveBeenCalled()': '.wasNeverCalled()',
      '.toHaveBeenLastCalledWith(': '.wasLastCalledWith(',
      '.toHaveReturnedWith(': '.returnedWith(',
      '.toHaveReturnedTimes(': '.returnedTimes(',
      '.resolves.toBe(': '.resolvesToBe(',
      '.rejects.toThrow(': '.rejectsWith('
    };

    for (const [jestMatcher, gachiMatcher] of Object.entries(matcherMap)) {
      const regex = new RegExp(this.escapeRegex(jestMatcher), 'g');
      transformed = transformed.replace(regex, gachiMatcher);
    }

    return transformed;
  }

  /**
   * Check if content uses Gachi test functions
   */
  private usesGachiTestFunctions(content: string): boolean {
    const gachiTestFunctions = [
      'describeHole',
      'itMuscle',
      'probe',
      'anticipate',
      'beforeEachRound',
      'afterEachRound',
      'beforeShow',
      'afterShow'
    ];

    return gachiTestFunctions.some(func => content.includes(func));
  }

  /**
   * Detect which Gachi test functions are used in content
   */
  private detectUsedGachiTestFunctions(content: string): string[] {
    const gachiTestFunctions = [
      'describeHole',
      'itMuscle',
      'probe',
      'anticipate',
      'beforeEachRound',
      'afterEachRound',
      'beforeShow',
      'afterShow',
      'createSpy',
      'spyOn',
      'clearAllMocks',
      'resetAllMocks',
      'restoreAllMocks'
    ];

    return gachiTestFunctions.filter(func => {
      const regex = new RegExp(`\\b${func}\\b`, 'g');
      return regex.test(content);
    });
  }

  /**
   * Find all Gachi test files in the test directory
   */
  private async findGachiTestFiles(): Promise<string[]> {
    const files: string[] = [];
    
    async function walkDir(dir: string) {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await walkDir(fullPath);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    }

    await walkDir(this.options.testDir);
    
    return files.filter(file => this.options.pattern!.test(file));
  }

  /**
   * Get output path for a test file
   */
  private getOutputPath(inputPath: string): string {
    const relativePath = path.relative(this.options.testDir, inputPath);
    const parsed = path.parse(relativePath);
    
    // Convert .gachi.test.ts to .test.ts (remove .gachi part)
    const newName = parsed.name.replace(/\.gachi(\.test|\.spec)$/, '$1');
    const newExt = parsed.ext === '.ts' ? '.ts' : '.js';
    
    return path.join(this.options.outputDir!, parsed.dir, newName + newExt);
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
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}