/*
 * @Author: jh
 * @Date: 2021-05-14 17:47:03
 * @Description: file content
 * @FilePath: \day01\7.js-ticket\wechat\ceshi.js
 */

var qs = require('qs')

let str = '?q=size~10,vin~1222,source~GC,isSecondHandCar~true,page~1,'

str = qs.parse(str,{ignoreQueryPrefix: true})
str = str.q.replace(/,/g,'&').replace(/~/g,'=')
str = qs.parse(str)
// str.q.split(',')
// let obj = {}
// str = str.map(i=>{
//   i.split('~')
// })
console.log(str)