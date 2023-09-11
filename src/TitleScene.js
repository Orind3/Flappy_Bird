var TitleScene = cc.Layer.extend({
    countDown: 3,
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
        this.gameName.enableOutline(cc.color(0, 0, 0), 2);

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
        this.enterLabel.enableOutline(cc.color(0, 0, 0), 2);
        this.addChild(this.enterLabel,1);


        var progressBar = new cc.DrawNode();
        progressBar.setPosition(200, 300);
        progressBar.radius = 50; // Bán kính của hình tròn progress bar
        progressBar.percentage = 30; // Giá trị tiến độ ban đầu
        progressBar.color = cc.color(255, 255, 255); // Màu sắc của progress bar

        this.addChild(progressBar,1);

        this.timingLabel = new ccui.Text("",res.font,75);
        this.timingLabel.x = winSize.width  / 2;
        this.timingLabel.y = winSize.height / 2;
        this.timingLabel.enableOutline(cc.color(0, 0, 0), 2);
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
                        self.removeChild(self.enterLabel);
                        self.removeChild(self.gameName);

                        self.schedule(()=>{
                            if(self.countDown>0)
                                self.timingLabel.setString(self.countDown);
                            const zoomOutAction = cc.scaleBy(0.2 , 2);
                            const zoomInAction = cc.scaleBy(0.8 , 0.5);
                            self.timingLabel.runAction(cc.sequence(zoomOutAction,zoomInAction));
                            self.countDown --;
                        },1)
                    }
                }
            },this);
    },
    update: function (dt){
        if(this.countDown <= -1){
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