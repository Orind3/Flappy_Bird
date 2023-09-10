var OverScene = cc.Layer.extend({
    countDown: 3,
    countDownTime: null,
    timingLabel: null,
    enterLabel: null,
    lostTitle: null,
    score: null,
    cup: null,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        const winSize = cc.director.getWinSize();


        this.lostTitle = new ccui.Text("OOP! YOU LOST!",res.font,50);
        this.lostTitle.x = winSize.width  / 2;
        this.lostTitle.y = 480;
        this.addChild(this.lostTitle, 1);

        this.score = new ccui.Text("Score: " + GAMESCORE,res.font,30);
        this.score.x = winSize.width / 2;
        this.score.y = 290;
        this.addChild(this.score,1);

        this.cup = cc.Sprite(res.bronzeCup);
        if(GAMESCORE > 3){
            this.cup = cc.Sprite(res.silverCup);
        }
        if(GAMESCORE > 5){
            this.cup = cc.Sprite(res.goldenCup);
        }

        this.cup.attr({
            anchorX : 0.5,
            anchorY : 0.5,
            x : winSize.width/2,
            y : winSize.height/2,
            scale: 0.2,
        });

        this.addChild(this.cup,1);

        const backGround = cc.Sprite(res.bgImage);
        backGround.attr({
            scale : 2.5,
            anchorX : 0,
            anchorY : 0,
        });
        this.addChild(backGround,0);

        const ground = cc.Sprite(res.groundImage);
        ground.attr({
            scale : 2.5,
            anchorX : 0,
            anchorY : 0,
        });
        this.addChild(ground,1);

        this.enterLabel = new ccui.Text("PRESS ENTER TO PLAY AGAIN",res.font,25);
        this.enterLabel.x = winSize.width  / 2;
        this.enterLabel.y = 250;
        this.addChild(this.enterLabel,1);

        this.timingLabel = new ccui.Text("",res.font,75);
        this.timingLabel.x = winSize.width  / 2;
        this.timingLabel.y = winSize.height / 2;
        this.addChild(this.timingLabel,1);

        this.addKeyboardListener();
        this.scheduleUpdate();
        return true;
    },
    addKeyboardListener: function (){
        var self = this;
        if(cc.sys.capabilities.hasOwnProperty('keyboard'))
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,

                onKeyPressed: function (key, event){
                    if(key == cc.KEY.enter){
                        self.timingLabel.setString(self.countDown);
                        self.removeChild(self.cup);
                        self.removeChild(self.score);
                        self.removeChild(self.enterLabel);
                        self.removeChild(self.lostTitle);
                        self.countDownTime = setInterval(()=>{
                            self.countDown --;
                            self.timingLabel.setString(self.countDown);
                        },1000)
                    }
                }
            },this);
    },
    update: function (dt){
        if(this.countDown <= 0){
            clearInterval(this.countDownTime);
            FlippyBird.CONTAINER.BACKSKYS = [];
            FlippyBird.CONTAINER.PIPES = [];
            FlippyBird.CONTAINER.BACKGROUND = [];
            GAMESCORE = 0;
            checkFirstTime = true;
            cc.director.runScene(GameLayer.scene());
        }
    }
});

OverScene.scene = function () {
    var scene = new cc.Scene();
    var layer = new OverScene();
    scene.addChild(layer);
    return scene;
};