/*
 * @Author: jh
 * @Date: 2021-05-12 17:21:44
 * @Description: file content
 * @FilePath: \20210511\day01\4.接受用户发送的数据\wechat\auth.js
 */

const sha1 = require('sha1')
// 引入配置文件
const config = require('../config')
const {getUserDataAsync,parseXmlAsync,dataDeal } = require('../utils/tools')
module.exports = ()=>{
  return async (req,res,next )=>{
    let {signature,echostr,timestamp,nonce} = req.query
    let {token} = config
    let sha1Str = sha1([token,timestamp,nonce].sort().join(''))

    
    // 判断请求方式
   if(req.method === 'GET'){

    if(sha1Str === signature){
      console.log('微信服务接通')
      res.send(echostr)
     }else {
       res.end('error')
     }
   }else if(req.method === 'POST'){
    if(sha1Str !== signature){ // 消息不是微信服务器
      res.end('error')
     }
  //    { signature: '95da8f7dc9c7630a2c04c233f3f3012b10d6644f',
  // timestamp: '1620812077',
  // nonce: '93062768',
  // openid: 'odSRs59i-7lO1fv_7ogMcz19xLLI' } // 用户id
    // console.log(req.query)
   let xmlData =  await getUserDataAsync(req)
  //  console.log(xmlData)
  /*   
  <xml><ToUserName><![CDATA[gh_a167d5b14e31]]></ToUserName> 开发者id
  <FromUserName><![CDATA[odSRs59i-7lO1fv_7ogMcz19xLLI]]></FromUserName> 用户openid
  <CreateTime>1620813825</CreateTime> 发送时间
  <MsgType><![CDATA[text]]></MsgType> 内容类型
  <Content><![CDATA[士大夫]]></Content> 消息内容
  <MsgId>23204472997329133</MsgId> 消息id
  </xml>
  */

  // 解析xml方法
  xmlData = await parseXmlAsync(xmlData)
  // console.log(xmlData)
  // { xml:
  //   { ToUserName: [ 'gh_a167d5b14e31' ],
  //     FromUserName: [ 'odSRs59i-7lO1fv_7ogMcz19xLLI' ],
  //     CreateTime: [ '1620869883' ],
  //     MsgType: [ 'text' ],
  //     Content: [ '客户垫付' ],
  //     MsgId: [ '23205277013729472' ] } }
  message = dataDeal(xmlData)
  console.log(message)
/* 
  一旦遇到以下情况，微信都会在公众号会话中，向用户下发系统提示“该公众号暂时无法提供服务，请稍后再试”：
    1、开发者在5秒内未回复任何内容 
    2、开发者回复了异常数据，比如JSON数据、字符串、多出的空格等 
*/

let content = "您在说什么，我听不懂"
let replyMessage = ''
// 客户回复
// 判断消息是否是文本消息
if(message.MsgType === 'text'){
  // 判断消息内容，根据内容返回响应
  if(message.Content === '1'){ // 全匹配
     content = '大吉大利，今晚吃鸡'
  }else if(message.Content === '2'){
    content = '冒险级'
  }else if(message.Content.match('爱')){
    content = '我爱你~'
  }
  console.log(content,'content')
  replyMessage = `<xml>
        <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
        <CreateTime>${Date.now()}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${content}]]></Content>
      </xml>`
   
}

res.send(replyMessage)




    // // 如果开发服务器没有给微信服务器发送消息，微信服务器会发送三次请求过来
    // res.end('')
   }else {
    res.end('error')
   }
  }
}