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
import { SuiteExplorerProvider } from "./suiteExplorer";
import { SuiteWebviewProvider } from "./suiteWebviewProvider";

//vscode.something  : this something is a namespace that contains various functionalities provided by the VS Code API

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let clockInterval: NodeJS.Timeout | undefined;
let statusBarClock: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  // vscode.window.showErrorMessage("DEBUG: Extension has started!");
  // 1. Hello World
  let hello = vscode.commands.registerCommand("ext.helloWorld", () => {
    vscode.window.showInformationMessage("Hello from the Extension Suite!");
  });

  // 2. Show Date
  let showDate = vscode.commands.registerCommand("ext.showDate", async() => {
    const dateString = new Date().toLocaleString();
    

    const editor = vscode.window.activeTextEditor;
    if (editor) {


     const success = await editor.edit((editBuilder) => {

        const commentDate = `// Current Date: ${dateString}`;
        editBuilder.replace(editor.selection, commentDate);
      });
      if (success) {
        vscode.window.showInformationMessage("Date inserted successfully!");
      } else {
        vscode.window.showErrorMessage("Failed to insert date.");
      }
    }
  });

  // 3. Status Bar Clock Logic

  //alignment: right and priority: 100 (higher priority)
  statusBarClock = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000,
  );
  statusBarClock.command = "ext.showDate";
  statusBarClock.text = `$(watch) Loading...`; // Give it initial text
  statusBarClock.show(); // Show it immediately

  // clicking the clock will trigger showDate command

  clockInterval = setInterval(() => {
    const now = new Date();
    statusBarClock.text = `$(clock) ${now.toLocaleTimeString()}`;
    statusBarClock.show();
  }, 1000);

  context.subscriptions.push(hello, showDate, statusBarClock, {
    dispose: () => { if (clockInterval){ clearInterval(clockInterval);} },
  });


  //clean console logs command implementation
 let cleanLogs = vscode.commands.registerCommand('ext.cleanConsoleLogs',async () => {//register a new command with the identifier 'ext.cleanConsoleLogs' and a callback function that will be executed when the command is invoked.
    const editor = vscode.window.activeTextEditor;// .activeTexteditor looks for the file we are currently and is undefined if we are not editing any file or if the file is not a text document.
    //  It returns the active text editor instance, which provides access to the currently open file and its contents.

    if (!editor) {//if no file is open display a message and return
        vscode.window.showInformationMessage('No active editor found!');
        return;
    }

    const document = editor.document; // edito.document is the current file open in the editor
    // This Regex finds console.log, console.warn, and console.error 
    // including the semicolon at the end.
    // const regex = /console\.(log|debug|info|warn|error)\(.*\);?/g;//g means globalmeaning find every match and not just the first one 
    

    //updated regex to handle multiline console statements
    // const regex = /console\.(log|debug|info|warn|error)\s*\([\s\S]*?\);?/gm;

    // This regex handles one level of nested parentheses: console.log( func() )
    const regex = /console\.(log|debug|info|warn|error)\s*\((?:[^()]+|\([^()]*\))*\);?/gm;

    
    const text = document.getText();// get the entire document (opened file) as a string, which will be searched for console log statements using the regex.
    let match;
    let deleteCount = 0;

  const success=   await editor.edit(editBuilder => {// .edit allows us to make changes to the document(currently opened). It takes a callback function that receives an editBuilder object,
    //  which is used to specify the edits we want to make to the document.
    //editBuilder is a tool inside the function to prform operation like delete , update etc on the document
        
    while ((match = regex.exec(text)) !== null) {//loop keeps running til there are console log statements in the text. regex.exec(text) searches for the next match of the regex in the text
    //  and returns an array with details about the match, or null if no more matches are found.
          
    // Convert the index of the match into a VS Code Range


    //1. match gives the index of string  and 
    //  2.match[0].length gives the length of the matched string.
    //  3. positionAt converts the index into a position object that VS Code can understand, which includes line and character information.
          
            const startPos = document.positionAt(match.index);//starting position of the current match 
            const endPos = document.positionAt(match.index + match[0].length);//ending position of the current match.
            //  match[0] contains the entire matched string (e.g., console.log(...);), so match.index + match[0].length gives us the index right after the end of the matched string.
            
            
            const range = new vscode.Range(startPos, endPos);

            editBuilder.delete(range);
            deleteCount++;
        }
    });

    if(success){
        vscode.window.showInformationMessage(`Deleted ${deleteCount} console log statements.`);
        suiteExplorerProvider.refresh();
    }else{
        vscode.window.showErrorMessage('Failed to delete console log statements.');
    }
 });


 //register the sidebar tree view iin activation function 
 const suiteExplorerProvider = new SuiteExplorerProvider();


 // This connects the ID in package.json ('suite-commands-view') to our code implementation (suiteExplorerProvider).
 //  It tells VS Code to use our SuiteExplorerProvider to populate the tree view with the ID 'suite-commands-view' that we defined in package.json.
  vscode.window.registerTreeDataProvider("suite-commands-view", suiteExplorerProvider);


context.subscriptions.push(cleanLogs);

const webviewProvider = new SuiteWebviewProvider(context.extensionUri);

context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SuiteWebviewProvider.viewType, webviewProvider)
);

suiteExplorerProvider.refresh();//refresh the tree view to show the updated console log count after deletion

}






// This method is called when your extension is deactivated(used for cleanup)
export function deactivate() {
    if (clockInterval) {
        clearInterval(clockInterval);
    }
}