const MIN_PIPE_HEIGHT = 100;
const MAX_PIPE_HEIGHT = 350;
const STARTING_X = 2000;

var Pipe = cc.Sprite.extend({
    active: true,
    zOrder: -5,
    _distancesBetweenPipes: 300,
    topPipe: null,
    downPipe: null,
    downPipePosY: 0,
    topPipePosY: 0,
    pipesPosX: 100,
    _scale: 2,
    _topBoundingBox: null,
    _downBoundingBox: null,

    ctor: function (){
        this._super();
        this.topPipe = new cc.Sprite(res.pipeImage);
        this.downPipe = new cc.Sprite(res.pipeImage);
        this.downPipe.attr({
            scale: this._scale,
            anchorX: 0.5,
            anchorY: 0,
            x: STARTING_X,
            zOrder: this.zOrder,
        });
        this.topPipe.attr({
            scale: this._scale,
            anchorX: 0.5,
            anchorY: 0,
            x: STARTING_X,
            zOrder: this.zOrder,
            rotation: 180,
        });
        this.addChild(this.downPipe,this.zOrder);
        this.addChild(this.topPipe,this.zOrder);

        this._topBoundingBox = this.topPipe.getBoundingBox();
        this._downBoundingBox = this.downPipe.getBoundingBox();
        this.scheduleUpdate();
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    },

    calculateDualPipeDistance: function (){
        const pipeHeight = this.downPipe.height * this._scale;
        let deltaDistances = Math.random() * pipeHeight;
        if(deltaDistances < MIN_PIPE_HEIGHT){
            deltaDistances = MIN_PIPE_HEIGHT;
        }
        if(deltaDistances > MAX_PIPE_HEIGHT){
            deltaDistances = MAX_PIPE_HEIGHT;
        }
        this.topPipePosY = pipeHeight + this._distancesBetweenPipes + deltaDistances;
        this.downPipePosY = deltaDistances - pipeHeight;
        this.topPipe.y = this.topPipePosY;
        this.downPipe.y = this.downPipePosY;
        this.topPipe.x = STARTING_X;
        this.downPipe.x = STARTING_X;
    },
    update:function (dt) {
        var movingDist = 200 * dt;
        if (g_sharedGameLayer._state == STATE_PLAYING&&this.active) {
            this.topPipe.x -= movingDist;
            this.downPipe.x -= movingDist;
        }
        if(this.downPipe < -200){
            this.destroy();
        }
        this._topBoundingBox = this.topPipe.getBoundingBox();
        this._downBoundingBox = this.downPipe.getBoundingBox();

    }
});

Pipe.create = function (){
    var pipe = new Pipe();
    g_sharedGameLayer.addChild(pipe,-5);
    FlippyBird.CONTAINER.PIPES.push(pipe);
    return pipe;
};

Pipe.getOrCreate = function (){
    var selChild = null;
    for(var i = 0; i < FlippyBird.CONTAINER.PIPES.length; i++){
        selChild = FlippyBird.CONTAINER.PIPES[i];
        if(selChild.active == false){
            selChild.active = true;
            selChild.visible = true;
            selChild.calculateDualPipeDistance();
            return selChild;
        }
    }
    selChild = Pipe.create();
    selChild.calculateDualPipeDistance();
    return selChild;
}

Pipe.preSet = function (){
    var pipe = null;
    for(var j = 0; j < 1; j++){
        pipe = Pipe.create();
        pipe.visible = false;
        pipe.active = false;
    }
};


