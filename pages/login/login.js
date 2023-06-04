// pages/login/login.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginBtn:"点击登录",
    },
    methods:{
    },        	
    // 将从后端拿到的 openid 和 token 本地存储
    saveTokenAndOpenid(token, openid){
        wx.setStorage({key: 'token',data: token});
        wx.setStorage({key: 'openid',data: openid});
    },
    sendCodeToBackend(code){
        // 携带code发送请求，得到 openid 和 token 并本地存储
        let token ;
        let openid ;

        wx.request({
            url: "https://ar-note.hust.online/api/v1" + "/user/login",
            data: {
                code: code
            },
            method: "POST",
            success:(response)=>{
                console.log("send code success",response.data);
                token = response.data.data.token;
                openid = response.data.data.openid;
                console.log("get token and openid",token,openid);
                
                // // test拿到数据
                // token = 'fake_token';
                // openid = 'fake_wx_openid';
                // // 
                
                // 持久化储存
                if(token && openid){
                    this.saveTokenAndOpenid(token, openid);	
                                
                    // todo 跳转首页
                    wx.redirectTo({
                        url:"../home/home"
                    });										
                }
        
            },
            fail: (err) => {
                console.log("send code fail",err);
            }
        })
    },
    getWeixinLoginCode(){
        let code = null;
        let that = this;
        wx.login({
            success (res) {
            if (res.code) {
                console.log('得到code：' + res.code);
                code = res.code;
                that.sendCodeToBackend(code);	
            } else {
                console.log('无code ' + res.errMsg);
            }
            },
            fail(err){
                console.log('获取code失败 ' + err);
            }
        })
        return code;
    },
    onWeixinLogin(){
        console.log("tap login")
        this.getWeixinLoginCode();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(query) {
        wx.getStorage({

            key:'token',
            success: function (res){
                console.log("get token from storage success",res);
                
                wx.getStorage({
                    key:'openid',
                    success: function (res){
                        console.log("get token and openid from storage success",res);
                        
                        wx.redirectTo({
                            url:"../home/home"
                        });					
                        
                    },
                    fail: function(err){
                        console.log("err on storage getting openid", err);
                    }
                })
                
            },
            fail: function(err){
                console.log("err on storage getting token", err);
            }
        })
        
        // 获取地点信息
        const q = decodeURIComponent(query.q) // 获取到二维码原始链接内容
        // const scancode_time = parseInt(query.scancode_time) // 获取用户扫码时间 UNIX 时间戳
        let obj = this.GetWxMiniProgramUrlParam(q);
        let location = obj.location;
        console.log(location);
        
    },
    GetWxMiniProgramUrlParam (url) {
        let theRequest = {};
        if(url.indexOf("#") != -1){
            const str=url.split("#")[1];
            const strs=str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }else if(url.indexOf("?") != -1){
            const str=url.split("?")[1];
            const strs=str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
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