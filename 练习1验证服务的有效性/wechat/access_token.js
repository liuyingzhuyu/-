/*
 * @Author: jh
 * @Date: 2021-05-17 11:48:00
 * @Description: file content
 * @FilePath: \day01\练习1验证服务的有效性\wechat\access_token.js
 */

//

// const config = {
//   appID:'wx2eee9e5dbdc1ed5b',
//   appsecret: '9df1f37ed2abaf67a43206df2edc2382',
//   token: 'usioidui8980511'
// }

const got = require('got');
const fs = require('fs');
var {appID, appsecret, token} = require('../config')

class Wechat {
  constructor(){
    
  }
  getAccessToken(){
    return new Promise((resolve,reject)=>{
        // let url =  `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
        // got(url).then(res=>{
        //   // {"access_token":"45_7Iwcq1tJZOrTyQXj5ZZI8RUtADJmCgCTQn489SqrMaSpZ3FQgt3OXUlVWeNVfTBoVg2Isdo7lv2de6-hbEfFGDnu-I__GPuBOLvvUnRPhRdnD1WO9OHLHlykcYy2CGW4qFYUi95KkPYr_rFSTSUaABANMO",
        //   // "expires_in":7200}
        //   res = JSON.parse(res.body)
        //   console.log(res,'333')
        // })
        let url =  `https://api.weixin.qq.com/cgi-bin/token`
        got(url,
          {
            searchParams: 
            {
              grant_type: 'client_credential',
              appid: appID,
              secret:appsecret
            }
          }).then(res=>{
          res = JSON.parse(res.body)
          // {"access_token":"45_7Iwcq1tJZOrTyQXj5ZZI8RUtADJmCgCTQn489SqrMaSpZ3FQgt3OXUlVWeNVfTBoVg2Isdo7lv2de6-hbEfFGDnu-I__GPuBOLvvUnRPhRdnD1WO9OHLHlykcYy2CGW4qFYUi95KkPYr_rFSTSUaABANMO",
          // "expires_in":7200}
          // console.log(res,'666')
          res.expires_in = Date.now() + (res.expires_in - 5*60)*1000
          resolve(res)
        }).catch(e=>{
          reject('getAccessToken方法出错了，'+e)
        })
    })
  }
  writeFileAccessToken(data){
    data = JSON.stringify(data)
    return new Promise((resolve, reject)=>{
      fs.writeFile('./access_token.txt', data, (err) => {
        if (err) {
          console.log('文件保存失败');
          reject(err)
        }else {
          console.log('文件保存成功');
          resolve()
        }
      });
    })
  }
  readFileAccessToken(){
    return new Promise((resolve, reject)=>{
      fs.readFile('./access_token.txt', (err, data) => {
        if (err) {
          console.log('文件读取失败');
          reject(err)
        }else {
          console.log('文件读取成功');
          resolve(JSON.parse(data))
        }
      });
    })
  }
  isValidAccessToken(data){
   if(!data.expires_in){
     return false
   }
   return  data.expires_in > Date.now()
  }
  fetchAccessToken(){
   return  this.readFileAccessToken().then( async res=>{
      // 读取成功
      if(this.isValidAccessToken(res)){
        // 有效期内
        return Promise.resolve(res)
      }else{
        // 过期
        let res = await this.getAccessToken()
        await this.writeFileAccessToken(res)
        return Promise.resolve(res)
      }
    }).catch(async err=>{ 
      // 没有文件
      console.log('没有文件')
      let res = await this.getAccessToken()
      await this.writeFileAccessToken(res)
      return Promise.resolve(res)
    }).then(res=>{
      this.access_token = res.access_token
      this.expires_in = res.expires_in
      return Promise.resolve(res)
    })
  }
}




(async function(){
  let w = new Wechat()
  let aa = await w.fetchAccessToken()
  console.log(aa,'aa')
})()
