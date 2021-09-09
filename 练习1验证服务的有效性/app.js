/*
 * @Author: jh
 * @Date: 2021-05-17 10:02:53
 * @Description: file content
 * @FilePath: \day01\练习1验证服务的有效性\app.js
 */


// 开启一个服务器，express
// 安装express ， npm i express

// 引入express
var express = require('express')

var auth = require('./wechat/auth')
// 创建一个应用
var app = express()


app.use(auth())

// 监听接口
app.listen(3001,()=>{
  console.log('服务器启动成功')
})