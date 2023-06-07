// pages/write/write.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid:"",
        locationName :"",
        messageValue :"",
        idValue :""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(data) {
		// // 从ar页 拿到locationName
		// if(data.location_name){
        //     this.setData({locationName:data.location_name});
		// }
		// console.log("write in location: ",data);
    },
	//  发送留言
	sendMessage(){
        if(!app.globalData.location){
            // 未扫码获取地点弹窗提示
            wx.showModal({
                title: '未扫码',
                content: '扫描对应地点的二维码后才可留言',
                showCancel: false,
                complete: (res) => {
                    if (res.cancel) {
                    
                    }
                
                    if (res.confirm) {
                    
                    }
                }
                })
        }else{
            // 已扫码
            // 需要 openid(storage拿到) locationName (onload拿到)
            //      content(messageValue) id(idValue)
            if(this.data.messageValue.trim()!="" && this.data.idValue.trim()!="" && this.data.messageValue.trim().length<=150){
                // send here
                let token = wx.getStorageSync("token");
                let openid = wx.getStorageSync("openid");
                
                console.log("post msg in ", this.data.messageValue, this.data.idValue);
                console.log("openid", openid);
                wx.request({
                    url: "https://ar-note.hust.online/api/v1" + "/post",
                    method:"POST",
                    header:{
                        "Authorization": `Bearer ${token}`,
                    },
                    data:{
                    "openid": openid,
                    "location_name": app.globalData.location,
                    "user_name": this.data.idValue,
                    "content": this.data.messageValue
                    },
                    success:(res)=>{
                        console.log("post msg success",res.data);
                        // 弹窗提示发言成功
                        wx.showToast({
                          title: '留言成功',
                        })
                        // 返回ar页
                        setTimeout(()=>{
                            wx.navigateBack();	
                        },500)
                        				
                    },
                    fail: (err) => {
                        console.log("post msg fail",err);
                        // 弹窗提示发言失败
                        wx.showToast({
                            title: '留言失败',
                            icon: "error"
                        })
                    }
                })
                

            }else if(this.data.messageValue.trim()=="" && this.data.idValue.trim()==""){
                wx.showToast({
                    title: '请输入',
                    icon: "error"
                })
            }else if(this.data.idValue.trim()==""){
                wx.showToast({
                    title: '请输入昵称',
                    icon: "error"
                })
            }else if(this.data.messageValue.trim()==""){
                wx.showToast({
                    title: '请输入留言',
                    icon: "error"
                })
            }
        }

    },
    onChangeMessageValue(e){
        console.log(e.detail.value)
        this.setData({
            messageValue : e.detail.value, // 将输入框的内容赋值给绑定的属性
        })
    },
    onChangeIdValue(e){
        console.log(e.detail.value)
        this.setData({
            idValue : e.detail.value, // 将输入框的内容赋值给绑定的属性
        })
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