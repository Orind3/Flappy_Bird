const BackSky = cc.Sprite.extend({
    active: true,
    zOrder: 11,
    ctor: function () {
        this._super(res.bgImage);
        this.scale = 2.5;
        this.anchorX = 0;
        this.anchorY = 0;
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

BackSky.create = function () {
    const backGround = new BackSky();
    g_sharedGameLayer.addChild(backGround,-10);
    FlippyBird.CONTAINER.BACKSKYS.push(backGround);
    return backGround;
};

BackSky.getOrCreate = function () {
    let selChild = null;
    for(let i = 0; i < FlippyBird.CONTAINER.BACKSKYS.length; i++){
        selChild = FlippyBird.CONTAINER.BACKSKYS[i];
        if(selChild.active === false){
            selChild.active = true;
            selChild.visible = true;
            return selChild;
        }
    }
    selChild = BackSky.create();
    return selChild;
};

BackSky.preSet = function () {
    let background = null;
    for (let j = 0; j < 2; j++) {
        background = BackSky.create();
        background.visible = false;
        background.active = false;
    }
};

