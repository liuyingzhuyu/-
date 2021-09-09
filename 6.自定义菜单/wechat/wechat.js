/*
 * @Author: jh
 * @Date: 2021-05-12 13:31:26
 * @Description: file content
 * @FilePath: \20210511\day01\6.自定义菜单\wechat\wechart.js
 */
const {readFile,writeFile} = require('fs')
const { resolve } = require('path')

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
const menu = require('./menu')
const {writeFileFun,readFileFun} = require('../utils/tools') 
class Wechat{
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
          //  5分钟内，新老access_token都可用
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
      // data = JSON.stringify(data)
      // return new Promise((resolve,reject)=>{
      //   writeFile('./access_token.txt',data,err=>{
      //     if(!err){
      //       console.log('保存成功')
      //       resolve()
      //     }else {
      //       console.log('saveAccessTaken报错，'+ err)
      //       reject(err)
      //     }
      //   })
      // })
      return writeFileFun(data,'access_token.txt')
    }
        /**
     * @name: 用来读取access_token
     * @description: 
     * @param {*} 
     * @return {*}
     */
    readAccessTaken(){
      // return new Promise((resolve,reject)=>{
      //   readFile('./access_token.txt',(err,data)=>{
      //     if(!err){
      //       data = JSON.parse(data)
      //       console.log('读取成功')
      //       resolve(data)
      //     }else {
      //       console.log('readAccessTaken报错，'+ err)
      //       reject(err)
      //     }
      //   })
      // })
      return readFileFun('access_token.txt')
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
    /**
     * @name: 获取有效的access_token
     * @description: 
     * @param {*}
     * @return {*}
     */    
    fetchAccessToken(){
      if(this.access_token && this.expires_in && this.isValidAccessToken(this) ){
        return Promise.resolve({
          access_token: this.access_token,
          expires_in: this.expires_in
        })
      }
      return this.readAccessTaken()
        .then(async res=>{
          // 本地有文件
          // 判断是否有效
          if(this.isValidAccessToken(res)){
          // 有效
          // resolve(res)
          return Promise.resolve(res)
          }else{
            // 过期
          let res = await this.getAccessTaken()
          await this.saveAccessTaken(res)
          // resolve(res)
          return Promise.resolve(res)
          }
        }).catch(async err=>{
          // 本地没有文件
          console.log(err)
          let res = await this.getAccessTaken()
          await this.saveAccessTaken(res)
          // resolve(res)
          return Promise.resolve(res)
        }).then((res)=>{
          this.access_token = res.access_token
          this.expires_in = res.expires_in
          return Promise.resolve(res)
        })
     
    }

     // 获取jsapi_ticket
    // https请求方式: GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    getTicket(){
      //服务器之间调用接口，安装 request request-promise-native
      // npm i request request-promise-native

      return new Promise(async(resolve,reject)=>{
        let {access_token} = await this.fetchAccessToken()
        let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`

        rp({method: 'GET',url,json: true}).then(res=>{
  
         /*  { access_token:
            '45_x6oKwYiG4Qe5G_AMoXFxBWNU37L6P7XSGwujsiB9bSujbWdJEjwva4wnkuRYc2IoC5g18W1eXMjwfEZIEYHSdS0WodsU5xZdif08xyKcXwczGquSJaAm6KJZgJj0N4NVJ6CAyD6yBcU3QCPzGORgAHAAIL',
           expires_in: 7200 }  */
          //  5分钟内，新老access_token都可用
          console.log(res,'接口返回res')
          // 设置过期时间
          res.expires_in = Date.now() + (7200 - 60*5) *1000          // 单位毫秒
          // 数据需要返出去
          resolve(res)
        }).catch(err=>{
          reject("getTicket出错了，" + err)
        })
      })
    }
    /**
     * @name: 用来保存jsapi_ticket
     * @description: 
     * @param {*} data
     * @return {*}
     */
    saveTicket(data){
      return writeFileFun(data,'ticket.txt')
    }
        /**
     * @name: 用来读取access_token
     * @description: 
     * @param {*} 
     * @return {*}
     */
    readTicket(){
     return readFileFun('ticket.txt')
    }
    /**
     * @name: 检测是否有效
     * @description: 
     * @param {*} accesstaken
     * @return {*}
     */
    isValidTicket(data){
      console.log(data,'isValidTicket')
      //无效参数
       if(!data || !data.ticket_expires_in || !data.ticket){
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
      return data.ticket_expires_in > Date.now()
    }
    /**
     * @name: 获取有效的ticket
     * @description: 
     * @param {*}
     * @return {*}
     */    
    fetchTicket(){
      if(this.ticket && this.ticket_expires_in && this.isValidTicket(this) ){
        return Promise.resolve({
          access_token: this.ticket,
          expires_in: this.ticket_expires_in
        })
      }
      return this.readTicket()
        .then(async res=>{
          // 本地有文件
          // 判断是否有效
          if(this.isValidTicket(res)){
          // 有效
          // resolve(res)
          return Promise.resolve(res)
          }else{
            // 过期
          let res = await this.getTicket()
          await this.saveTicket(res)
          // resolve(res)
          return Promise.resolve(res)
          }
        }).catch(async err=>{
          // 本地没有文件
          console.log(err)
          let res = await this.getTicket()
          await this.saveTicket(res)
          // resolve(res)
          return Promise.resolve(res)
        }).then((res)=>{
          console.log(res,'获取票据')
          this.ticket = res.ticket
          this.ticket_expires_in = res.expires_in
          return Promise.resolve(res)
        })
     
    }

    /**
     * @name: 创建菜单
     * @description: 
     * @param {*} menu
     * @return {*}
     */
    createMenu(menu){
      return new Promise(async(resolve,reject)=>{
         try{
           const {access_token} = await this.fetchAccessToken()
           let url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`
           const res =  rp({method:'POST',url,json:true,body: menu})
           resolve(res)
         }catch(e){
           console.log('createMenu方法出现问题，'+e)
           reject(e)
         }
      })
    }
    deleteMenu(){
      return new Promise(async(resolve,reject)=>{
        try{
          const {access_token} = await this.fetchAccessToken()
          console.log(access_token,'access_token')
          let url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`
          const res =  rp({method:'GET',url,json:true})
          resolve(res)
        }catch(e){
          console.log('deleteMenu方法出现问题，'+e)
          reject(e)
        }
     })
    }
}
// var w = new Wechart()
// w.fetchAccessToken().then(res=>{
//   console.log(res)
// })


// 自定义菜单
// (async()=>{
//   var w = new Wechart()
//   let res = await w.deleteMenu()
//   console.log(res)
//   let res2 = await w.createMenu(menu)
//   console.log(res2)
// })()

// var w = new Wechart()
// w.fetchTicket().then(res=>{
//   console.log(res)
// })

module.exports = Wechat