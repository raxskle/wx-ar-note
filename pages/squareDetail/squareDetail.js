// pages/squareDetail/squareDetail.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageList:[],
        locationName :"",
        hasMore:false,
        bottomTips:"暂无更多留言",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(data) {
        console.log("into square detail",data);
        this.setData({locationName:data.location});
		this.getMessageByLocation(this.data.locationName);
    },
    formatDateTime(timestamp) {
		let date = new Date(timestamp);
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		let minute = date.getMinutes();
		minute = minute < 10 ? ('0' + minute) : minute;
		return y + '/' + m + '/' + d+' '+h+':'+minute;
    },
    getMessageByLocation(locationName){
		//  发送请求，获取该地点的信息
		let token = wx.getStorageSync("token");
		let openid = wx.getStorageSync("openid");
        
        this.setData({bottomTips:"留言加载中..."});

		console.log("send:",this.data.locationName);
        
        // 加载自己的留言
		wx.request({
			url: "https://ar-note.hust.online/api/v1" + "/post",
			method: "GET",
			header:{
				"Authorization": `Bearer ${token}`,
			},
			data:{
			  "openid": openid,
			  "location_name": this.data.locationName,
			  "limit":50,
			  "order_by": "time",
			  "is_include_recent_post": true
			},
			success:(res)=>{
				console.log("get square detail success",res.data);
				let resList = res.data.data.post_list;
					
				console.log("given user msg resList",resList);
				
				// if(resList.length < 20){
                //     this.setData({hasMore:false})
				// }else{
				// 	this.setData({hasMore:true})
				// }

                let _messageList = this.data.messageList;
				resList.forEach((msg)=>{
					console.log(msg);
					let msTime = msg.time < 1684000000000 ? msg.time*1000 : msg.time;
                    msg.time = this.formatDateTime(msTime);
                    
					_messageList.push(msg);
                })
                this.setData({messageList:_messageList});
                
                // 获取其他人的留言
                this.loadOtherUsersMsg(token, openid);

				this.setData({bottomTips:"暂无更多留言"})
			},
			fail:(err)=>{
				console.log("get square detail fail",err);
				this.setData({bottomTips:"暂无更多留言"})
			}
        })
        
    },
    loadOtherUsersMsg(token, openid){
        // 除自己外所有用户留言
		wx.request({
			url: "https://ar-note.hust.online/api/v1" + "/post",
			method: "GET",
			header:{
				"Authorization": `Bearer ${token}`,
			},
			data:{
			  "location_name": this.data.locationName,
			  "limit":20,
			  "order_by": "random",
			  "is_include_recent_post": false
			},
			success:(res)=>{
				console.log("get square detail success",res.data);
				let resList = res.data.data.post_list;
					
				// 如果大于20条，滑动到底可以再次请求
				console.log("not given user msg resList",resList);
				
				if(resList.length < 20){
                    this.setData({hasMore:false})
				}else{
					this.setData({hasMore:true})
				}

                let _messageList = this.data.messageList;
				resList.forEach((msg)=>{
                    // 排除自己的留言
                    if(msg.openid != openid){
                        console.log(msg);
                        let msTime = msg.time < 1684000000000 ? msg.time*1000 : msg.time;
                        msg.time = this.formatDateTime(msTime);
                        
                        _messageList.push(msg);
                    }
                })
                this.setData({messageList:_messageList});
				
			},
			fail:(err)=>{
                console.log("get square detail fail",err);
			}
		})
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
		console.log("reach bottom");
		if(this.data.hasMore){
            let token = wx.getStorageSync("token");
            let openid = wx.getStorageSync("openid");
            console.log("reach bottom has more")
            // 获取其他人的留言
            this.loadOtherUsersMsg(token, openid);	
		}
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})