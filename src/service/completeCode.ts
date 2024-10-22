import * as vscode from 'vscode';
import { callLLM } from '../utils/utils';

export default async function completeCode() {
  const editor = vscode.window.activeTextEditor

  if (editor) {
    const document = editor.document
    const selection = editor.selection

    const position = selection.active

    const endPosition = selection.end

    const prompt = document.getText(selection)

    if (prompt.trim() == '') {
      vscode.window.showInformationMessage(
        "Please select a code snippet to use code completion."
      );
      return;
    }

    // 调用模型
    const res = await callLLM(prompt, false)
    await editor.edit(editBuilder => {
      editBuilder.insert(endPosition, res[0])
    })

  }

}