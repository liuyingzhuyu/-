/*
 * @Author: jh
 * @Date: 2021-05-12 13:31:26
 * @Description: file content
 * @FilePath: \20210511\day01\3.获取access_token\wechat\accessTaken copy.js
 */
const {readFile,writeFile} = require('fs')

/* 读取access_token文件
  - 文件存在
    - 判断access_token是否有效
      -有效，读取文件
      -无效，调取接口重新获取，存储在access_token文件中
  - 文件不存在
    - 调取接口获取access_token，存储在access_token文件中 */
// 引入request-promise-native，用来调用接口
const rp = require('request-promise-native')
const { appID,appsecret} = require('../config')
  class Wechart{
    constructor(){
      
    }
    // 获取access_token
    // https请求方式: GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    getAccessTaken(){
      //服务器之间调用接口，安装 request request-promise-native
      // npm i request request-promise-native
      return new Promise((resolve,reject)=>{
        let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`

        rp({method: 'GET',url,json: true}).then(res=>{
  
         /*  { access_token:
            '45_x6oKwYiG4Qe5G_AMoXFxBWNU37L6P7XSGwujsiB9bSujbWdJEjwva4wnkuRYc2IoC5g18W1eXMjwfEZIEYHSdS0WodsU5xZdif08xyKcXwczGquSJaAm6KJZgJj0N4NVJ6CAyD6yBcU3QCPzGORgAHAAIL',
           expires_in: 7200 }  */
          //  最后5分钟内，新老access_token都可用
          console.log(res,'res')
          // 设置过期时间
          res.expires_in = Date.now() + (7200 - 60*5) *1000          // 单位毫秒
          // 数据需要返出去
          resolve(res)
        }).catch(err=>{
          reject("getAccessTaken出错了，" + err)
        })
      })
    }
    /**
     * @name: 用来保存access_token
     * @description: 
     * @param {*} data
     * @return {*}
     */
    saveAccessTaken(data){
      data = JSON.stringify(data)
      return new Promise((resolve,reject)=>{
        writeFile('./access_token.txt',data,err=>{
          if(!err){
            console.log('保存成功')
            resolve()
          }else {
            console.log('saveAccessTaken报错，'+ err)
            reject(err)
          }
        })
      })
    }
        /**
     * @name: 用来读取access_token
     * @description: 
     * @param {*} 
     * @return {*}
     */
    readAccessTaken(){
      return new Promise((resolve,reject)=>{
        readFile('./access_token.txt',(err,data)=>{
          if(!err){
            data = JSON.parse(data)
            console.log('读取成功')
            resolve(data)
          }else {
            console.log('readAccessTaken报错，'+ err)
            reject(err)
          }
        })
      })
    }
    /**
     * @name: 检测是否有效
     * @description: 
     * @param {*} accesstaken
     * @return {*}
     */
    isValidAccessToken(data){
      //无效参数
       if(!data || !data.expires_in || !data.access_token){
         return false
       }
      // 检测access_token是否有效
      // if(data.expires_in < Day.now()){
      //   // 过期了
      //   return false
      // }else {
      //   // 没过期
      //   return true
      // }
      return data.expires_in > Date.now()
    }
  }
var w = new Wechart()
new Promise((resolve,reject)=>{
  w.readAccessTaken()
  .then(res=>{
    // 本地有文件
    // 判断是否有效
    if(w.isValidAccessToken(res)){
     // 有效
     resolve(res)
    }else{
      // 过期
    w.getAccessTaken().then(res=>{
        w.saveAccessTaken(res).then(()=>{
         resolve(res)
        })
     })
    }
  }).catch(err=>{
    // 本地没有文件
    console.log(err)
    w.getAccessTaken().then(res=>{
       w.saveAccessTaken(res).then(()=>{
        resolve(res)
       })
    })
  })
}).then(res=>{
  console.log(res)
})