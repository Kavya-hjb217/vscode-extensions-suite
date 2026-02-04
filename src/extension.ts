//steps to crete a vscode extension
//1. Install Node.js and npm
//2. Install Yeoman and the VS Code Extension Generator
//   npm install -g yo generator-code
//3. Generate a new extension
//   yo code
//4. Choose "New Extension (TypeScript)" and follow the prompts to set up your extension.
//5. Navigate to the generated extension directory and open it in VS Code.
//6.register the new commasnd in package.json so that VS code knows about it
//6. Open the src/extension.ts file to implement your extension's functionality.
//7. Use the command palette (Ctrl+Shift+P) to run "Extension: Run Extension" to test your extension in a new VS Code window.
//8. Once you're satisfied with your extension, you can package it using vsce and publish it to the Visual Studio Code Marketplace.

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

//official API by Microsoft , colleection of functions, classes, and interfaces to interact with VS Code
import { stat } from "fs";
import * as vscode from "vscode";

//vscode.something  : this something is a namespace that contains various functionalities provided by the VS Code API

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let statusBarClock: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {

  vscode.window.showErrorMessage("DEBUG: Extension has started!");
  // 1. Hello World
  let hello = vscode.commands.registerCommand("ext.helloWorld", () => {
    vscode.window.showInformationMessage("Hello from the Extension Suite!");
  });

  // 2. Show Date
  let showDate = vscode.commands.registerCommand("ext.showDate", () => {
    const dateString = new Date().toLocaleString();
    vscode.window.showInformationMessage(`Current Date: ${dateString}`);

    const editor = vscode.window.activeTextEditor;
    if (editor) {
      editor.edit((editBuilder) => {
        editBuilder.replace(editor.selection, dateString);
      });
    }
  });

  // 3. Status Bar Clock Logic

  //alignment: right and priority: 100 (higher priority)
  statusBarClock = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarClock.command = "ext.showDate"; // clicking the clock will trigger showDate command

  const intervalId = setInterval(() => {
    const now = new Date();
    statusBarClock.text = `$(clock) ${now.toLocaleTimeString()}`;
    statusBarClock.show();
  }, 1000);
  context.subscriptions.push(hello, showDate, statusBarClock, {
    dispose: () => clearInterval(intervalId),
  });
}

// This method is called when your extension is deactivated(used for cleanup)
export function deactivate() {}
