var Pipe = cc.Sprite.extend({
    active: true,
    zOrder: 9,
    topPipe: {

    },
    downPipe: {

    },
    ctor: function (){
        this._super(res.pipeImage);
        var rect = cc.rect(0, 1, this.width, this.height-2);
        this.setTextureRect(rect);
        this.anchorX = 0;
        this.anchorY = 0;
        this.scale = 2.5;
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

Pipe.create = function () {
    var pipe = new Pipe();
    g_sharedGameLayer.addChild(pipe,-9);
    FlippyBird.CONTAINER.PIPES.push(pipe);
    return pipe;
};

Pipe.getOrCreate = function () {
    var selChild = null;
    for(var i = 0; i < FlippyBird.CONTAINER.PIPES.length; i++){
        selChild = FlippyBird.CONTAINER.PIPES[i];
        if(selChild.active === false){
            selChild.active = true;
            selChild.visible = true;
            return selChild;
        }
    }
    selChild = new Pipe();
    return selChild;
}


Pipe.preSet = function () {
    var pipe = null;
    for(var j = 0; j < 12; j++){
        pipe = Pipe.create();
        pipe.visible = false;
        pipe.active = false;
        if(j){
            pipe.rotate = 180;
        }
    }
}