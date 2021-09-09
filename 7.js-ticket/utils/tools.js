/*
 * @Author: jh
 * @Date: 2021-05-12 17:42:36
 * @Description: file content
 * @FilePath: \20210511\day01\6.自定义菜单\utils\tools.js
 */
const {readFile,writeFile} = require('fs')
// 引入xml2js
const {parseString} = require('xml2js')
// 引入path
const {resolve} = require('path')

module.exports = {
  getUserDataAsync(req){
    return new Promise((resolve,rej)=>{
      let xmlData = ''
      req.on('data',data =>{
        // 当流式数据传过来时触发
        console.log(data) //<Buffer 3c 7> buffer数据转成xml字符串，使用tostring
        xmlData+=data.toString() 
      }).on('end',()=>{
        // 当数据接受完毕时触发
        resolve(xmlData)
      })
    })
  },
  parseXmlAsync(xmlData){
//     <xml><ToUserName><![CDATA[gh_a167d5b14e31]]></ToUserName>
// <FromUserName><![CDATA[odSRs59i-7lO1fv_7ogMcz19xLLI]]></FromUserName>
// <CreateTime>1620870067</CreateTime>
// <MsgType><![CDATA[text]]></MsgType>
// <Content><![CDATA[上岛咖啡]]></Content>
// <MsgId>23205279357969383</MsgId>
// </xml>

// 转化成 下面的格式

// { xml:
//   { ToUserName: [ 'gh_a167d5b14e31' ],
//     FromUserName: [ 'odSRs59i-7lO1fv_7ogMcz19xLLI' ],
//     CreateTime: [ '1620869883' ],
//     MsgType: [ 'text' ],
//     Content: [ '客户垫付' ],
//     MsgId: [ '23205277013729472' ] } }
    // 把xml字符串做化成js
    return new Promise((resolve,reject)=>{
      parseString(xmlData,{trim:true},(err,data)=>{
        if(!err){
          // console.log(data,'把xml字符串做化成js')
          resolve(data)
        }else{
          reject('parseXmlAsync报错')
        }
      })
    })
  },
  dataDeal(data){
    let obj = {}
    data = data.xml
    if(typeof data === 'object'){
      for(key in data){
        let value = data[key]
        if(Array.isArray(value) && value.length>0){
          obj[key] = data[key][0]
        }
      }
    }
    return obj
  },
  writeFileFun(data,fileName){
    data = JSON.stringify(data)
    let filePath = resolve(__dirname,fileName)
    return new Promise((resolve,reject)=>{
      writeFile(filePath,data,err=>{
        if(!err){
          console.log('保存成功')
          resolve(data)
        }else {
          console.log('writeFile报错，'+ err)
          reject(err)
        }
      })
    })
  },
  readFileFun(fileName){
    let filePath = resolve(__dirname,fileName)
    return new Promise((resolve,reject)=>{
      readFile(filePath,(err,data)=>{
        if(!err){
          data = JSON.parse(data)
          console.log('读取成功')
          resolve(data)
        }else {
          console.log('readFile报错，'+ err)
          reject(err)
        }
      })
    })
  }
}