function coverConfig(config) {

  const [bucket, region] = config.bucket.split('@')

  // 为啥? 使配置命名更符合插件约定
  return {
    SecretId: config.secretId,
    SecretKey: config.secretKey,
    Bucket: bucket,
    Region: region,
    Domain: config.domain
  }
}


module.exports = {
  coverConfig
}