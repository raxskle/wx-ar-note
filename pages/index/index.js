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

const questionText = `- 扫描线下海报中央枫叶图案，让AR纸条浮现吧！
- 当纸条重叠时，可以拖动来查看内容。没显示AR纸条？试试前后移动手机位置。
- 只有通过线下海报才能留言。我们在纸条广场中的每个地点都放置了海报，想解锁不同地点？前往寻找线下海报吧。
- 如果页面无法正常显示，请更新微信版本，或加入反馈群 578246140。
- 玩得开心！趁毕业前再在学校多走走 :D`;

const positionMap = new Map([
    ["东九教学楼", "东九"],
    ["西十二教学楼", "西十二"],
    ["工训中心", "工训中心"],
    ["中操", "中操"],
    ["西操", "西操"],
    ["东操", "东操"],
    ["东图书馆", "东图"],
    ["主图书馆", "主图"],
    ["光谷体育馆", "光体"],
    ["东边cbd", "cbd"],
    ["韵苑学生食堂", "韵酒"],
    ["喻园食堂", "喻园"],
    ["东一食堂", "东一"],
    ["百景园", "百景园"],
    ["西一食堂", "西一"],
    ["西二食堂", "西二"],
    ["韵苑宿舍", "韵苑"],
    ["沁苑5栋宿舍", "沁苑"],
    ["东区宿舍", "东区宿舍"],
    ["西区宿舍", "西区宿舍"],
    ["紫菘宿舍", "紫菘"],
    ["网安校区", "网安"],
    ["同济校区", "同济"],
]);

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
        modalText: questionText,
        isShowModal: false,
        positionName: "",
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
            positionName: positionMap.get(e.position)
                ? positionMap.get(e.position)
                : e.position,
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
    questionHandler(e) {
        this.setData({ isShowModal: true });
    },
    hideModal(e) {
        this.setData({ isShowModal: false });
    },
    positionHandler(e) {
        wx.navigateTo({
            url: "../squareAll/squareAll",
        });
    },
    methods: {
        getPostList: function (that) {
            console.log(that.data);
            let instance = new Promise((resolve, reject) => {
                let token = wx.getStorageSync("token");
                wx.request({
                    url: `${url}/post?location_name=${that.data.position}&limit=15&is_include_recent_post=true`,
                    method: "GET",
                    header: {
                        Authorization: `Bearer ${token}`,
                    },
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
