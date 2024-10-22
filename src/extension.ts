import * as vscode from 'vscode';
import completeCode from './service/completeCode';
import inlineCompletionProvider from './provider/inlineCompletionProvider';
import promptLLM from './service/promptMode';
import HomeViewProvider from './provider/homeViewProvider';


export function activate(context: vscode.ExtensionContext) {

	// 主动选中补全
	context.subscriptions.push(vscode.commands.registerCommand('extension.completeCode', completeCode));

	// 提示模式
	context.subscriptions.push(vscode.commands.registerCommand('extension.promptMode', promptLLM));

	// 代码自动补全功能
	const inlineProvider = inlineCompletionProvider();
	context.subscriptions.push(
		vscode.languages.registerInlineCompletionItemProvider(
			// { pattern: "**/*.{py,java}" },
			{ pattern: "**/*.{py}" },
			inlineProvider
		)
	);

	// 视图注册
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(HomeViewProvider.viewType, new HomeViewProvider(context.extensionUri)))

}


export function deactivate() { }
