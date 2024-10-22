import * as vscode from 'vscode';
import { callInstructLLM, callLLM } from '../utils/utils';

export default async function promptLLM() {
  const editor = vscode.window.activeTextEditor

  if (editor) {
    const document = editor.document
    const selection = editor.selection

    const position = selection.active

    const endPosition = selection.end

    const selectedText = document.getText(selection)

    vscode.window.showInputBox({
      placeHolder: 'ask something...',
      prompt: 'please input your prompt',
      validateInput: (value: string) => {
        if (!value) {
          return 'Input cannot be empty.'
        }
        return null
      }
    }).then(async (value) => {
      if (value) {
        // 调用模型
        const prompt = value + '\n' + selectedText
        const res = await callInstructLLM(prompt)
        console.log(endPosition)
        console.log(res[0])
        await editor.edit(editBuilder => {
          editBuilder.insert(endPosition, res[0])
        })
      }
    })
  }
}