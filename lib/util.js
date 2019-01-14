function coverConfig(config) {
  // 为啥? 使配置命名更符合插件约定
  return {
    SecretId: config.secretId,
    SecretKey: config.ecretKey,
    Bucket: config.bucket,
    Region: config.region,
    Domain: config.domain
  }
}

module.exports = {
  coverConfig
}