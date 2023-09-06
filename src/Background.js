var BackSky = cc.Sprite.extend({
    active: true,
    zOrder: 11,
    ctor: function () {
        this._super(res.bgImage);
        this.scale = 2.5;
        this.anchorX = 0;
        this.anchorY = 0;
        var rect = cc.rect(0, 1, this.width, this.height-2);
        this.setTextureRect(rect);
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

BackSky.create = function () {
    var backGround = new BackSky();
    g_sharedGameLayer.addChild(backGround,-10);
    FlippyBird.CONTAINER.BACKSKYS.push(backGround);
    return backGround;
};

BackSky.getOrCreate = function () {
    var selChild = null;
    for(var i = 0; i < FlippyBird.CONTAINER.BACKSKYS.length; i++){
        selChild = FlippyBird.CONTAINER.BACKSKYS[i];
        if(selChild.active == false){
            selChild.active = true;
            selChild.visible = true;
            return selChild;
        }
    }
    selChild = BackSky.create();
    return selChild;
};

BackSky.preSet = function () {
    var background = null;
    for (var j = 0; j < 2; j++) {
        background = BackSky.create();
        background.visible = false;
        background.active = false;
    }
};

