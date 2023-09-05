var SysMenu =cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        winSize = cc.director.getWinSize();

        var label = new cc.LabelTTF("Game menu", "Arial", 21);
        this.addChild(label, 1);
        label.x = winSize.width  / 2;
        label.y = 700;

        var playButton = new ccui.Button();
        playButton.setTitleText("Play");
        playButton.setTitleFontSize(32);
        playButton.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        playButton.addClickEventListener(event=>{
            var scene = new cc.Scene();
            scene.addChild(new GameLayer());
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        })
        this.addChild(playButton);

        return true;
    },
});

SysMenu.scene = function () {
    console.log("Reaching here");
    var scene = new cc.Scene();
    var layer = new SysMenu();
    scene.addChild(layer);
    return scene;
};