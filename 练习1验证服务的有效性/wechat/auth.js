/*
 * @Author: jh
 * @Date: 2021-05-17 15:56:34
 * @Description: file content
 * @FilePath: \day01\练习1验证服务的有效性\wechat\auth.js
 */

// 引入sha1
var sha1 = require('sha1');
var config = require('../config')
// 引入xml2js
const {parseString} = require('xml2js')

module.exports = ()=>{
  return (req, res, next) =>{
    console.log(req.query,'req>>>')
    // { signature: '969a797d42024e0b649dadc5016f05676f97a5bb',
    // echostr: '5507858842664295868',
    // timestamp: '1621220780',
    // nonce: '1263714188' },
  
    /* 开发者通过检验signature对请求进行校验（下面有校验方式）。
    若确认此次GET请求来自微信服务器，请原样返回echostr参数内容，则接入生效，成为开发者成功，否则接入失败。加密/校验流程如下：
  
    1）将token、timestamp、nonce三个参数进行字典序排序 
    2）将三个参数字符串拼接成一个字符串进行sha1加密 
    3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信 */
  
    let {token } = config
    let {signature, echostr, timestamp, nonce} = req.query
    let arr = [token,timestamp,nonce].sort()
    let str = sha1(arr.join('')); 
  
    // if(str === signature){
    //  console.log('请求来源于微信服务器')
    //  res.send(echostr);
    // }

   req.on('data',data=>{
     // buffer数据 ---> xml字符串
     data = data.toString()
     // xml 转成js
     const dataJS = parseString(data)
 
     console.log(data,'9999999999')// buffer数据
   })

  }
}