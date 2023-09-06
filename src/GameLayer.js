
STATE_PLAYING = 0;
STATE_PAUSE = 2;
STATE_GAMEOVER = 1;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _backSky:null,
    _backSkyWidth: 0,
    _backSkyRe:null,
    _state: STATE_PAUSE,
    _bird: null,
    _firstTouch: true,
    _backGround: null,
    _backGroundWidth: 0,
    _preBackGround: null,


    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        g_sharedGameLayer = this;

        BackSky.preSet();
        Ground.preSet();
        Pipe.preSet();
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
            this._movingGround(dt);
        }
    },

    initBackGround: function(){
        this._backSky = BackSky.getOrCreate();
        this._backGround = Ground.getOrCreate();
        this._backSkyWidth = this._backSky.width;
        this._backGroundWidth = this._backGround.width;
    },

    _movingGround:function (dt){
        var movingDist = 100 * dt;

        var currPosX = this._backGround.x - movingDist;

        if(currPosX + this._backGroundWidth <= winSize.width){
            this._preBackGround = this._backGround;
            this._backGround = Ground.getOrCreate();
            this._backGround.x = currPosX + this._backGroundWidth;
        }else{
            this._backGround.x = currPosX;
        }
        if(this._preBackGround){
            currPosX = this._preBackGround.x  - movingDist;
            if(currPosX + this._backGroundWidth < 0){
                this._preBackGround.destroy();
            }
            else{
                this._preBackGround.x = currPosX;
            }
        }

    },


    _movingBackground:function(dt){
        var movingDist = 16 * dt;

        var locSkyWidth = this._backSkyWidth, locBackSky = this._backSky;
        var currPosX = locBackSky.x - movingDist;
        var locBackSkyRe = this._backSkyRe;

        if(locSkyWidth + currPosX <= winSize.width){
;

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
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                if(self._firstTouch){
                    self._state = STATE_PLAYING;
                    self._firstTouch = false;
                    console.log("Get ready");
                    self._bird.getReady();
                }
                self._bird.fly();
                return true;
            },
            onTouchEnded: function(touch, event) {
                //Do nothing
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
