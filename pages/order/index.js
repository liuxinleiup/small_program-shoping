// pages/order/index.js

import{request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders:[],
        tabs:[
            {
            id:0,
            value:"全部",
            isActive:true
            }, 
            {
                id:1,
                value:"待付款",
                isActive:false
            }, 
            {
                id:2,
                value:"待发货",
                isActive:false
            }, 
            {
                id:3,
                value:"退款/退货",
                isActive:false
            }
    ]
    },


    // 当页面被打开的时候
    // 1获取url上的参数type
    onShow(options){
        const token=wx.getStorageSync('token');
        if(!token){
            wx.navigateTo({
              url: '/pages/auth/index'
            })
            return;
        }

        //获取当前小程序的页面栈
        let pages=getCurrentPages();
        //数组中 索引最大的页面就是当前页面
        let currentPages=pages[pages.length-1];
        //获取url上的type参数
        const {type}=currentPages.options;
        //激活选中页面标题
        this.changeTitleByIndex(type-1);
        this.getOrders(type);
    },
    //获取订单列表的方法
    async getOrders(type){
        const res=await request({url:"/my/orders/all",data:{type}});
 
    },
    // 2根据type去发送请求获取对应的订单数据
    // 3渲染页面
    // 点击不同的标题的时候 重新发送请求来获取和渲染数据

        //根据标题索引来激活选中 标题数组
        changeTitleByIndex(index){
            //2.修改原数组
            let {tabs}=this.data;
            tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
            //3.赋值到data中
            this.setData({
                tabs
            })
        },
        handleTabsItemChange(e){
            //1.获取被点击的标题索引
            const {index}=e.detail;
            this.changeTitleByIndex(index);
            //2重新发送请求
            this.getOrders(index+1);
        }
})