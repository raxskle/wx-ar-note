// app.js
App({
  onLaunch(e) {

    wx.loadFontFace({
        family: 'ffff',
        global: true,
        source: 'url("https://h5.hust.online/ar-note/map-font.ttf")',
        success: (data)=>{
            console.log("调用字体成功 ",data)
        },
        fail: function (e) {
            console.log('字体调用失败',e);
        },
      })
  },
  globalData: {
    userInfo: null,
    location: ""

  }
})
