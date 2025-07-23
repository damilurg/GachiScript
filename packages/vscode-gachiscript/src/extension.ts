import * as vscode from 'vscode';
import { gachiTranspiler } from '@gachiscript/transpiler';
import { gachiTransformer } from '@gachiscript/dictionary';

export function activate(context: vscode.ExtensionContext) {
    console.log('🔥 GachiScript extension is now active! RIGHT VERSION!');

    // Register commands
    registerCommands(context);
    
    // Register language features
    registerLanguageFeatures(context);
    
    // Show welcome message
    vscode.window.showInformationMessage('🔥 DEEP DARK FANTASY ACTIVATED! GachiScript is ready!');
}

function registerCommands(context: vscode.ExtensionContext) {
    // Transform to JavaScript command
    const transpileToJs = vscode.commands.registerCommand('gachiscript.transpileToJs', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const document = editor.document;
        if (!document.fileName.endsWith('.gachi')) {
            vscode.window.showWarningMessage('This command works only with .gachi files!');
            return;
        }

        const code = document.getText();
        const result = gachiTranspiler.gachiToJs(code);

        if (result.errors && result.errors.length > 0) {
            vscode.window.showErrorMessage(`Transpilation failed: ${result.errors.join(', ')}`);
            return;
        }

        // Create new document with the result
        const newDoc = await vscode.workspace.openTextDocument({
            content: result.code,
            language: 'typescript'
        });

        await vscode.window.showTextDocument(newDoc, vscode.ViewColumn.Beside);
        vscode.window.showInformationMessage('🎉 RIGHT VERSION! Transformed to JavaScript!');
    });

    // Transform to GachiScript command
    const transpileToGachi = vscode.commands.registerCommand('gachiscript.transpileToGachi', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const document = editor.document;
        const code = document.getText();
        
        // Auto-detect framework
        const framework = gachiTranspiler.detectFramework(code);
        const config = vscode.workspace.getConfiguration('gachiscript');
        
        const options = {
            framework: config.get('framework') === 'auto' ? framework : config.get('framework'),
            addRandomQuotes: config.get('enableRandomQuotes'),
            strictMode: config.get('strictMode')
        };

        const result = gachiTranspiler.jsToGachi(code, options);

        if (result.errors && result.errors.length > 0) {
            vscode.window.showErrorMessage(`Transpilation failed: ${result.errors.join(', ')}`);
            return;
        }

        // Create new document with the result
        const newDoc = await vscode.workspace.openTextDocument({
            content: result.code,
            language: 'gachiscript'
        });

        await vscode.window.showTextDocument(newDoc, vscode.ViewColumn.Beside);
        vscode.window.showInformationMessage('🔥 DEEP DARK FANTASY! Transformed to GachiScript!');
    });

    // Validate syntax command
    const validateSyntax = vscode.commands.registerCommand('gachiscript.validateSyntax', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const code = editor.document.getText();
        const result = gachiTranspiler.validateGachiScript(code);

        if (result.valid) {
            vscode.window.showInformationMessage('✅ RIGHT VERSION! Your GachiScript is valid!');
        } else {
            const errorMessage = `❌ WRONG VERSION! Errors found:\n${result.errors.join('\n')}`;
            vscode.window.showErrorMessage(errorMessage);
            
            if (result.suggestions.length > 0) {
                const suggestions = result.suggestions.join('\n');
                vscode.window.showInformationMessage(`💡 Suggestions:\n${suggestions}`);
            }
        }
    });

    // Show random quote command
    const showRandomQuote = vscode.commands.registerCommand('gachiscript.showRandomQuote', () => {
        const quote = gachiTransformer.getRandomBillyQuote();
        vscode.window.showInformationMessage(`🔥 Billy says: "${quote}"`);
    });

    context.subscriptions.push(transpileToJs, transpileToGachi, validateSyntax, showRandomQuote);
}

function registerLanguageFeatures(context: vscode.ExtensionContext) {
    // Register completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'gachiscript',
        new GachiCompletionProvider(),
        '.',
        ' '
    );

    // Register hover provider
    const hoverProvider = vscode.languages.registerHoverProvider(
        'gachiscript',
        new GachiHoverProvider()
    );

    // Register diagnostic provider
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('gachiscript');
    const diagnosticProvider = new GachiDiagnosticProvider(diagnosticCollection);
    
    // Update diagnostics on document changes
    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'gachiscript') {
            diagnosticProvider.updateDiagnostics(event.document);
        }
    });

    vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'gachiscript') {
            diagnosticProvider.updateDiagnostics(document);
        }
    });

    context.subscriptions.push(completionProvider, hoverProvider, diagnosticCollection);
}

class GachiCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const config = vscode.workspace.getConfiguration('gachiscript');
        if (!config.get('enableAutoCompletion')) {
            return [];
        }

        const completions: vscode.CompletionItem[] = [];

        // Add keyword completions
        const keywords = gachiTransformer.getKeywordsByCategory('keywords') as Record<string, string>;
        Object.entries(keywords).forEach(([js, gachi]) => {
            const item = new vscode.CompletionItem(gachi, vscode.CompletionItemKind.Keyword);
            item.detail = `GachiScript keyword for "${js}"`;
            item.documentation = new vscode.MarkdownString(`**${gachi}** → \`${js}\``);
            item.insertText = gachi;
            completions.push(item);
        });

        // Add operator completions
        const operators = gachiTransformer.getKeywordsByCategory('operators') as Record<string, string>;
        Object.entries(operators).forEach(([js, gachi]) => {
            const item = new vscode.CompletionItem(gachi, vscode.CompletionItemKind.Operator);
            item.detail = `GachiScript operator for "${js}"`;
            item.documentation = new vscode.MarkdownString(`**${gachi}** → \`${js}\``);
            item.insertText = gachi;
            completions.push(item);
        });

        // Add type completions
        const types = gachiTransformer.getKeywordsByCategory('types') as Record<string, string>;
        Object.entries(types).forEach(([js, gachi]) => {
            const item = new vscode.CompletionItem(gachi, vscode.CompletionItemKind.TypeParameter);
            item.detail = `GachiScript type for "${js}"`;
            item.documentation = new vscode.MarkdownString(`**${gachi}** → \`${js}\``);
            item.insertText = gachi;
            completions.push(item);
        });

        // Add method completions
        const methods = gachiTransformer.getKeywordsByCategory('methods') as Record<string, string>;
        Object.entries(methods).forEach(([js, gachi]) => {
            const item = new vscode.CompletionItem(gachi, vscode.CompletionItemKind.Method);
            item.detail = `GachiScript method for "${js}"`;
            item.documentation = new vscode.MarkdownString(`**${gachi}** → \`${js}\``);
            item.insertText = gachi;
            completions.push(item);
        });

        // Add Billy quotes as snippets
        const config2 = vscode.workspace.getConfiguration('gachiscript');
        if (config2.get('enableRandomQuotes')) {
            const phrases = gachiTransformer.getKeywordsByCategory('phrases') as any;
            phrases.billy_quotes.forEach((quote: string, index: number) => {
                const item = new vscode.CompletionItem(`Billy Quote ${index + 1}`, vscode.CompletionItemKind.Snippet);
                item.detail = 'Billy Herrington Quote';
                item.documentation = new vscode.MarkdownString(`> *"${quote}"*\n\n— Billy Herrington`);
                item.insertText = `// ${quote}`;
                completions.push(item);
            });
        }

        return completions;
    }
}

class GachiHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return;
        }

        const word = document.getText(range);
        const jsEquivalent = gachiTransformer.gachiToJs(word);

        if (jsEquivalent !== word) {
            const config = vscode.workspace.getConfiguration('gachiscript');
            let hoverContent = new vscode.MarkdownString();
            
            hoverContent.appendMarkdown(`**GachiScript Keyword**\n\n`);
            hoverContent.appendCodeblock(`${word} → ${jsEquivalent}`, 'typescript');
            
            if (config.get('enableRandomQuotes')) {
                const quote = gachiTransformer.getRandomBillyQuote();
                hoverContent.appendMarkdown(`\n---\n> *"${quote}"*\n\n— Billy Herrington 🔥`);
            }

            return new vscode.Hover(hoverContent, range);
        }

        return;
    }
}

class GachiDiagnosticProvider {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor(diagnosticCollection: vscode.DiagnosticCollection) {
        this.diagnosticCollection = diagnosticCollection;
    }

    updateDiagnostics(document: vscode.TextDocument): void {
        if (document.languageId !== 'gachiscript') {
            return;
        }

        const text = document.getText();
        const diagnostics: vscode.Diagnostic[] = [];

        const validation = gachiTranspiler.validateGachiScript(text);
        
        if (!validation.valid) {
            // For now, we'll create a single diagnostic for the whole document
            // In a real implementation, we'd parse the errors to get specific positions
            const range = new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(document.lineCount - 1, 0)
            );

            validation.errors.forEach(error => {
                const diagnostic = new vscode.Diagnostic(
                    range,
                    error,
                    vscode.DiagnosticSeverity.Error
                );
                diagnostic.source = 'GachiScript';
                diagnostics.push(diagnostic);
            });
        }

        this.diagnosticCollection.set(document.uri, diagnostics);
    }
}

export function deactivate() {
    console.log('👋 GachiScript extension deactivated. THANK YOU SIR!');
}