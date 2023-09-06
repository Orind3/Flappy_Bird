var Bird = cc.Sprite.extend({
    zOrder:1,
    appearPosition:cc.p(400, cc.director.getWinSize().height/2),
    active:true,
    birdGravity: 0,
    birdVelocity: 0,
    birdAcceleration: 0,
    birdAngle: 0,
    birdJumpVelocity: 0,
    ctor: function () {
        this._super(res.birdImage);
        this.tag = this.zOrder;
        this.x = this.appearPosition.x;
        this.y = this.appearPosition.y;
        this.scale = 2.5;
        this.scheduleUpdate();
    },


    update: function (dt) {
        this.birdVelocity += dt * this.birdAcceleration;
        this.birdVelocity -= dt * this.birdGravity;
        this.y = this.y + this.birdVelocity;
        this.calculateBirdAngle(dt);
        if(this.birdVelocity > this.birdJumpVelocity){
            this.birdAcceleration = 0;
        }
        this.setRotation(this.birdAngle);
    },
    calculateBirdAngle: function (dt) {
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
    },
    getReady: function () {
        this.birdGravity = 40;
        this.birdVelocity = 0;
        this.birdAngle = 0;
        this.birdJumpVelocity = 8;
    },

    fly: function () {
        this.birdAcceleration = 200;
    }
});