// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { window, commands, workspace } = require('vscode');

const moment = require('moment')
const path = require('path')
const uploader = require('./lib/upload')
const utils = require('./lib/util')
const fs = require('fs')

function saveLocal(source, dist) {
  fs.createReadStream(source).pipe(fs.createWriteStream(dist))
}

async function upload(config, fsPath) {
  const editor = window.activeTextEditor
  const mdFilePath = editor.document.fileName
  const mdFileName = path.basename(mdFilePath, path.extname(mdFilePath))
  const imgName = path.basename(fsPath, path.extname(fsPath))
  const fileName = `${mdFileName}_${moment().format("YYYYMMDD_HHmmss")}${path.extname(fsPath)}`
  // 当前路径的绝对路径
  let imgUrl = `/${config.path}/${fileName}`
  const saveType = config.enable;
  if (saveType === "all" || saveType === "qcloud") {
    imgUrl = await uploader.qUpload(utils.coverConfig(config), fsPath, fileName)
  }
  if (saveType === "all" || saveType === "local") {
    await saveLocal(fsPath, imgUrl)
  }
  editor.edit(textEditorEdit => {
    const txt = `![${imgName}](${imgUrl})`
    textEditorEdit.insert(editor.selection.active, txt)
  })
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  const config = workspace.getConfiguration('hugoImage')
  if (config.enable === 'off') {
    return;
  }

  const select = commands.registerCommand('extension.hugoImage.select', async () => {
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
