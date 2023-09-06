var Bird = cc.Sprite.extend({
    zOrder:3000,
    appearPosition:cc.p(100, cc.director.getWinSize().height/2),
    active:true,
    birdGravity: 3,
    birdVelocity: 0,
    birdJumpVelocity: 3,
    ctor: function () {
        this._super(res.birdImage);
        this.tag = this.zOrder;
        this.x = this.appearPosition.x;
        this.y = this.appearPosition.y;
        this.scale = 2.5;
        this.scheduleUpdate();
    },

    update: function (dt) {
        this.y = this.y + this.birdVelocity;
        this.birdVelocity -= dt * this.birdGravity;
    },

    fly: function () {
        this.birdVelocity = 0;
        this.birdVelocity += this.birdJumpVelocity;
    }
});