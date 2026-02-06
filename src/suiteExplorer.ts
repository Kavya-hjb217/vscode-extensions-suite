import * as vscode from 'vscode';//import the entire vscode API 





//implementing a built-in interface TreeDataProvider to create a tree view
export class SuiteExplorerProvider implements vscode.TreeDataProvider<SuiteItem> {//every node of this tree would be  object our custon class SuiteItem which we will define later
    getTreeItem(element: SuiteItem): vscode.TreeItem {//vs code calls it for every item in the tree to dtermine how to render it (text,icon ,etc)
        return element;//since SuiteItem extends vscode.TreeItem, we can return it directly as it already contains all the necessary information for rendering.
    }


    //built-in  function to render the tree view
    getChildren(element?: SuiteItem): Thenable<SuiteItem[]> {//If this(element?) is undefined, it means we are at the very top (the Root).
    //  If it has a value, it means the user clicked a "Folder" and we need to show what's inside it.
        if (!element) {
            // we are at the root level, so return the top-level items
            return Promise.resolve([
                new SuiteItem("Utility Tools", vscode.TreeItemCollapsibleState.Expanded, "tools"),//already expanded for user to see 
                new SuiteItem("Information", vscode.TreeItemCollapsibleState.Collapsed, "info")//collapsed by default to keep the view clean and only show details when user wants to see
            ]);
        }

        // Sub-items for Utility Tools
        if (element.label === "Utility Tools") {
            return Promise.resolve([
                new SuiteItem("Clean Console Logs", vscode.TreeItemCollapsibleState.None, "trash", "ext.cleanConsoleLogs"),
                new SuiteItem("Insert Current Date", vscode.TreeItemCollapsibleState.None, "calendar", "ext.showDate")
            ]);
        }

        // Sub-items for Information
        if (element.label === "Information") {
            return Promise.resolve([
                new SuiteItem("Welcome Message", vscode.TreeItemCollapsibleState.None, "smiley", "ext.helloWorld")
            ]);
        }

        return Promise.resolve([]);//fallback case if there are no children to show . retursn an empty array wrapped in a promise to satisfy the return type of the function.
    }
}

class SuiteItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,//the text that will be displayed for this item in the tree view
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,//tells vs code if item is a folder or a final button 
        public readonly iconName: string,//icon name we want to show from VS Code's bilt-in icons library 
        public readonly commandId?: string//folders do notneed acommand but buttons do so we make it optional .
        //  it will hold the command identifier that should be executed when the item is clicked.
    ) {
        //call the constructor of the base class (vscode.TreeItem) to initialize the label and collapsible state of this item.
        super(label, collapsibleState);
        this.iconPath = new vscode.ThemeIcon(this.iconName);
        
        if (commandId) {
            this.command = {
                title: this.label,
                command: commandId
            };
        }
    }
}