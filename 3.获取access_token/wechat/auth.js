/*
 * @Author: jh
 * @Date: 2021-05-12 10:45:19
 * @Description: 服务器验证有效性
 * @FilePath: \20210511\day01\3.获取access_token\wechat\auth.js
 */
const sha1 = require('sha1')
// 引入配置文件
const config = require('../config')
module.exports = ()=>{
  return (req,res,next )=>{
    console.log(req.query,'req')
  /*  
   { signature: 'f66d0d4a1143091568618cbe0eefc9830d233a7e', // 微信加密签名
    echostr: '3664114564510441343', // 微信随机字符串
    timestamp: '1620727563',        // 微信发送请求时间戳
    nonce: '1907106029' }           //微信的随机数字
   */
   let {signature,echostr,timestamp,nonce} = req.query
   let {token} = config
    // 1. 将比上年于微信加密签名的三个参数（token,timestamp,nonce）按照字典序排序并组合在一起形成一个数组
   let arr = [token,timestamp,nonce]
   let arrSort = arr.sort()
    // 2. 将数组里所有的参数拼接成一个字符串，进行sha1加密
    let str = arrSort.join('')
    let sha1Str = sha1(str)
    // 3. 加密完成就生成了一个signature，和微信发送过来的进行对比
    if(sha1Str === signature){
     res.send(echostr)
    }else {
      res.end('error')
    }
  }
}