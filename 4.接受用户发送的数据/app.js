/*
 * @Author: jh
 * @Date: 2021-05-12 17:21:44
 * @Description: file content
 * @FilePath: \20210511\day01\4.接受用户发送的数据\app.js
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


// 引入eapress
const express = require('express')

// 创建app
const app = express()
// 引入验证服务器有效性
const auth = require('./wechat/auth')
// 验证服务器有效性
app.use(auth())

let server = app.listen(3111,()=>{
  console.log('服务器启动成功')
})  
