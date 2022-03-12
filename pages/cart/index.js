// pages/cart/index.js

import{getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
    // 页面加载完毕
    //onLoad onShow
    data:{
        address:{},
        cart:[],
        allChecked:false,
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
            const cart=wx.getStorageSync('cart')||[];
         this.setData({address});   
         this.setCart(cart);
    },


    // 点击收获地址
    async handleChooseAddress(){
        try{
            //1获取权限状态
            const res1=await getSetting();
            const scopeAddress=res1.authSetting["scope.address"];    
            //2判断权限状态
            if(scopeAddress===false){
                //4诱导用户打开授权页面
                await openSetting();
            }
            //5调用获取收获地址的api 
            let address=await chooseAddress();
            //6存入到缓存中
            wx.setStorageSync('address', address)
    }catch(error){
        console.log(error);
         }   
    },


    // 商品的选中
    handeItemChange(e){
    // 1绑定change事件
    // 2获取到被修改的商品对象
    const goods_id=e.currentTarget.dataset.id;
        //获取购物车数组
        let {cart}=this.data;
        //找到被修改的商品对象
        let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 3商品对象的选中状态 取反
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
    },

    //设置购物车状态同时重新计算底部工具栏的数据 全选 总价格 购买的数量
    setCart(cart){
        // 5重新计算全选 总价格 总数量
        let allChecked=true;
        let totalPrice=0;
        let totalNum=0;
        cart.forEach(v=> {
            if(v.checked){
                totalPrice +=v.num*v.goods_price;
                totalNum +=v.num;
            }else{
                allChecked=false;
            }
        })
        allChecked=cart.length!=0?allChecked:false;
        this.setData({
            cart,
            totalPrice,totalNum,allChecked
        });
        // 4重新填充回data中和缓存中
        wx.setStorageSync('cart', cart)
    },
    // 商品全选和反选
    // 1全选复选框绑定事件 change
    // 2获取data中的全选变量 allChecked
    handleItemAllCheck(){
        let{cart,allChecked}=this.data;
        // 3直接取反 allChecked=!allChecked
        //修改值
        allChecked=!allChecked;
        // 4遍历购物车数组 让里面商品选中状态跟随着 allChecked改变而改变
        //循环修改cart数组中的商品选中状态
        cart.forEach(v=>v.checked=allChecked);      
        // 5把购物车数组和 allChecked重新设置为回daa中 把购物车重新设置回缓存中   
        //把修改后的值填充回data或者缓存中                                               
        this.setCart(cart);
    },
    
    // 商品数量的编辑功能
    // 1给+ -按钮绑定同一个点击事件 区分的关键 自定义属性
    // 2传递被点击的商品id goods_id       
    async handleItemNumEdit(e){
        const {operation,id}=e.currentTarget.dataset;
     // 3获取data中的购物车数组 来获取需要被修改的商品对象
     let {cart}=this.data;
    // 4直接修改商品对象的数量num
    const index=cart.findIndex(v=>v.goods_id===id);
     //当购物车的数量等于1 同时用户点击的是-的按钮 弹窗提示询问用户是否删除
     if(cart[index].num===1&&operation===-1){
          const res=await showModal({content:"亲，是否删除宝贝？"});
          if (res.confirm) {
            cart.splice(index,1);
            this.setCart(cart);
          } 
     }else{
        cart[index].num+=operation;
        // 5把cart数组 重新设置回 缓存中 和data中 this.setCart
        this.setCart(cart);
     }
    },

    // 点击结算
    async handlePay(){
    const {address, totalNum}=this.data;   
    // 1先判断也没有收获地址信息 
    if(!address.userName){
        await showToast({title:"还没有地址哟"});
        return;
     }
    // 2判断用户也没有选购商品   
     if(totalNum===0){
        await showToast({title:"还没有选宝贝哟"});
        return;
     }
     // 3经过以上的验证 跳转到支付页面
     wx.navigateTo({
       url: '/pages/pay/index'
     })
    }
    
   
})    


