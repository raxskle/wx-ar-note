function randomPosition() {
    const paperX = 0.75,
        paperZ = 0.75;
    let paperCount = 16;
    let position = [];
    for (let i = 0; i < paperCount; i++) {
        let x, y, z;
        let ok = false;
        while (!ok) {
            ok = true;
            x = Math.random() * 4 - 2;
            y = Math.random() * 1;
            z = Math.random() * 4 - 2;
            for (let j = 0; j < i; j++) {
                if (
                    Math.abs(x - position[j].x) < paperX &&
                    Math.abs(z - position[j].z) < paperZ
                ) {
                    ok = false;
                }
            }
        }
        position.push({ x, y, z });
    }
    let positionList = [];
    position.map((item, index) => {
        positionList.push(`${item.x} ${item.y} ${item.z}`);
    });
    return positionList;
}

Component({
    properties: {
        textureList: {
            type: Array,
            value: [],
        },
    },
    data: {
        loaded: false,
        scene: undefined,
        positionList: [
            "0 0 0",
            "1 0.25 0.5",
            "-0.75 1 -0.25",
            "0.5 0.5 -1",
            "-1.5 0.4 0.8",
            "-1.2 0.1 -0.2",
            "1.8 0.6 0.3",
            "1.4 1.5 -0.4",
            "-0.2 1.2 0.3",
            "-0.4 0.4 -0.8",
        ],
        nodeList: [],
        tracked: false,
    },
    ready() {
        randomPosition();
        this.setData({ nodeList: this.data.textureList });
        let positionList = randomPosition();
        this.setData({ positionList });
    },
    methods: {
        handleReady: function ({ detail }) {
            this.setData({ scene: detail.value });
        },
        handleAssetsLoaded: function ({ detail }) {
            let assetList = [];
            this.data.textureList.map((item, index) => {
                assetList.push(
                    this.data.scene.assets.loadAsset({
                        type: "texture",
                        assetId: `paper${index}`,
                        src: item,
                    })
                );
            });
            Promise.all(assetList).then(() => {
                console.log("paper assets loaded");
                this.setData({ loaded: true });
            });
        },
        handleTrackerSwitch({ detail }) {
            console.log("track");
            this.setData({ tracked: true });
            this.triggerEvent("artrack", { isShow: true });
        },
        handleGLTFLoaded: function ({ detail }) {
            const el = detail.value.target;
            const gltf = el.getComponent("gltf");
            const newMat = this.data.scene.assets.getAsset(
                "texture",
                `paper${el.id.substring(9)}`
            );
            console.log(el.id.substring(9));
            console.log(newMat);
            for (const mesh of gltf.getPrimitivesByNodeName("paper")) {
                mesh.material.setTexture("u_baseColorMap", newMat);
            }
        },
        handleTouchModel: function ({ detail }) {
            const el = detail.value.target;
            console.log(el);
            console.log(this.data.scene.getNodeById(`node${el.id[9]}`));
        },
        handleDragModel: function ({ detail }) {
            const el = detail.value.target;
            let node = this.data.scene.getNodeById(`node${el.id[9]}`);
            node.position.x += detail.value.deltaX / 500;
            node.position.z += detail.value.deltaY / 500;
        },
    },
});
