const mime = require('mime-types')
const fs = require('fs');
const CloudCOS = require('cos-nodejs-sdk-v5');

async function qUpload(config, fPath, fName) {
  const cos = new CloudCOS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey
  });

  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: fName,
      ContentLength: fs.statSync(fPath).size,
      ContentType: mime.lookup(fPath),
      Body: fs.createReadStream(fPath)
    }, (err, data) => {
      if (err) {
        return reject(err)
      }
      if (config.Domain) {
        resolve(`${config.Domain}${fName}`)
      }
      resolve("https://" + data.Location)
    });
  })
}

module.exports = {
  qUpload
}