const MIN_PIPE_HEIGHT = 100;
const MAX_PIPE_HEIGHT = 350;
const STARTING_X = 1500;

var Pipe = cc.Sprite.extend({
    active: true,
    zOrder: -5,
    _spaceBetweenTopDownPipes: 300,
    _distanceBetweenTwoPipes: 400,
    _maxDeltaSpace: 100,
    _maxDeltaDistance: 100,
    _isCreated: true,
    topPipe: null,
    downPipe: null,
    downPipePosY: 0,
    topPipePosY: 0,
    isScored: false,
    pipesPosX: 100,
    _scale: 2,
    _topBoundingBox: null,
    _downBoundingBox: null,
    _posToReset: -200,

    ctor: function (){
        this._super();
        this.topPipe = new cc.Sprite(res.pipeImage);
        this.downPipe = new cc.Sprite(res.pipeImage);
        this.downPipe.attr({
            scale: this._scale,
            anchorX: 0.5,
            anchorY: 0,
            interactablePipe: true,
            x: STARTING_X,
            zOrder: this.zOrder,
        });
        this.topPipe.attr({
            scale: this._scale,
            anchorX: 0.5,
            anchorY: 0,
            interactablePipe: true,
            x: STARTING_X,
            zOrder: this.zOrder,
            rotation: 180,
        });
        this.addChild(this.downPipe,this.zOrder);
        this.addChild(this.topPipe,this.zOrder);

        this._topBoundingBox = this.topPipe.getBoundingBox();
        this._downBoundingBox = this.downPipe.getBoundingBox();
    },
    destroy:function () {
        this._isCreated = true;
        this.visible = false;
        this.active = false;
    },
    //Calculate random distance between 2 top pipe and down pipe
    calculateDualPipeDistance: function (){
        const pipeHeight = this.downPipe.height * this._scale;
        let deltaHeight = Math.random() * pipeHeight;
        if(deltaHeight < MIN_PIPE_HEIGHT){
            deltaHeight = MIN_PIPE_HEIGHT;
        }
        if(deltaHeight > MAX_PIPE_HEIGHT){
            deltaHeight = MAX_PIPE_HEIGHT;
        }
        const deltaSpace = this._maxDeltaSpace * (0.5 - Math.random());
        this.topPipePosY = pipeHeight + this._spaceBetweenTopDownPipes + deltaHeight + deltaSpace;
        this.downPipePosY = deltaHeight - pipeHeight;

        this.topPipe.y = this.topPipePosY;
        this.downPipe.y = this.downPipePosY;
        this.topPipe.x = STARTING_X;
        this.downPipe.x = STARTING_X;
    },
    updatePipe:function (dt) {
        const movingDist = 200 * dt;
        if (g_sharedGameLayer._bird.x > this.downPipe.x && !this.isScored){
            this.isScored = true;
            playScoreEffect();
            GAMESCORE ++;
        }
        let deltaDistance = this._maxDeltaDistance * (0.5 - Math.random());
        if(this._isCreated && this.topPipe.x < (STARTING_X - this._distanceBetweenTwoPipes + deltaDistance)){
            Pipe.getOrCreate();
            this._isCreated = false;
        }

        if (g_sharedGameLayer._state === STATE_PLAYING && this.active) {
            this.topPipe.x -= movingDist;
            this.downPipe.x -= movingDist;
        }
        if(this.downPipe.x < this._posToReset){
            this.destroy();
        }
        this._topBoundingBox = this.topPipe.getBoundingBox();
        this._downBoundingBox = this.downPipe.getBoundingBox();
    },
    //Locate exact top or down pipe to be moved and set action for it
    beMove: function (hitPoint, pipe){
        let midPipeY;
        let selfPipe;
        if(pipe === "TOP"){
            midPipeY = this.topPipe.y - this.topPipe.height * this._scale / 2;
            selfPipe = this.topPipe;
            selfPipe.interactablePipe = false;
        }
        else{
            midPipeY = this.downPipe.y + this.downPipe.height * this._scale / 2;
            selfPipe = this.downPipe;
            selfPipe.interactablePipe = false;
        }
        const delta = hitPoint.y - midPipeY;
        selfPipe.runAction(cc.rotateTo(1,delta));
        selfPipe.runAction(cc.moveTo(1,this.x + 1000,-800));
    }
});

Pipe.create = function (){
    console.log("Pipe create()" + Math.random());
    let pipe = new Pipe();
    g_sharedGameLayer.addChild(pipe,-5);
    FlippyBird.CONTAINER.PIPES.push(pipe);
    return pipe;
};
//If exist some pipe can be used we take that pipe
Pipe.getOrCreate = function (){
    let selChild = null;
    for(let i = 0; i < FlippyBird.CONTAINER.PIPES.length; i++){
        selChild = FlippyBird.CONTAINER.PIPES[i];
        if(selChild && selChild.active === false){
            Pipe.prepare(selChild);
            return selChild;
        }
    }
    selChild = Pipe.create();
    selChild.calculateDualPipeDistance();
    return selChild;
};
//Using for relocation and state of pipes
Pipe.prepare = function (pipe){
    pipe.active = true;
    pipe.visible = true;
    pipe.calculateDualPipeDistance();
    pipe.topPipe.setRotation(180);
    pipe.downPipe.setRotation(0);
    pipe.isScored = false;
    pipe.topPipe.interactablePipe = true;
    pipe.downPipe.interactablePipe = true;
}
//Pre create some pipe to improve performance
Pipe.preSet = function (){
    let pipe = null;
    for(let j = 0; j < 5; j++){
        pipe = Pipe.create();
        pipe.visible = false;
        pipe.active = false;
    }
};


