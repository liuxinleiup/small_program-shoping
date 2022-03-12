import{request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {login} from "../../utils/asyncWX.js";

// Page({
//     //获取用户信息
//   async  handleGetUserInfo(e){
//     try {
//           //1获取用户信息 
//           const {encryptedData,rawData,iv,signature}=e.detail;
//           //2获取小程序登录成功后的code值
//           const {code}=await login();
//           const loginParams={encryptedData,rawData,iv,signature,code};
//           //3发送请求获取用户的token值
//           const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
//           //4把token存储到缓存中 同时跳转回上一个页面
//           wx.setStorageSync('token', token);
//           wx.navigateBack({
//             delta:1
//           });
//     } catch (error) {
//       console.log(error);
//     }
//     }
// })


Page({
    /**
     * 页面的初始数据
     */
    data: {
    },
  
    // 获取用户信息
   async handleGetUserInfo(e){
    try {
      //  获取用户信息
    const {encryptedData,rawData,iv,signature}=e.detail
    // 获取小程序登录成功后的code值
    const {code}=await login()
    // 封装一些参数
    const loginParams ={encryptedData,rawData,iv,signature,code}
    //  发送请求  获取用户的token(由于没有气耶账号，所以就只能设置以恶个token值)
    wx.setStorageSync("token", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
    wx.navigateTo({
        url: page,
        success: function(res) {},
      })
    } catch (error) {
      console.log(error)
    }
    
  
  
    }
  })
