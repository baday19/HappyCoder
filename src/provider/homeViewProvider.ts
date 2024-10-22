import * as vscode from "vscode";

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

    const scriptUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'index.js')
    )

    const vueUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'vue.min.js')
    )

    const mdUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'markdown-it.min.js')
    )

    const styleUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'index.css')
    )

    const userAvatarUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'resources', 'user.png')
    )

    const modelAvatarUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'resources', 'model.png')
    )
    

    webviewView.webview.html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HappyCoder</title>
    <link rel="stylesheet" href="${styleUri}">
  </head>
  <body>
    <div id="app">
      <div class="wrap">
        <div class="nav-box">
          <div class="nav-item" :style="{color: activeNav==0?'white':''}" @click="()=>{switchNav(0)}">Chat</div>
          <div class="nav-item" :style="{color: activeNav==1?'white':''}" @click="()=>{switchNav(1)}">More</div>
        </div>
        <div class="main">
          <div class="chat-container" v-show="activeNav==0">
            <div class="chat-content" id="chat-scroll">
              <div class="empty-details" v-if="chatHistories.length==0">
                <div class="empty-title">Hi~ 我是HappyCoder😊</div>
                <div class="empty-content">我支持解释代码、生成注释等功能，你可以从 <a>功能向导</a> 了解我，或是 <a>提交反馈</a> 让我变得更好。</div>
              </div>
              <div class="chat-details" v-else>
                <div class="chat-item" v-for="item in chatHistories">
                  <div class="chat-user">
                    <div class="user-avatar">
                      <img src="${userAvatarUri}" v-if="item.role=='user'" />
                      <img style="padding: 2px;" src="${modelAvatarUri}" v-else />
                    </div>
                    <div class="user-name">{{item.role=='user'?'你':'HappyCoder'}}</div>
                  </div>
                  <div class="chat-message" v-html="item.content"></div>
                </div>
                <div class="chat-item" v-show="thinking">
                  <div class="chat-user">
                    <div class="user-avatar">
                      <img style="padding: 2px;" src="${modelAvatarUri}" />
                    </div>
                    <div class="user-name">HappyCoder</div>
                  </div>
                  <div class="chat-message">thinking...</div>
                </div>
              </div>
            </div>
            <div class="chat-input-box">
              <textarea type="text" class="chat-input" placeholder="输入聊天内容" v-model="chatMsg" @keyup.enter="handleSend"></textarea>
            </div>
          </div>
          <div class="chat-container" v-show="activeNav==1">
            more...
          </div>
        </div>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js"></script>
    <script src="${vueUri}"></script>
    <script src="${mdUri}"></script>
    <script src="${scriptUri}"></script>
  </body>
</html>
    `;
  }
}

export default HomeViewProvider;