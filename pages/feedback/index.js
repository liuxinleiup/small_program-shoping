// pages/feedback/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
       tabs:[
            {
            id:0,
            value:"体验问题",
            isActive:true
            }, 
            {
                id:1,
                value:"商品、商家投诉",
                isActive:false
            }
        ],

        //被选中的图片路径数组
        chooseImage:[],
        //文本域的内容
        textVal:""
    },


    //外网的图片路径数组
    UpLoadImgs:[],



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

    //点击+号选择图片事件
    handleChooseImg(){
        //调用小程序内置的选择图片api
        wx.chooseImage({
                    count: 9,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success:(result) => {
                        this.setData({
                            chooseImgs:[{...this.data.chooseImgs,...result.tempFilePaths}]
                        })
                    }
            })
    },

      //点击 自定义图片组件
      handleRemoveImg(e){
        //获取被点击的组件索引
        const {index}=e.currentTarget.dataset;
        //获取data中的图片数组
        let {chooseImgs}=this.data; 
        //删除元素
        chooseImgs.splice(index,1);
        this.setData({
            chooseImgs
        })
    },

    // 点击“提交”
    // 1获取文本域的内容类似输入框的获取
    handleTextInput(e){
        this.setData({
            textVal:e.detail.value
        })
    },
        //  data中定义变量表示输入框内容 图片数组
        handleFormSubmit(){
            const {textVal,chooseImgs}=this.data;
            // 文本域绑定输入事件事件触发的时候把输入框的值存入到变量中

                // 2对这些内容合法性验证
            if(!textVal.trim()){
                //不合法
                wx.showToast({
                  title: '输入不合法',
                  icon:'none',
                  mask:true
                });
                return;
            }
            // 3验证通过用户选择的图片上传到专门的图片的服务器返回图片外网的链接
            //显示正在等待的图标
            wx.showLoading({
                title: '正在上传中',
                mask:true
              });

            //判断有没有需要上传的图片数组
            if(chooseImgs){
                if(chooseImgs.length != 0){
                    chooseImgs.forEach((v,i)=>{
                    wx.uploadFile({
                      url: 'https://img.coolcr.cn/api/upload',
                    //   url: 'http://my.zol.com.cn/index.php?c=Ajax_User&a=uploadImg',
                    //   url: 'https://imgchr.com/i/MjaXxU',
                      filePath: v,
                      name: 'file',
                      formData:{},
                      success:(result)=>{
                        //   console.log(result);
                          let url=JSON.parse(result.data).data.url;
                          this.UpLoadImgs.push(url);
                     // 4文本域和外网的图片的路径一起提交到服务器前端的模拟不会发送请求到后台。
                     if(i===chooseImgs.length-1){
                        wx.hideLoading();
                        console.log("把文本的内容和外网的图片数组 提交到后台中");
                    // 5清空当前页面
                        this.setData({
                            textVal:"",
                            chooseImgs:[]
                        })
                    // 6返回上一页
                        wx.navigateBack({
                            delta:1
                        });
                     }
                      },
                      fail: (err) => {}
                    });
                 })
        
                }else{
                    wx.hideLoading();
                    console.log("只是提交了文本");
                    // this.setData({
                    //     TextValue:""
                    // })
                    wx.navigateBack({
                        delta:1
                    })
                }
            }
        }
  
})