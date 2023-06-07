// pages/share/share.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    backToAR(){
        const toARPageParam = app.globalData.location ? app.globalData.location : "";
        wx.navigateTo({
            url:"../index/index" + "?" + "position=" + toARPageParam
        })
    },
    onTapShare(){
        // 做埋点
        let token = wx.getStorageSync("token");
        let openid = wx.getStorageSync("openid");
        wx.request({
            url: "https://ar-note.hust.online/api/v1" + "/share",
            method:"POST",
            header:{
                "Authorization": `Bearer ${token}`,
            },
            data:{
            "openid": openid,
            "location_name": app.globalData.location,
            },
            success:(res)=>{
                console.log("post share success",res.data);
            },
            fail: (err) => {
                console.log("post share fail",err);
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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