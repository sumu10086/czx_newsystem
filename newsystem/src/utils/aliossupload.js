import OSS from "ali-oss"
// 上传函数
export function client() {
  // 配置好 代码和 云存储的连接配置
  var clientOss = new OSS({
    endpoint: "oss-cn-hangzhou.aliyuncs.com", //服务器 最终节点
    accessKeyId: "LTAI5tDehbQEZ3A5dCY6oHgp",
    accessKeySecret: "Sd9yhbXMCX4nPvR4JzgnCWDhTTqec6",
    bucket: "czxbucket1" //远程服务器OSS对象存储的  文件夹 桶
  })

  return clientOss // clientOss 是和远程的连接点返回实例对象
}

/**
 * 生成随机uuid
 */
export const getFileNameUUID = () => {
  function rx() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return `${+new Date()}_${rx()}${rx()}`
}
