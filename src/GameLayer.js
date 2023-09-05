
var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _backSky:null,
    _backSkyWidth: 0,
    _backSkyRe:null,
    _state: STATE_PLAYING,

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        g_sharedGameLayer = this;
        BackSky.preSet();
        winSize = cc.director.getWinSize();
    },

    update:function (dt) {
        //this._testNode.update(dt);
        if (this._state == STATE_PLAYING) {
            this._movingBackground(dt);
        }
    },

    initBackGround: function(){
        this._backSky = BackSky.getOrCreate();
        this._backSkyWidth = this._backSky.width;
    },
    _movingBackground: function(dt){
        var movingDist = 16 * dt;

        var locSkyWidth = this._backSkyWidth, locBackSky = this._backSky;
        var currPosX = locBackSky.x - movingDist;
        var locBackSkyRe = this._backSky;

        if(locSkyWidth + currPosX <= winSize.width){
            if(locBackSkyRe != null)
               throw "The memory is leaking at moving background";
           locBackSkyRe = this._backSky;
           this._backSkyRe = this._backSky;

           //create a new background
           this._backSky = BackSky.getOrCreate();
           locBackSky = this._backSky;
           locBackSky.y = currPosY + locSkyWidth - 5;
       } else
           locBackSky.y = currPosY;

       if(locBackSkyRe){
           //locBackSkyRe
           currPosX = locBackSkyRe.y - movingDist;
           if(currPosX + locSkyWidth < 0){
               locBackSkyRe.destroy();
               this._backSkyRe = null;
           } else
               locBackSkyRe.x= currPosX;
       }
    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer, 1);
    return scene;
};
