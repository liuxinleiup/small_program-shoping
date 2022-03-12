import{request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

// 防抖 定时器 节流
//防抖 一般输入框中 防止重复输入发送请求
//节流  一般是用在页面的下拉和上拉
// 1定义全局的定时器id
Page({
    data:{
        goods:[],
        //取消 按钮 是否显示
        isFocus:false,
        //输入框的值
        inpValue:""
    },
    TimeId:-1,

    // 输入框绑定 值改变事件 input事件
    handleInput(e){
        // 1获取到输入框的值
        const {value}=e.detail;
        // 2合法性判断
        if(!value.trim() ){
            this.setData({
                goods:[],
                isFocus:false
            })
            return;
        }
        // 3检验通过了 把输入框的值 发送到后台
        this.setData({
            isFocus:true
        })
        clearTimeout(this.TimeId);
        this.TimeId=setTimeout(() => {
            this.qsearch(value);
        }, 1000);
        // 4返回的数据打印到页面上
    },

    //发送请求获取搜索建议的数据函数
    async qsearch(query){
        const res=await request({url: "/goods/qsearch",data:{query}});   
        console.log(res);
        var that = this
        that.setData({
            goods:res
        })
    },

    //点击取消按钮
    handleCancel(){
        this.setData({
            inpValue:"",
            isFocus:false,
            goods:[]
        })
    }
})