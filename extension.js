// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { window, commands, workspace } = require('vscode');

const moment = require('moment')
const path = require('path')
const uploader = require('./lib/upload')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

async function upload(config, fsPath) {
  const editor = window.activeTextEditor
  const mdFilePath = editor.document.fileName
  const mdFileName = path.basename(mdFilePath, path.extname(mdFilePath))
  const imgName = path.basename(fsPath, path.extname(fsPath))
  const fileName = `${mdFileName}/${moment().format("YYYYMMDD_HHmmss")}${path.extname(fsPath)}`
  const imgurl = await uploader.upload(config, fsPath, fileName)
  editor.edit(textEditorEdit => {
    const txt = `![${imgName}](${imgurl})`
    textEditorEdit.insert(editor.selection.active, txt)
  })
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "hello-extension" is now active!');
  const config = workspace.getConfiguration('hugo-qcloud')

  const select = commands.registerCommand('extension.qcloud.select', async () => {
    const result = await window.showOpenDialog({
      filters: { 'Images': ['png', 'jpg', 'gif', 'bmp'] }
    });
    if (!result) {
      return;
    }
    const { fsPath } = result[0]
    try {
      await upload(config, fsPath)
    } catch (error) {
      window.showErrorMessage(error)
    }
  })

  context.subscriptions.push(select)
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
