
// pages/squareAll/squareAll.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        blockColors: {
            东九教学楼: "unvisitedColor",
            韵苑宿舍: "unvisitedColor",
            东边操场: "unvisitedColor",
            东边cbd: "unvisitedColor",
            工训中心: "unvisitedColor",
            东图书馆: "unvisitedColor",
            韵苑食堂: "unvisitedColor",
            喻园食堂: "unvisitedColor",
            主图书馆: "unvisitedColor",
            东区宿舍: "unvisitedColor",
            东一食堂: "unvisitedColor",
            中间操场: "unvisitedColor",
            光谷体育馆: "unvisitedColor",
            沁苑宿舍: "unvisitedColor",
            西一食堂: "unvisitedColor",
            西二食堂: "unvisitedColor",
            百景园: "unvisitedColor",
            西边操场: "unvisitedColor",
            紫菘宿舍: "unvisitedColor",
            西区宿舍: "unvisitedColor",
            青年园: "unvisitedColor",
            西十二教学楼: "unvisitedColor",
            同济校区: "unvisitedColor",
            网安校区: "unvisitedColor",
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    // 请求已访问地点的数据
    onLoad() {
        let token = wx.getStorageSync("token");
        let openid = wx.getStorageSync("openid");

        wx.request({
            url: "https://ar-note.hust.online/api/v1" + "/location/list",
            method: "GET",
            header: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                openid: openid,
            },
            success: (response) => {
                console.log("get location list success", response.data);

                let reslist = response.data.data.scanned_location_list;

                // 渲染已访问方块颜色
                console.log("get list :", reslist);
                //     reslist = [{
                //         location_name: "东九教学楼"
                //     },{
                //         location_name: "韵苑宿舍"
                //     }
                // ]

                reslist.forEach((item) => {
                    let name = item.location_name;
                    console.log("item.location_name", name);
                    let _blockColors = this.data.blockColors;
                    _blockColors[name] = "visitedColor";
                    this.setData({ blockColors: _blockColors });
                });

                console.log(this.data.blockColors);
            },
            fail: (err) => {
                console.log(err);
            },
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
    handle(e) {
        const location = e.target.dataset.loc
        if (location) {
            // console.log(e.target)
            console.log("into detail ", location);
            // 根据id 进入square具体参数
            wx.navigateTo({
                url:
                    "../squareDetail/squareDetail" +
                    "?" +
                    "location=" +
                    location,
            });
        }
    },
    handleClickBlock(e) {
        this.handle(e);
    },

    method: {},
});
