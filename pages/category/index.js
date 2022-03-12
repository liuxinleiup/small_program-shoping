import{request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**  
     * 页面的初始数据
     */
    data: {
        //左侧的菜单数据
        leftMenuList:[],
        //右侧的商品数据
        rightContent:[],
        //被点击的左侧菜单
        currentIndex:0,
        //右侧内容的滚动条距离顶部的距离
        scrollTop:0
    },
    //接口的返回数据
    Cates:[],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //1.先判断本地存储中有没有旧的数据 {time:Date.now(),data:[...]}
            //1.1获取本地存储中的数据
            const Cates=wx-wx.getStorageSync('cates');
            //1.2进行判断
            if(!Cates){
                //不存在    发送请求获取数据
                this.getCates();
            }else{
                //有旧的数据 定义一个过期时间 10s
                if(Date.now()-Cates.time>1000*10){
                    //超过10s要重新发送请求
                    this.getCates();
                }else{
                    //可以使用旧的数据
                    this.Cates=Cates.data;
                            //构造左侧的大菜单数据
                            let leftMenuList=this.Cates.map(v=>v.cat_name);   
                            //构造右侧的商品数据
                            let rightContent=this.Cates[0].children;
                            this.setData({
                                leftMenuList,
                                rightContent
                            })
                }
            }
        //2.没有旧的数据就直接发送新的请求

        //3.有旧的数据同时旧的数据也没有过期，就使用本地存储中的旧数据即可

        //this.getCates();
    },

   //获取分类数据 
  async getCates(){
        // request({url:"/categories"})
        // .then(res=>{
        //     this.Cates=res.data.message;

        //     //把接口的数据存入到本地存储中
        //     wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
        //     //构造左侧的大菜单数据
        //     let leftMenuList=this.Cates.map(v=>v.cat_name);    

        //     //构造右侧的商品数据
        //     let rightContent=this.Cates[0].children;

        //     this.setData({
        //         leftMenuList,
        //         rightContent
        //     })
        // })

        //1.使用ex7的async await来发送请求
        const res=await request({url:"/categories"})
        // this.Cates=res.data.message;
        this.Cates=res;
        //把接口的数据存入到本地存储中
        wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
        //构造左侧的大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);    
        //构造右侧的商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
   },

   //左侧菜单的点击事件
   handleItemTap(e){
         // 1.获取被点击的标记身上的索引    
            const {index}=e.currentTarget.dataset;
            //3.根据不同的索引渲染右侧的商品内容
            let rightContent=this.Cates[index].children;
        //2.给data中的currentIndex赋值就可以了
            this.setData({
            currentIndex:index,
            rightContent,
             //重新设置右侧内容的scroll-view标签的距离顶部的距离
            scrollTop:0
    })

       
   }
       
   
})