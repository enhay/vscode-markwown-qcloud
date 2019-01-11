const path = require('path')
const mime = require('mime-types')
const fs = require('fs');
const CloudCOS = require('cos-nodejs-sdk-v5');

let cos;

async function upload(config, fPath, fName) {
  return fName;
  if (!cos) {
    init(config)
  }
  const state = await fs.statSync(fPath)
  try {
    const imgurl = await cos.putObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: fName,
      ContentLength: state.size,
      ContentType: mime.lookup(fPath),
      Body: fs.createReadStream(fPath)
    });
    return imgurl
  } catch (error) {
    throw error;
  }
}

function init(config) {
  cos = CloudCOS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey
  });
}


module.exports = {
  upload,
  init
}