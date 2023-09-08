var TitleScene = cc.Layer.extend({
    countDown: 5,
    countDownTime: null,
    timingLabel: null,
    enterLabel: null,
    gameName: null,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        const winSize = cc.director.getWinSize();

        this.gameName = new ccui.Text("FLAPPY BIRD",res.font,50);
        this.gameName.x = winSize.width  / 2;
        this.gameName.y = 400;

        // const TestImage = cc.Sprite(res.goldenCup);
        // TestImage.attr({
        //     anchorX: 0,
        //     anchorY: 0,
        // });
        // this.addChild(TestImage,1);

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

        this.addChild(this.gameName, 1);
        this.enterLabel = new ccui.Text("PRESS ENTER",res.font,25);
        this.enterLabel.x = winSize.width / 2;
        this.enterLabel.y = 300;
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
                        self.timingLabel.setString("5");
                        self.removeChild(self.enterLabel);
                        self.removeChild(self.gameName);

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
            cc.director.runScene(GameLayer.scene());
        }
    }
});

TitleScene.scene = function () {
    var scene = new cc.Scene();
    var layer = new TitleScene();
    scene.addChild(layer);
    return scene;
};