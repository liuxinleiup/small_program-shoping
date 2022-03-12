// pages/cart/index.js
// 页面加载的时候
// 1从缓存中获取购物车数据 渲染到页面中 checked=ture
import{getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js"

Page({
    // 页面加载完毕
    //onLoad onShow
    data:{
        address:{},
        cart:[],
        totalPrice:0,
        totalNum:0
    },
    onShow(){
    // 1获取本地存储中的地址数据
        const address=wx.getStorageSync('address');
        // onShow
        // 0回到商品详情页面 第一次添加商品的时候 手动的添加了属性
        //     num=1 checked=true
        // 1获取缓存中的购物车数组
            let cart=wx.getStorageSync('cart')||[];
        //过滤后的购物车数组
        cart=cart.filter(v=>v.checked);
         this.setData({address});   

         // 5重新计算全选 总价格 总数量
        let totalPrice=0;
        let totalNum=0;
        cart.forEach(v=> {
                totalPrice +=v.num*v.goods_price;
                totalNum +=v.num;
        })
        this.setData({
            cart,
            totalPrice,totalNum,address
        });
    },


    // 支付按钮
    async handleOrderPay(){
        try {
            // 1先判断缓存中有没有token
            const token=wx.getStorageSync('token');
            // 2没有 跳转到授权页面 进行获取token
            if(!token){
                wx.navigateTo({
                url: '/pages/auth/index',
                });
                return;
            }
            // 3创建订单 
            //3.1准备请求头参数
            const header={Authorization:token};
            //3.2准备请求体参数
            const order_price=this.data.totalPrice;
            const oconsignee_addr=this.data.address.all;
            const cart=this.data.cart;
            let goods=[];
            cart.forEach(v=>goods.push({
                goods_id:v.goods_id,
                goods_number:v.num,
                goods_price:v.goods_price
            }))
            const orderParams={order_price,oconsignee_addr,goods};
            //4准备发送请求 创建订单获取订单编号
            const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams,header});
            //5发起预支付的接口
            const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",header,data:{order_number}});
            //6发起微信支付
            await requestPayment(pay);
            //7查询后台 订单状态
            const res=await request({url:"/my/orders/chkOrder",method:"POST",header,data:{order_number}});
            await showToast({title:"支付成功"})
            //手动删除已经缓存支付了的商品
            let newCart=wx.getStorageSync('cart');
            newCart=newCart.filter(v=>!v.checked);
            wx.setStorageSync('cart', newCart);
            //8 跳转到订单页面
            wx.navigateTo({
              url: '/pages/order/index',
            })
        } catch (error) {
            await showToast({title:"支付失败"})
            console.log(error);
        }

    }
})    

