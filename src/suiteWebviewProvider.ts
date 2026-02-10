import * as vscode from 'vscode';

export class SuiteWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'suite-webview-view';
    private _view?: vscode.WebviewView;//create a reference to the webview once its created 

    constructor(private readonly _extensionUri: vscode.Uri) { }// called inside activate function

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Listen for messages from the Webview 
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'runCommand':
                    vscode.commands.executeCommand(data.value);
                    break;
                case 'info':
                    vscode.window.showInformationMessage(data.value);
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { 
                        padding: 15px; 
                        color: var(--vscode-foreground); 
                        font-family: var(--vscode-font-family);
                    }
                    .header { font-size: 1.2em; margin-bottom: 20px; color: var(--vscode-textLink-foreground); }
                    .card {
                        background: var(--vscode-welcomePage-tileBackground);
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 15px;
                        border: 1px solid var(--vscode-widget-border);
                    }
                    button {
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 8px 12px;
                        width: 100%;
                        cursor: pointer;
                        margin-top: 10px;
                        border-radius: 2px;
                    }
                    button:hover { background: var(--vscode-button-hoverBackground); }
                    .stat { font-size: 0.8em; opacity: 0.7; margin-top: 5px; }
                </style>
            </head>
            <body>
                <div class="header">Suite Dashboard</div>
                
                <div class="card">
                    <strong>Cleaning Tools</strong>
                    <button onclick="execute('ext.cleanConsoleLogs')">Clean Console Logs</button>
                    <div class="stat">Removes multi-line logs automatically</div>
                </div>

                <div class="card">
                    <strong>Utilities</strong>
                    <button onclick="execute('ext.showDate')">Insert Date Comment</button>
                </div>

                <div class="card">
                    <strong>Extension Status</strong>
                    <button onclick="msg('All systems are operational! 🚀')">Check Health</button>
                </div>

                <script>
                    const vscode = acquireVsCodeApi();
                    function execute(cmd) {
                        vscode.postMessage({ type: 'runCommand', value: cmd });
                    }
                    function msg(text) {
                        vscode.postMessage({ type: 'info', value: text });
                    }
                </script>
            </body>
            </html>`;
    }
}