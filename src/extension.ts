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
import * as vscode from "vscode";


//vscode.something  : this something is a namespace that contains various functionalities provided by the VS Code API

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log(
  //   'Congratulations, your extension "my-first-extension" is now active!',
  // );

  
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // const disposable = vscode.commands.registerCommand(
  //   "my-first-extension.helloWorld",
  //   () => {
  //     // The code you place here will be executed every time your command is executed
  //     // Display a message box to the user
  //     vscode.window.showInformationMessage(
  //       "Hello World from my-first-extension!",
  //     );
  //   },
  // );

  // context.subscriptions.push(disposable);


  //implement the logic for the new command 'my-first-extension.showDate'
  let dateDisposable = vscode.commands.registerCommand('my-first-extension.showDate', () => {

    const currentDate = new Date();
    const formattedDate = currentDate.toDateString();

    const dateString = currentDate.toLocaleString();


    //show popup message with current date and time and formatted date(TOAST notification)
    vscode.window.showInformationMessage(`Current Date and Time: ${dateString} & Formatted Date: ${formattedDate}`);



    const editor = vscode.window.activeTextEditor;//checks if user has a file open in the editor
    if (editor) {//editor contains the file data if its open 
      
      
      //insert at the cursor position or replace the current selection with the dateString
      editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, dateString);
      });
    }
  });

  context.subscriptions.push(dateDisposable);
}

// This method is called when your extension is deactivated(used for cleanup)
export function deactivate() {}
