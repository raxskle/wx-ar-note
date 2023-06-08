// pages/home/home.js

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        toARBtn : "扫码留言",
        toSquareBtn : "纸条广场",
        location: ""
    },
    toARPage(){
        // const toARPageParam = app.globalData.location ? app.globalData.location : "";
        // wx.navigateTo({
        //     url:"../index/index" + "?" + "position=" + toARPageParam
        // })
        const toARPageParam = app.globalData.location ? app.globalData.location : "";
        wx.redirectTo({
          url: "../index/index" + "?" + "position=" + toARPageParam,
        })
    },
    toSquareAll(){
        wx.navigateTo({
            url:"../squareAll/squareAll" 
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(!app.globalData.location){
            // wx.showModal({
            //     title: '未扫码',
            //     content: '请通过扫描二维码进入小程序',
            //     showCancel: false,
            //     complete: (res) => {
            //         if (res.cancel) {
                    
            //         }
                
            //         if (res.confirm) {
                    
            //         }
            //     }
            //     })
        }else{
            // 已获取地点信息 发送地点标记请求
            this.setData({location:app.globalData.location});
            console.log( app.globalData.location);   
            let token = wx.getStorageSync("token");
            let openid = wx.getStorageSync("openid");

            wx.request({
                url: "https://ar-note.hust.online/api/v1" + "/location/scan",
                method:"POST",
                header:{
                    "Authorization": `Bearer ${token}`,
                },
                data:{
                "openid": openid,
                "location_name": app.globalData.location,
                },
                success:(res)=>{
                    console.log("post scan success",res.data);			
                },
                fail: (err) => {
                    console.log("post scan fail",err);
                }
            })

        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})