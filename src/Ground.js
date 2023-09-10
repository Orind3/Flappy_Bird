var Ground = cc.Sprite.extend({
    active: true,
    zOrder: 12,
    _boundingBox: null,
    ctor: function () {
        this._super(res.groundImage);
        this.scale = 2.5;
        this.anchorX = 0;
        this.anchorY = 0;
        this.x = 0;
        this.y = 0;
        this.getTexture().setAliasTexParameters();
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    },
    updateGround: function (dt){
        this._boundingBox = this.getBoundingBox();
    }
});
Ground.create = function () {
    console.log("Ground create() "+ Math.random());
    var backGround = new Ground();
    g_sharedGameLayer.addChild(backGround,12);
    FlippyBird.CONTAINER.BACKGROUND.push(backGround);
    return backGround;
};

Ground.getOrCreate = function () {
    var selChild = null;
    for(var i = 0; i < FlippyBird.CONTAINER.BACKGROUND.length; i++){
        selChild = FlippyBird.CONTAINER.BACKGROUND[i];
        if(selChild.active == false){
            selChild.active = true;
            selChild.visible = true;
            return selChild;
        }
    }
    selChild = Ground.create();
    return selChild;
};

Ground.preSet = function () {
    var background = null;
    for (var j = 0; j < 2; j++) {
        background = Ground.create();
        background.visible = false;
        background.active = false;
    }
};