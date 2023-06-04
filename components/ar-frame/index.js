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
    positionList: ["0 0 0", "1 0.25 0.5", "-0.75 1 -0.25", "0.5 0.5 -1"],
    nodeList: [],
    tracked: false,
  },
  ready() {
    console.log(this.data.textureList[0]);
    this.setData({ nodeList: this.data.textureList });
  },
  methods: {
    handleReady: function ({ detail }) {
      this.setData({ scene: detail.value });
      // detail.value.createImage({
      //   type: "texture",
      //   assetId: "paper",
      //   src: this.data.textureList[0],
      // });

      console.log(1);
      console.log(this.data.scene);
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
  },
});
