import * as vscode from 'vscode'
import { callLLM } from '../utils/utils';

let lastRequest = null;
let items: vscode.InlineCompletionItem[] = [];

function middleOfLineWontComplete(editor: any, document: any) {
  const cursorPosition = editor.selection.active;
  let currentLine = document?.lineAt(cursorPosition.line);
  let lineEndPosition = currentLine?.range.end;
  let selectionTrailingString: vscode.Selection;

  selectionTrailingString = new vscode.Selection(
    cursorPosition.line,
    cursorPosition.character,
    cursorPosition.line,
    lineEndPosition.character + 1
  );
  let trailingString = document.getText(selectionTrailingString);
  var re = /^[\]\{\}\); \n\r\t\'\"]*$/;
  if (re.test(trailingString)) {
    return false;
  } else {
    return true;
  }
}


export default function inlineCompletionProvider() {
  const provider: vscode.InlineCompletionItemProvider = {
    provideInlineCompletionItems: async (document, position, context, token) => {
      if (context.triggerKind === vscode.InlineCompletionTriggerKind.Invoke) {
        return items
      } else if (context.triggerKind === vscode.InlineCompletionTriggerKind.Automatic) {
        // 判断功能是否开启
        const config = vscode.workspace.getConfiguration('happycoder');
        const enableCompletion = config.get('autoCompletion');
        const delayConfig: number = config.get('completionDelay') || 0.5;
        const delay = delayConfig * 1000;
        if (!enableCompletion) {
          return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showInformationMessage(
            "Please open a file first to use HappyCoder."
          );
          return;
        }

        // if (context.triggerKind === vscode.InlineCompletionTriggerKind.Invoke) {
        //   return items
        // } else if (context.triggerKind === vscode.InlineCompletionTriggerKind.Automatic) {
        if (middleOfLineWontComplete(editor, document)) {
          return;
        }

        const cursorPosition = editor.selection.active;
        const beforeSelection = new vscode.Selection(0, 0, cursorPosition.line, cursorPosition.character);
        let textBeforeCursor = document.getText(beforeSelection);

        if (
          cursorPosition.character === 0 &&
          textBeforeCursor[textBeforeCursor.length - 1] !== "\n"
        ) {
          textBeforeCursor += "\n";
        }

        if (textBeforeCursor.trim() === "") {
          return [];
        }

        const requestId = new Date().getTime();
        lastRequest = requestId;
        await new Promise(resolve => setTimeout(resolve, delay));

        if (lastRequest !== requestId) {
          return { items: [] };
        }
        // 发送请求 获取补全结果
        const result = await callLLM(textBeforeCursor);
        items = result.map((item: string) => {
          return new vscode.InlineCompletionItem(item, new vscode.Range(cursorPosition.translate(0, item.length), cursorPosition));
        })
        console.log(items)
        return { items };
      }
    }
  }
  // }
  return provider
}

// globalState notebook