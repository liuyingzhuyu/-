/*
 * @Author: jh
 * @Date: 2021-05-12 17:21:44
 * @Description: file content
 * @FilePath: \20210511\day01\6.自定义菜单\app.js
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
// 引入wechat
const Wechat = require('./wechat/wechat')
// 创建app
const app = express()
// 引入验证服务器有效性
const auth = require('./wechat/auth')

const {url} = require("./config")
const sha1 = require('sha1')
const wechatApi = new Wechat()
const config = require('./config')
// 配置模板资源目录
app.set('views','./views')
// 配置模板引擎
app.set('view engine','ejs')

// 页面路由
app.get('/search', async (req,res)=>{
/* 
   生成js-sdk生成额签名
   1.noncestr（随机字符串）jsapi_ticket（票据）、timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分）
   2.字典序排序，用&凭借起来
   3.sha1加密
   */
const jsapi_ticket = await wechatApi.fetchTicket()
let noncestr = Math.random().toString().split('.')[1]
const timestamp = Date.now()
let arr = [
  `jsapi_ticket=${jsapi_ticket}`,
  `noncestr=${noncestr}`,
  `timestamp=${timestamp}`,
  `url=${url}/search`].sort()
const signature = sha1(arr.join('&'))
console.log(signature,'str')
// wx.config({
//   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//   appId: config.appID, // 必填，公众号的唯一标识
//   timestamp , // 必填，生成签名的时间戳
//   nonceStr, // 必填，生成签名的随机串
//   signature,// 必填，签名
//   jsApiList: [

//   ] // 必填，需要使用的JS接口列表
// });
wx.ready(function(){
  console.log('成功了')
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});

  res.render('search',{
    signature,
    noncestr,
    timestamp
  })
})
// 验证服务器有效性
app.use(auth())

let server = app.listen(8888,()=>{
  console.log('服务器启动成功')
})  
