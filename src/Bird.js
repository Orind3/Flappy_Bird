var checkFirstTime = true;

var Bird = cc.Sprite.extend({
    zOrder:1,
    appearPosition:cc.p(400, cc.director.getWinSize().height/2),
    active:true,
    birdGravity: 0,
    birdVelocity: 0,
    _width: 0,
    _height: 0,
    birdImagePadding: 4,
    birdAcceleration: 0,
    birdAngle: 0,
    birdJumpVelocity: 0,
    powerSkill: true,
    powerSkillActive: false,
    _boundingBox: {
        topLeft: cc.p(0,0),
        downLeft: cc.p(0,0),
        topRight: cc.p(0,0),
        downRight: cc.p(0,0),
        midTop: cc.p(0,0),
        midRight: cc.p(0,0),
        midDown: cc.p(0,0),
    },
    ctor: function (){
        this._super(res.birdImage);
        this.tag = this.zOrder;
        this.x = this.appearPosition.x;
        this.y = this.appearPosition.y;
        this.scale = 2.5;
        this.setWidthAndHeight(this.scale);
        this.scheduleUpdate();
    },

    update: function (dt){
        this.birdVelocity += dt * this.birdAcceleration;
        this.birdVelocity -= dt * this.birdGravity;
        this.y = this.y + this.birdVelocity;
        this.calculateBoundingBox();
        if(g_sharedGameLayer._state == STATE_PLAYING){
            this.calculateBirdAngle(dt);
        }
        if(this.birdVelocity > this.birdJumpVelocity){
            this.birdAcceleration = 0;
        }
        var resCollide = this.collide();
        if(resCollide){
            g_sharedGameLayer._state = STATE_GAMEOVER;
        }
        if((g_sharedGameLayer._state == STATE_GAMEOVER && checkFirstTime) || resCollide == 2){
            checkFirstTime = false;
            this.birdAcceleration = 0;
            this.birdGravity = 0;
            this.birdVelocity = 0;
            if(resCollide == 1){
                setTimeout(()=>{
                    this.birdVelocity = -15;
                    this.calculateBirdAngle(dt);
                },100);
            }
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
        },
    getReady: function (){
        this.birdGravity = 40;
        this.birdVelocity = 0;
        this.birdAngle = 0;
        this.birdJumpVelocity = 8;
    },
    fly: function (){
        this.birdAcceleration = 200;
    },
    collide: function (){
        if(g_sharedGameLayer._state == STATE_PLAYING){
            for(var i = 0; i < FlippyBird.CONTAINER.PIPES.length; i++){
                for (let currPoint in this._boundingBox) {
                    if(FlippyBird.CONTAINER.PIPES[i]._downBoundingBox
                        &&cc.rectContainsPoint(FlippyBird.CONTAINER.PIPES[i]._downBoundingBox,this._boundingBox[currPoint])
                        &&FlippyBird.CONTAINER.PIPES[i].downPipe.interactablePipe){
                        if(this.powerSkillActive)
                            FlippyBird.CONTAINER.PIPES[i].beMove(this._boundingBox[currPoint],"DOWN");
                        else
                            return 1;
                    }
                    if(FlippyBird.CONTAINER.PIPES[i]._topBoundingBox
                        &&cc.rectContainsPoint(FlippyBird.CONTAINER.PIPES[i]._topBoundingBox,this._boundingBox[currPoint])
                        &&FlippyBird.CONTAINER.PIPES[i].topPipe.interactablePipe){
                        if(this.powerSkillActive)
                            FlippyBird.CONTAINER.PIPES[i].beMove(this._boundingBox[currPoint],"TOP");
                        else
                            return 1;
                    }
                }
            }
        }
        for(var i = 0; i < FlippyBird.CONTAINER.BACKGROUND.length; i++){
            for (let currPoint in this._boundingBox) {
                if(FlippyBird.CONTAINER.BACKGROUND[i]._boundingBox&&cc.rectContainsPoint(FlippyBird.CONTAINER.BACKGROUND[i]._boundingBox,this._boundingBox[currPoint]))
                    return 2;
            }
        }
        return 0;
    },
    calculateBoundingBox: function (){
        var halfDiagona = Math.sqrt(this._height * this._height + this._width * this._width)/2;
        var centerAngle = Math.atan(this._width/this._height);
        this._boundingBox.downLeft = cc.p(this.x - halfDiagona * Math.cos(centerAngle - this.birdAngle),this.y - halfDiagona * Math.sin(centerAngle - this.birdAngle));
        this._boundingBox.downRight = cc.p(this.x + halfDiagona * Math.cos(centerAngle + this.birdAngle),this.y - halfDiagona * Math.sin(centerAngle + this.birdAngle));
        this._boundingBox.topLeft = cc.p(this.x * 2 - this._boundingBox.downRight.x, this.y * 2 - this._boundingBox.downRight.y);
        this._boundingBox.topRight =  cc.p(this.x * 2 - this._boundingBox.downLeft.x, this.y * 2 - this._boundingBox.downLeft.y);
        this._boundingBox.midTop = cc.p((this._boundingBox.topLeft.x + this._boundingBox.topRight.x) / 2,(this._boundingBox.topLeft.y + this._boundingBox.topRight.y) / 2);
        this._boundingBox.midRight = cc.p((this._boundingBox.downRight.x + this._boundingBox.topRight.x) / 2,(this._boundingBox.downRight.y + this._boundingBox.topRight.y) / 2);
        this._boundingBox.midDown = cc.p((this._boundingBox.downLeft.x + this._boundingBox.downRight.x) / 2,(this._boundingBox.downLeft.y + this._boundingBox.downRight.y) / 2);
    },
    usePowerSkill: function (){
        this.powerSkill = false;
        this.powerSkillActive = true;
        setTimeout(()=>{
            this.powerSkill = true;
        },30000);
        this.runAction(cc.scaleBy(0.2,5))
        this.setWidthAndHeight(12.5);
        setTimeout(()=>{
            this.runAction(cc.scaleBy(0.2,0.2));
            this.setWidthAndHeight(2.5);
            this.powerSkillActive = false;
        },5000);
    },
    setWidthAndHeight: function (scale){
        this._width = this.width * scale - this.birdImagePadding * scale;
        this._height = this.height * scale - this.birdImagePadding * scale;
    }
});