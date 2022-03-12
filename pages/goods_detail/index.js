import{request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj:{},
        // 商品是否被收藏过
        isCollect:false
    },
    //商品对象
    GoodsInfo:{},

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        let pages=getCurrentPages();
        let currentPage=pages[pages.length-1];
        let options=currentPage.options;

        const {goods_id}=options;
        this.getGoodsDetail(goods_id);
    },

    // 发送请求获取数据
    async getGoodsDetail(goods_id){
        const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
        this.GoodsInfo=goodsObj;
            // 1页面onShow的时候 加载缓存中的商品收藏的数据
            let collect=wx.getStorageSync('collect')||[];
            // 2判断当前商品是不是被收藏了
            let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
        this.setData({
            goodsObj:{
                goods_name:goodsObj.goods_name,
                goods_price:goodsObj.goods_price,
                goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
                pics:goodsObj.pics
            },
            isCollect
        })
    },

    //点击轮播图放大预览
    handlePrevewImage(e){
        //1 先构造要预览的图片数组
        const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
        //2 接收传递过来的图片url
        const current=e.currentTarget.dataset.url;
        wx.previewImage({
          current,
          urls
        })
    },

    // 点击加入购物车
    handleCartAdd(){
    //1先绑定点击事件
        
    //2获取缓存中的购物车数据 数组格式
        let cart=wx.getStorageSync('cart')||[];
    //3先判断当前的商品是否已经存在于购物车
        let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
        if(index===-1){
        //5不存在于购物车数组中 直接给购物车数组添加一个新的元素 带上购买数量属性 重新把购物车数组填充回缓存中
            this.GoodsInfo.num=1;
            this.GoodsInfo.checked=true;
            cart.push(this.GoodsInfo);
        }else{
        //4已经存在了 修改商品数据 执行g'w'c数量++ 重新把购物车数组填充回缓存中
            cart[index].num++;
        }
    //6购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    //7弹出提示
    wx.showToast({
      title: '加入成功',
      icon:'success',
      mask:true
    })    
    },
    

        // 商品收藏
        // 3点击商品收藏按钮
        handleCollect(){
        let isCollect=false;
        //     判断该商品是不是存在于缓存数组中
        let collect=wx.getStorageSync("collect")||[];
        //     已经存在 把该商品删除掉
        let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
        //     没有存在过 添加到收藏数组中 也存入缓存中 
        if(index!==-1){
            collect.splice(index,1);
            isCollect=false;
            wx.showToast({
              title: '取消成功',
              icon:"success",
              mask:true
            });
        }else{
            collect.push(this.GoodsInfo);
            isCollect=true;
            wx.showToast({
                title: '收藏成功',
                icon:"success",
                mask:true
              });
        }
        //把数组存入缓存中
        wx.setStorageSync('collect', collect);
        //修改data中的属性
        this.setData({
            isCollect
        })
        }

})