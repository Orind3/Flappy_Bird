const playBackgroundMusic = function (){
    cc.audioEngine.playMusic(res.backgroundMusic,true);
};

const stopBackgroundMusic = function (){
    cc.audioEngine.pauseMusic();
};

const resumeBackgroundMusic = function (){
    cc.audioEngine.resumeMusic();
};

const playHurtEffect = function (){
    cc.audioEngine.playEffect(res.hurtEffect,false);
};

const playJumpEffect = function (){
    cc.audioEngine.playEffect(res.jumpEffect,false);
}

const playScoreEffect = function (){
    cc.audioEngine.playEffect(res.scoreEffect,false);
};