# vsocode markdown 编辑下 替换本地图片为qcloud url
## 功能
vscode插件 编辑markdown时可右键选择插入本地图片,上传到腾讯云并copy到md相对目录,方便写hugo博客
## 配置
```javascript
  /**
   * all 插入本地并上传到腾讯云
   * off 不用插件
   * qcloud 仅上传到腾讯云不copy副本到目录
   * local 仅copy副本到目录
  **/
  "qcloudImage.enable": "all",
  "qcloudImage.domain": "https://static.youngcong.com/", // 如果存储桶域名
  "qcloudImage.secretId": "AKIDzmPnxr0v4xax5xIx5zd1A3g4D6vZF71g", // 开发者拥有的项目身份识别 ID
  "qcloudImage.secretKey": "", //  开发者拥有的项目身份密钥
  "qcloudImage.bucket": "ghost-1251180266@ap-beijing", //  存储桶名@桶地域
  "qcloudImage.localPath": "./static"  // 本地存储目录 workspaceFolders相对路径
```
## 使用
  没搞定开发者账号所以没上marketplace,可以使用已打包的.vsix或者自行打包
 
  ~~有人能上传那就更好了~~
 ```bash
  git clone 
  npm i 
  npm i -g vsce
  vsce package
 ```