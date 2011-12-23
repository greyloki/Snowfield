var width = 320,
height = 500,
gLoop,
c = document.getElementById('c'),
ctx = c.getContext('2d');

c.width = width;
c.height = height;

var clear = function(){
    ctx.fillStyle = '#d0e7f9';  //d0e7f9
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
}

//--------------------------------------------------
// CIRCLES
//--------------------------------------------------

var howManyCircles = 5, circles = [];

for (var i = 0; i < howManyCircles; i++){
    circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random() / 2]);        
}

var DrawCircles = function(){
    for (var i = 0; i < howManyCircles; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';
        ctx.beginPath();
        ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
};

var MoveCircles = function(e){
    for (var i = 0; i < howManyCircles; i++) {
        if (circles[i][1] - circles[i][2] > height) {
            circles[i][0] = Math.random() * width;
            circles[i][2] = Math.random() * 100;
            circles[i][1] = 0 - circles[i][2];
            circles[i][3] = Math.random() / 2;
        }
        else {
            circles[i][1] += e;
        }
    }
};

//--------------------------------------------------
// PLAYER
//--------------------------------------------------

var player = new (function(){
    var that = this;
    that.image = new Image();

    that.image.src = "green.png"
    that.width = 65;
    that.height = 95;
    that.frames = 1;
    that.actualFrame = 0;
    that.X = 0;
    that.Y = 0;
    that.actions = [];

    that.setPosition = function(x, y){  //sets location
        that.X = x;
        that.Y = y;
    }

    that.isJumping = false;
    that.isFalling = false;
    that.jumpSpeed = 0;
    that.fallSpeed = 0;

    that.jump = function() {
        
        if (!that.isJumping && !that.isFalling) {   //on the ground and you just pressed jump
            that.fallSpeed = 0;
            that.isJumping = true;
            that.jumpSpeed = 17;
        }
        
    }

    that.checkJump = function() {
        //if (that.Y > height*0.4) {  
            //if player is under about half of the screen - let him move  
            that.setPosition(that.X, that.Y - that.jumpSpeed);          
        /*
        } else {  
            //in other dont move player up, move platforms and circles down instead  
            //MoveCircles(that.jumpSpeed * 0.5);   
            //clouds are in the background, further than platforms and player, so we will move it with half speed  
          
            platforms.forEach(function(platform, ind){  
                platform.y += that.jumpSpeed;  
  
                if (platform.y > height) {  
                //if platform moves outside the screen, we will generate another one on the top  
                    var type = ~~(Math.random() * 5);  
                    if (type == 0)   
                        type = 1;  
                    else   
                        type = 0;  
                    platforms[ind] = new Platform(Math.random() * (width - platformWidth), platform.y - height, type);  
                }  
            });  
        } */ 
      
      
        that.jumpSpeed--;  
        if (that.jumpSpeed == 0) {  
            that.isJumping = false;  
            that.isFalling = true;  
            that.fallSpeed = 1;  
        }  
    }

    that.fallStop = function(){
        that.isFalling = false;
        that.fallSpeed = 0;
        //that.jump();
    }

    that.checkFall = function(){
        if (that.Y < height - that.height) {
            that.setPosition(that.X, that.Y + that.fallSpeed);
            that.fallSpeed++;
        } else {
            that.fallStop();
        }
    }

    that.moveLeft = function(){
        if (that.X > 0) {
            that.setPosition(that.X - 5, that.Y);
        }
    }

    that.moveRight = function(){
        if (that.X + that.width < width) {
            that.setPosition(that.X + 5, that.Y);
        }
    }



    that.interval = 0;
    that.draw = function(){
        try {
            ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
        }
            catch (e) {
        };

        if (that.interval == 4 ) {
            if (that.actualFrame == that.frames) {
                that.actualFrame = 0;
            }
            else {
                that.actualFrame++;
            }
            that.interval = 0;
        }
        that.interval++;
    }
})();   //end player

player.setPosition(~~((width-player.width)/2), ~~((height - player.height)));   //starting position TODO: Move this

//--------------------------------------------------
// KEYS
//--------------------------------------------------

document.onkeydown = function(e){
    var evtobj=window.event? event : e; //distinguish between IE's explicit event object (window.event) and Firefox's implicit.
    var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var actualkey=String.toUpperCase(String.fromCharCode(unicode));
    
    if(actualkey=='A'){
        //player.moveLeft();
        player.actions.push('moveleft');
    }else if(actualkey=='D'){
        //player.moveRight();
        player.actions.push('moveright');
    }else if(actualkey=='W'){
        //player.jump();
        player.actions.push('jump');
    }
}

//--------------------------------------------------
// PLATFORMS
//--------------------------------------------------

var nrOfPlatforms = 1,
platforms = [],
platformWidth = 70,
platformHeight = 20;

var Platform = function(x, y, type){
    var that=this;

    that.firstColor = '#FF8C00';
    that.secondColor = '#EEEE00';
    that.onCollide = function(){
        player.fallStop();
    };

    if (type === 1) {
        that.firstColor = '#AADD00';
        that.secondColor = '#698B22';
        that.onCollide = function(){
            player.fallStop();
            player.jumpSpeed = 50;
        };
    }



that.x = ~~ x;
that.y = y;
that.type = type;

that.draw = function(){
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    var gradient = ctx.createRadialGradient(that.x + (platformWidth/2), that.y + (platformHeight/2), 5, that.x + (platformWidth/2), that.y + (platformHeight/2), 45);
    gradient.addColorStop(0, that.firstColor);
    gradient.addColorStop(1, that.secondColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(that.x, that.y, platformWidth, platformHeight);
};

    return that;
};//end var Platform

var generatePlatforms = function(){
    var position = 0, type;
    for (var i = 0; i < nrOfPlatforms; i++) {
        type = ~~(Math.random()*5);
        if (type == 0){
            type = 1;
        }else{
            type = 0;
        }
        platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
        if (position < height - platformHeight){
            position += ~~(height / nrOfPlatforms);
        }
    }
}();

//--------------------------------------------------
// MISC
//--------------------------------------------------

var checkCollision = function(){
    platforms.forEach(function(e,  ind){
    if (
        (player.isFalling) &&
        (player.X < e.x + platformWidth) &&
        (player.X + player.width > e.x) &&
        (player.Y + player.height > e.y) &&
        (player.Y + player.height < e.y + platformHeight)
    ) {
        e.onCollide();
    }
})
}

var GameLoop = function(){
    clear();        //Draw background box
    //MoveCircles(5);
    DrawCircles();
    
    if (player.isJumping){
        player.checkJump();
    }
    
    if (player.isFalling){
        player.checkFall();    
    }    
    
    platforms.forEach(function(platform){   //draw all the platforms
        platform.draw();
    });

    checkCollision();   //check if player hits platforms.
    
    player.draw();
    gLoop = setTimeout(GameLoop, 1000 / 50);
}

GameLoop();