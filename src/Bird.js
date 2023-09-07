var Bird = cc.Sprite.extend({
    zOrder:1,
    appearPosition:cc.p(0, cc.director.getWinSize().height/2),
    active:true,
    birdGravity: 0,
    birdVelocity: 0,
    _width: 0,
    _height: 0,
    birdImagePadding: 5,
    birdAcceleration: 0,
    birdAngle: 0,
    birdJumpVelocity: 0,
    _boundingBox: {
        // topLeft: cc.p(0,0),
        downLeft: cc.p(0,0),
        // topRight: cc.p(0,0),
        // downRight: cc.p(0,0),
        // midTop: cc.p(0,0),
        // midRight: cc.p(0,0),
        // midDown: cc.p(0,0),
    },
    ctor: function (){
        this._super(res.birdImage);
        this.tag = this.zOrder;
        this.x = this.appearPosition.x;
        this.y = this.appearPosition.y;
        this.scale = 2.5;
        this._width = this.width * 1.25 - this.birdImagePadding;
        this._height = this.height * 1.25 - this.birdImagePadding;
        console.log("Bird: " + this._width);
        this.scheduleUpdate();
    },

    update: function (dt){
        this.birdVelocity += dt * this.birdAcceleration;
        this.birdVelocity -= dt * this.birdGravity;
        this.y = this.y + this.birdVelocity;
        this.calculateBirdAngle(dt);
        if(this.birdVelocity > this.birdJumpVelocity){
            this.birdAcceleration = 0;
        }
        if(this.collide()){
            g_sharedGameLayer._state = STATE_GAMEOVER;
            this.over();
        }
    },
    calculateBirdAngle: function (dt){
        if(this.birdVelocity > 0){
            this.birdAngle = - this.birdVelocity/this.birdJumpVelocity * 40;
        }
        else if(this.birdVelocity < 0){
            this.birdAngle =  - this.birdVelocity/this.birdJumpVelocity * 150;
            if(this.birdAngle > 70){
                this.birdAngle = 70;
            }
        }
        else{
            this.birdAngle = 0;
        }
        this.setRotation(this.birdAngle);
        this._boundingBox.downLeft = cc.p(this.x,this.y);
        // this._boundingBox.downRight = cc.p(this.x + this._width * Math.cos(this.birdAngle),this.y - this._height * Math.sin(this.birdAngle));
        // this._boundingBox.topLeft = cc.p(this.x + this._height * Math.sin(this.birdAngle), this.y + this._height * Math.cos(this.birdAngle));
        // this._boundingBox.topRight = cc.p(this._boundingBox.downRight.x + this._boundingBox.topLeft.x - this._boundingBox.downLeft.x, this._boundingBox.downRight.y + this._boundingBox.topLeft.y - this._boundingBox.downLeft.y);
        // this._boundingBox.midTop = cc.p((this._boundingBox.topLeft.x + this._boundingBox.topRight.x) / 2,(this._boundingBox.topLeft.y + this._boundingBox.topRight.y) / 2);
        // this._boundingBox.midRight = cc.p((this._boundingBox.downRight.x + this._boundingBox.topRight.x) / 2,(this._boundingBox.downRight.y + this._boundingBox.topRight.y) / 2);
        // this._boundingBox.midDown = cc.p((this._boundingBox.downLeft.x + this._boundingBox.downRight.x) / 2,(this._boundingBox.downLeft.y + this._boundingBox.downRight.y) / 2);
        },
    getReady: function (){
        this.birdGravity = 40;
        this.birdVelocity = 0;
        this.birdAngle = 0;
        this.birdJumpVelocity = 8;
    },
    over: function (){
        this.birdGravity = 0;
        this.birdVelocity = 0;
        this.birdAngle = 0;
        this.birdJumpVelocity = 0;
    },

    fly: function (){
        this.birdAcceleration = 200;
    },
    collide: function (){
        for(var i = 0; i < FlippyBird.CONTAINER.PIPES.length; i++){
            for (let currPoint in this._boundingBox) {
                if(FlippyBird.CONTAINER.PIPES[i]._downBoundingBox&&cc.rectContainsPoint(FlippyBird.CONTAINER.PIPES[i]._downBoundingBox,this._boundingBox[currPoint])){
                    console.log("Bird x: "+ this.x);
                    console.log(FlippyBird.CONTAINER.PIPES[i]._downBoundingBox.x);
                    return true;
                }
                if(FlippyBird.CONTAINER.PIPES[i]._topBoundingBox&&cc.rectContainsPoint(FlippyBird.CONTAINER.PIPES[i]._topBoundingBox,this._boundingBox[currPoint])){
                    console.log("Bird x: "+ this.x);
                    console.log(FlippyBird.CONTAINER.PIPES[i]._topBoundingBox.x);
                    return true;
                }
            }
        }
        for(var i = 0; i < FlippyBird.CONTAINER.BACKGROUND.length; i++){
            for (let currPoint in this._boundingBox) {
                if(FlippyBird.CONTAINER.BACKGROUND[i]._boundingBox&&cc.rectContainsPoint(FlippyBird.CONTAINER.BACKGROUND[i]._boundingBox,this._boundingBox[currPoint]))
                    return true;
            }
        }
    }
});