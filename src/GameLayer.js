STATE_PLAYING = 0;
STATE_PAUSE = 2;
STATE_GAMEOVER = 1;
STATE_PREPARING = 3;
let g_sharedGameLayer;

const GameLayer = cc.Layer.extend({
    _backSky:null,
    _backSkyWidth: 0,
    _backSkyRe:null,
    _state: STATE_PLAYING,
    _scoreTitle: null,
    _bird: null,
    _pipes: null,
    _backGround: null,
    _backGroundWidth: 0,
    _preBackGround: null,
    _pipeCreateId: 0,
    _infoTitle: null,
    _countDownTime : 3,
    _countDownID: 0,
    winSize: null,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        g_sharedGameLayer = this;
        this.winSize = cc.director.getWinSize();
        this._scoreTitle = new ccui.Text("Score: ",res.font,50);
        this._scoreTitle.x = 120;
        this._scoreTitle.y = this.winSize.height - 50;
        this.addChild(this._scoreTitle,1);

        this._infoTitle = new ccui.Text("",res.font,50);
        this._infoTitle.x = this.winSize.width/2;
        this._infoTitle.y = this.winSize.height/2;
        this.addChild(this._infoTitle);

        BackSky.preSet();
        Ground.preSet();
        Pipe.preSet();
        Pipe.getOrCreate();

        playBackgroundMusic();

        this._bird = new Bird();
        this._bird.getReady();
        this._bird.fly();
        this.addChild(this._bird,this._bird.zOrder);

        this.initBackGround();
        this.addTouchListener();
        this.addKeyboardListener();
        this.scheduleUpdate();
    },

    update:function (dt) {
        if(this._state !== STATE_PAUSE){
            this._bird.updateBird(dt);
        }
        if (this._state === STATE_PLAYING || this._state === STATE_PREPARING) {
            this._movingBackground(dt);
            this._movingGround(dt);
            for(let i = 0; i < FlippyBird.CONTAINER.PIPES.length; i++){
                if(FlippyBird.CONTAINER.PIPES[i].active){
                    FlippyBird.CONTAINER.PIPES[i].updatePipe(dt);
                }
            }
            for(let i = 0; i < FlippyBird.CONTAINER.BACKGROUND.length; i++){
                if(FlippyBird.CONTAINER.BACKGROUND[i].active){
                    FlippyBird.CONTAINER.BACKGROUND[i].updateGround(dt);
                }
            }
        }
        this._scoreTitle.setString("Score: " + GAMESCORE);
        if(this._state === STATE_GAMEOVER){
            stopBackgroundMusic();
            clearInterval(this._pipeCreateId);
        }
    },

    initBackGround: function(){
        this._backSky = BackSky.getOrCreate();
        this._backGround = Ground.getOrCreate();
        this._backSkyWidth = this._backSky.width * 2.5;
        this._backGroundWidth = this._backGround.width * 2.5;
    },

    _movingGround:function (dt){
        const movingDist = 200 * dt;
        let currPosX = this._backGround.x - movingDist;

        if(currPosX + this._backGroundWidth <= this.winSize.width){
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
        const movingDist = 16 * dt;
        let locSkyWidth = this._backSkyWidth, locBackSky = this._backSky;
        let currPosX = locBackSky.x - movingDist;
        let locBackSkyRe = this._backSkyRe;

        if(locSkyWidth + currPosX <= this.winSize.width){
            locBackSkyRe = this._backSky;
            this._backSkyRe = this._backSky;

            //create a new background
            this._backSky = BackSky.getOrCreate();
            locBackSky = this._backSky;
            locBackSky.x = currPosX + locSkyWidth - 5;
        } else
            locBackSky.x = currPosX;

        if(locBackSkyRe){
            currPosX = locBackSkyRe.x - movingDist;
            if(currPosX + locSkyWidth < 0){
                locBackSkyRe.destroy();
                this._backSkyRe = null;
            } else
                locBackSkyRe.x = currPosX;
        }
    },

    addTouchListener: function () {
        const self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function() {
                self._bird.fly();
                return true;
            },
        },this);
    },

    addKeyboardListener: function (){
        const self = this;
        if(cc.sys.capabilities.hasOwnProperty('keyboard'))
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key){
                    if(key === cc.KEY.q && self._bird.powerSkill){
                        self._bird.usePowerSkill();
                    }
                    if(key === cc.KEY.w && self._bird.dash){
                        self._bird.useDash();
                    }
                    if(key === cc.KEY.escape){
                        if(self._state === STATE_PAUSE){
                            self._infoTitle.setString("3");
                            let timer = self._countDownTime;
                            self._countDownID = setInterval(()=>{
                                timer --;
                                self._infoTitle.setString(timer);
                            },1000);
                            setTimeout(()=>{
                                clearInterval(self._countDownID);
                                self._infoTitle.setString("");
                                self._state = STATE_PLAYING;
                            },3000);
                        }
                        else if(self._state === STATE_PLAYING){
                            self._infoTitle.setString("PAUSE");
                            self._state = STATE_PAUSE;
                            stopBackgroundMusic();
                        }
                    }
                    if(key === cc.KEY.space){
                        self._bird.fly();
                    }
                }
            },this);
    },
});

GameLayer.scene = function () {
    const scene = new cc.Scene();
    const layer = new GameLayer();
    scene.addChild(layer, 1);
    return scene;
};
