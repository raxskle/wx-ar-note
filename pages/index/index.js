// index.js
// 获取应用实例
const app = getApp();

const url = "https://ar-note.hust.online/api/v1";

const color = [
  "rgb(214, 141, 186)",
  "rgb(238, 184, 110)",
  "rgb(120, 196, 150)",
  "rgb(115, 172, 202)",
  "rgb(189, 152, 221)",
  "rgb(255, 255, 255)",
];

Page({
  data: {
    width: 300,
    height: 300,
    renderWidth: 300,
    renderHeight: 300,
    postList: [],
    textureList: [],
    isShowAR: false,
    isShowSendBtn: false,
    position: "东九",
  },
  onLoad(e) {
    if (e.position) {
      this.setData({ position: e.position });
    }

    const info = wx.getSystemInfoSync();
    const width = info.windowWidth;
    const height = info.windowHeight;
    const dpi = info.pixelRatio;
    this.setData({
      width,
      height,
      renderWidth: width * dpi,
      renderHeight: height * dpi,
    });
  },
  onReady() {
    let that = this;
    let promiseList = [];
    this.methods.getPostList(that).then((res) => {
      res.map((item, index) => {
        promiseList.push(this.methods.createText(item, index));
      });
      Promise.all(promiseList).then((res) => {
        console.log(res);
        this.setData({ textureList: res });
        this.setData({ isShowAR: true });
      });
    });

    setInterval(() => {
      const arChild = this.selectComponent("#main-frame");
      if (arChild.data.tracked) {
        this.setData({ isShowSendBtn: true });
      }
    }, 500);
  },
  onARTrack(e) {
    console.log(e.detail);
    console.log(1);
    this.setData({ isShowSendBtn: true });
  },
  sendHandler(e) {
    wx.navigateTo({
      url: "../write/write" 
    });
  },
  methods: {
    getPostList: function (that) {
      let instance = new Promise((resolve, reject) => {
        wx.request({
          url: `${url}/post`,
          method: "GET",
          success: (res) => {
            console.log(res);
            that.setData({ postList: res.data.data.post_list });
            resolve(res.data.data.post_list);
          },
        });

        // let postList = [];
        // for (let i = 0; i < 10; i++)
        //   postList.push({
        //     content: "HelloWorld 这是什么这是什么",
        //     user_name: "ligen131",
        //   });
        // resolve(postList);
      });
      return instance;
    },
    createText: function (item, index) {
      let instance = new Promise((resolve, reject) => {
        wx.createSelectorQuery()
          .select("#canvas" + index)
          .fields({ node: true, size: true })
          .exec((res) => {
            console.log(res);
            const canvas = res[0].node;
            const ctx = canvas.getContext("2d");
            const dpr = wx.getWindowInfo().pixelRatio;
            let width = 150;
            let height = 150;
            canvas.width = width * dpr * 2;
            canvas.height = height * dpr * 2;
            ctx.scale(dpr * 2, dpr * 2);
            ctx.font = "8px";
            ctx.fillStyle = color[Math.floor(Math.random() * 6)];
            ctx.fillRect(0, 0, 150, 150);

            ctx.fillStyle = "rgb(0,0,0)";
            let maxWidth = 100;
            let line = 0;
            let str = "";
            let text = item.content;
            for (let i = 0; i < text.length; i++) {
              str += text.charAt(i);
              if (ctx.measureText(str).width > maxWidth) {
                ctx.fillText(
                  str.substring(0, str.length - 1),
                  42,
                  50 + line * 10
                );
                str = "";
                i--;
                line++;
              }
            }
            ctx.fillText(str, 42, 50 + line * 10);
            ctx.font = "6px";
            let userWidth = ctx.measureText(item.user_name).width;
            ctx.fillText(
              item.user_name,
              42 + maxWidth - userWidth,
              50 + line * 10 + 30
            );

            wx.canvasToTempFilePath({
              canvas,
              success: (res) => {
                const tempFilePath = res.tempFilePath;
                resolve(tempFilePath);
              },
            });
          });
      });
      return instance;
    },
  },
});
