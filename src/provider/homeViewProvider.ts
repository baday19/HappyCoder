import * as vscode from "vscode";
import * as fs from 'fs'
import * as path from 'path'

class HomeViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) { }

  public static readonly viewType = "homeView";

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true
    }

    const extensionPath = this._extensionUri
    const indexPath = vscode.Uri.joinPath(extensionPath, 'webview', 'index.html')
    const html = fs.readFileSync(indexPath.path, 'utf-8')
    const newHtml = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, p1, p2)=>{
      const newUri = webviewView.webview.asWebviewUri(
        vscode.Uri.joinPath(this._extensionUri, 'webview', p2)
      )
      const replaceHref = p1 + newUri?.toString() + '"'
      return replaceHref
    })    

    webviewView.webview.html = newHtml
  }
}

export default HomeViewProvider;