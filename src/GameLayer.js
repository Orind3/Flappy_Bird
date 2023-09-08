STATE_PLAYING = 0;
STATE_PAUSE = 2;
STATE_GAMEOVER = 1;

let g_sharedGameLayer;
const GameLayer = cc.Layer.extend({
    _backSky:null,
    _backSkyWidth: 0,
    _backSkyRe:null,
    _state: STATE_PAUSE,
    scoreTitle: null,
    _bird: null,
    _pipes: null,
    _firstTouch: true,
    _backGround: null,
    _backGroundWidth: 0,
    _preBackGround: null,
    pipeCreateId: 0,


    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        g_sharedGameLayer = this;
        winSize = cc.director.getWinSize();

        this.scoreTitle = new ccui.Text("Score: ",res.font,50);
        this.scoreTitle.x = 120;
        this.scoreTitle.y = winSize.height - 50;
        this.addChild(this.scoreTitle);

        BackSky.preSet();
        Ground.preSet();
        Pipe.preSet();


        this._bird = new Bird();
        this.addChild(this._bird,this._bird.zOrder);
        this.initBackGround();
        this.addTouchListener();
        this.addKeyboardListener();
        this.scheduleUpdate();

    },

    update:function (dt) {
        //this._testNode.update(dt);
        if (this._state === STATE_PLAYING) {
            this._movingBackground(dt);
            this._movingGround(dt);
        }
        this.scoreTitle.setString("Score: " + GAMESCORE);
        if(this._state === STATE_GAMEOVER){
            clearInterval(pipeCreateId);
        }
    },

    initBackGround: function(){
        this._backSky = BackSky.getOrCreate();
        this._backGround = Ground.getOrCreate();
        this._backSkyWidth = this._backSky.width * 2.5;
        this._backGroundWidth = this._backGround.width;
    },

    _movingGround:function (dt){
        var movingDist = 200 * dt;
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
                    pipeCreateId = setInterval(()=>{
                        Pipe.getOrCreate();
                    },2000);
                    self._state = STATE_PLAYING;
                    self._firstTouch = false;
                    self._bird.getReady();
                }
                if(self._state === STATE_PLAYING)
                    self._bird.fly();
                return true;
            },
            onTouchEnded: function(touch, event) {
                //Do nothing
            }
        },this);
    },
    addKeyboardListener: function (){
        var self = this;
        if(cc.sys.capabilities.hasOwnProperty('keyboard'))
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event){
                    if(key == cc.KEY.q && self._bird.powerSkill){
                        self._bird.usePowerSkill();
                    }
                    if(key == cc.KEY.w && self._bird.dash){
                        self._bird.useDash();
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
