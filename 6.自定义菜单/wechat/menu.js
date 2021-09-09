/*
 * @Author: jh
 * @Date: 2021-05-13 14:13:12
 * @Description: file content
 * @FilePath: \20210511\day01\6.自定义菜单\wechat\menu.js
 */
module.exports =  {
  "button":[
  {	
       "type":"click",
       "name":"今日歌曲",
       "key":"今日歌曲"
   },
   {
        "name":"菜单",
        "sub_button":[
        {	
            "type":"view",
            "name":"搜索",
            "url":"http://www.soso.com/"
         },
        //  {
        //       "type":"miniprogram",
        //       "name":"wxa",
        //       "url":"http://mp.weixin.qq.com",
        //       "appid":"wx286b93c14bbf93aa",
        //       "pagepath":"pages/lunar/index"
        //   },
         {
            "type": "scancode_waitmsg", 
            "name": "扫码带提示", 
            "key": "rselfmenu_0_0", 
            "sub_button": [ ]
          }, 
          {
              "type": "scancode_push", 
              "name": "扫码推事件", 
              "key": "rselfmenu_0_1", 
              "sub_button": [ ]
          },
          {
            "name": "发送位置", 
            "type": "location_select", 
            "key": "rselfmenu_2_0"
        },
        
          // {
          //   "type": "media_id", 
          //   "name": "图片", 
          //   "media_id": "MEDIA_ID1"
          // }, 
          // {
          //   "type": "view_limited", 
          //   "name": "图文消息", 
          //   "media_id": "MEDIA_ID2"
          // }
        ]
    },
    {
      "name": "发图", 
      "sub_button": [
     
          {
              "type": "pic_sysphoto", 
              "name": "系统拍照发图", 
              "key": "rselfmenu_1_0", 
             "sub_button": [ ]
           }, 
          {
              "type": "pic_photo_or_album", 
              "name": "拍照或者相册发图", 
              "key": "rselfmenu_1_1", 
              "sub_button": [ ]
          }, 
          {
              "type": "pic_weixin", 
              "name": "微信相册发图", 
              "key": "rselfmenu_1_2", 
              "sub_button": [ ]
          }
      ]
  }, 
  ]
}