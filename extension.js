// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { window, commands, workspace } = require('vscode');

const moment = require('moment')
const path = require('path')
const uploader = require('./lib/upload')
const utils = require('./lib/util')
const fs = require('fs')

async function saveLocal(source, basePath = '', fileName) {
  if (workspace.workspaceFolders === null) {
    return;
  }
  const workDir = workspace.workspaceFolders[0].uri.fsPath
  const dist = path.join(workDir, basePath, fileName);
  fs.createReadStream(source).pipe(fs.createWriteStream(dist))
    .on("error", (e) => {
      throw e;
    });
  return dist.replace(workDir, '').replace(/\\/g, '\/');
}

async function upload(config, fsPath) {
  const editor = window.activeTextEditor
  const mdFilePath = editor.document.fileName
  const mdFileName = path.basename(mdFilePath, path.extname(mdFilePath))
  const imgName = path.basename(fsPath, path.extname(fsPath))
  const fileName = `${mdFileName}_${moment().format("YYYYMMDD_HHmmss")}${path.extname(fsPath)}`
  // 当前路径的绝对路径
  const saveType = config.enable;
  let imgUrl
  // 保存本地
  if (saveType === "all" || saveType === "local") {
    imgUrl = await saveLocal(fsPath, config.basePath, fileName)
  }
  // 上传qcloud
  if (saveType === "all" || saveType === "qcloud") {
    imgUrl = await uploader.qUpload(utils.coverConfig(config), fsPath, fileName)
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

  const config = workspace.getConfiguration('qcloudImage')
  if (!config.enable || config.enable === 'off') {
    return;
  }

  const select = commands.registerCommand('extension.qcloudImage.select', async () => {
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
