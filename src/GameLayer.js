
var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _backSky:null,
    _backSkyHeight:0,
    _backSkyRe:null,

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        g_sharedGameLayer = this;
        BackSky.preSet();
        this._backSky = BackSky.getOrCreate();
    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer, 1);
    return scene;
};
