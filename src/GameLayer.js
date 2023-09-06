
STATE_PLAYING = 0;
STATE_GAMEOVER = 1;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _backSky:null,
    _backSkyWidth: 0,
    _backSkyRe:null,
    _state: STATE_PLAYING,
    _bird: null,

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        g_sharedGameLayer = this;

        BackSky.preSet();
        winSize = cc.director.getWinSize();


        this._bird = new Bird();
        this.addChild(this._bird,this._bird.zOrder);
        this.initBackGround();
        this.addTouchListener();
        this.scheduleUpdate();
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

    _movingBackground:function(dt){
        var movingDist = 16 * dt;       // background's moving rate is 16 pixel per second

        var locSkyWidth = this._backSkyWidth, locBackSky = this._backSky;
        var currPosX = locBackSky.x - movingDist;
        var locBackSkyRe = this._backSkyRe;

        if(locSkyWidth + currPosX <= winSize.width){
            if(locBackSkyRe != null)
                throw "The memory is leaking at moving background";

            locBackSkyRe = this._backSky;
            this._backSkyRe = this._backSky;

            //create a new background
            this._backSky = BackSky.getOrCreate();
            locBackSky = this._backSky;
            locBackSky.x = currPosX + locSkyWidth - 5;
        } else
            locBackSky.x = currPosX;

        if(locBackSkyRe){
            //locBackSkyRe
            currPosX = locBackSkyRe.x - movingDist;
            if(currPosX + locSkyWidth < 0){
                locBackSkyRe.destroy();
                this._backSkyRe = null;
            } else
                locBackSkyRe.x = currPosX;
        }
    },

    addTouchListener: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesMoved: function (touches, event){
                if(this._state == STATE_PLAYING){
                    self._bird.fly();
                    console.log("Touch");
                }
            }

        },this);
    }
});

    GameLayer.scene = function () {
        var scene = new cc.Scene();
        var layer = new GameLayer();
        scene.addChild(layer, 1);
        return scene;
    };
