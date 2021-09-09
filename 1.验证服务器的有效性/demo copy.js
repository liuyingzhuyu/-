/*
 * @Author: jh
 * @Date: 2021-05-12 10:15:58
 * @Description: file content
 * @FilePath: \20210511\day01\demo.js
 */

/*
验证服务器的有效性
1.微信服务器知道开发者服务器是哪个
 - 测试号管理页面填写url开发者服务器地址
   - 使用ngrok 内网穿透 将本地端口号开启的服务映射外网跨域访问一个网址
   - ngrok http 3000
 - 填写token
   -参与微信签名加密的一个参数
2.开启服务器 - 验证消息是否来自于微信服务器
  目的：计算得出signature微信加密签名，和微信传递过来的signature经行对比，如果一样，说明消息来自于微信服务器，如果不一样，说明不是微信服务器发送的消息。
  1. 将比上年于微信加密签名的三个参数（token,timestamp,nonce）按照字典序排序并组合在一起形成一个数组
  2. 将数组里所有的参数拼接成一个字符串，进行sha1加密
  3. 加密完成就生成了一个signature，和微信发送过来的进行对比
      如果一样，说明消息来自微信服务器，返回echostr给微信服务器
      如果不一样，说明不是微信服务器发送的消息，返回error
*/

const config = {
  appID:'wx2eee9e5dbdc1ed5b',
  appsecret: '9df1f37ed2abaf67a43206df2edc2382',
  token: 'usioidui8980511'
}
// 引入eapress
const express = require('express')
const sha1 = require('sha1')
// 创建app
const app = express()
// 验证服务器有效性
app.use((req,res,next )=>{
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
})

let server = app.listen(3111,()=>{
  console.log('服务器启动成功')
})  
