import{request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs:[
            {
            id:0,
            value:"综合",
            isActive:true
            }, 
            {
                id:1,
                value:"销量",
                isActive:false
            }, 
            {
                id:2,
                value:"价格",
                isActive:false
            }
    ],
    goodsList:[]
    },

    //接口要的参数
    QueryParams:{
        query:"",
        cid:"",
        pagenum:1,
        pagesize:10
    },

    //总页数
    totalPages:1,

    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.QueryParams.cid=options.cid||"";
        this.QueryParams.query=options.query||"";
        this.getGoodsList();

        wx.showLoading({
            title: '加载中',
          })
          
        setTimeout(function () {
        wx.hideLoading()
        }, 2000)
    },

    //获取v商品列表的数据
    async getGoodsList(){
        const res=await request({url:"/goods/search",data:this.QueryParams})
        //总条数
        const total=res.total;
        //计算总页数
        this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
        this.setData({
            //拼接了数组
            goodsList:[...this.data.goodsList,...res.goods]
        })
        //关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错的
        wx.stopPullDownRefresh();
    },

    //标题的点击事件 从子组件传递过来的
    handleTabsItemChange(e){
        //1.获取被点击的标题索引
        const {index}=e.detail;
        //2.修改原数组
        let {tabs}=this.data;
        tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
        //3.赋值到data中
        this.setData({
            tabs
        })
    },

    //页面上滑 滚动条触底事件
    // 用户上滑页面 滚动条触底 开始加载下一页数据
    // 1找到滚动条触底事件
    onReachBottom(){
        // 2判断还也没有下一页数据 微信小程序官方开发文档寻找 获取到总页数、获取当前页码  判断是否大于等于总页数
        if(this.QueryParams.pagenum>=this.totalPages){
            // 3假如没有下一页数据 就弹出一个提示框
            //没有下一页
            wx.showToast({
              title: '宝，没有了哟',
            })
        }else{
            // 4假如还有下一页数据 就加载下一页数据 当前页码++ 重新发送请求 数据请求回来对data中的数组进行拼接，而不是全部替换
            //还有下一页
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }
    },

    // 下拉刷新页面
    //1触发下拉刷新事件 需要在页面的json文件中开启一个配置项
        onPullDownRefresh(){
            //2重置 数据 数组
            this.setData({
                goodsList:[]
            })
            //3重置页码 设置为1
            this.QueryParams.pagenum=1;
            //4重新发送请求 
            this.getGoodsList();    
            //5数据请求回来了 需要手动的关闭 等待效果
        }
})
