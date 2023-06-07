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

function compareVersion(v1, v2) {
    v1 = v1.split(".");
    v2 = v2.split(".");
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
        v1.push("0");
    }
    while (v2.length < len) {
        v2.push("0");
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i]);
        const num2 = parseInt(v2[i]);

        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }

    return 0;
}

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
        position: "",
    },
    onLoad(e) {
        if (e.position && e.position !== "undefined") {
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

        const version = wx.getAppBaseInfo().SDKVersion;

        if (compareVersion(version, "2.27.1") >= 0) {
            console.log("当前版本大于2.27.1");
        } else {
            console.log("当前版本过低");
            wx.showModal({
                title: "提示",
                content:
                    "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            });
        }
    },
    onReady() {
        let that = this;
        let promiseList = [];
        wx.getStorage({
            key: "used",
            fail: (res) => {
                console.log(res);
                wx.setStorage({
                    key: "used",
                    data: 1,
                });
                promiseList.push(
                    that.methods.createText(
                        {
                            content: "纸条可以被随意拖动哦！",
                            user_name: "",
                        },
                        16
                    )
                );
            },
        });
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
            url: "../write/write",
        });
    },
    shareHandler(e) {
        wx.navigateTo({
            url: "../share/share",
        });
    },
    methods: {
        getPostList: function (that) {
            console.log(that.data);
            let instance = new Promise((resolve, reject) => {
                wx.request({
                    url: `${url}/post?location_name=${that.data.position}&limit=15`,
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
