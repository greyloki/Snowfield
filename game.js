var width = 320,
height = 500,
gLoop,
c = document.getElementById('c'),
ctx = c.getContext('2d'),
DoAction="";

c.width = width;
c.height = height;

var clear = function(){
    ctx.fillStyle = '#eeeeee';  //d0e7f9
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
}

var Point = function(x,y){
    this.x = x;
    this.y = y;
}

var Rect = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w; //width
    this.h = h; //height
    this.r = this.x+this.w; //right side
    this.b = this.y+this.h; //bottom
}


//--------------------------------------------------
// PLAYER
//--------------------------------------------------

var player = new (function(){
    var that = this;
    that.image = new Image();

    that.image.src = "blackbox.png"
    that.width = 32;
    that.height = 32;
    that.frames = 0;
    that.actualFrame = 0;
    that.X = 0;
    that.Y = 0;
    that.actions = [];
    that.TL = [0,0];
    that.TM = [0,0];
    that.TR = [0,0];
    that.CL = [0,0];
    that.CR = [0,0];
    that.BL = [0,0];
    that.BM = [0,0];
    that.BR = [0,0];

    that.setPosition = function(x, y){  //sets location
        that.X = x;
        that.Y = y;
    }
    
    that.setPoints = function(){
        that.TL = [that.X,                  that.Y];
        that.TM = [that.X+(that.width/2),   that.Y];
        that.TR = [that.X+that.width,       that.Y];
        
        that.CL = [that.X,                  that.Y+(that.height/2)];
        that.CR = [that.X+that.width,       that.Y+(that.height/2)];
        
        that.BL = [that.X,                  that.Y+that.height];
        that.BM = [that.X+(that.width/2),   that.Y+that.height];
        that.BR = [that.X+that.width,       that.Y+that.height];
        console.log(that.TL+" : "+that.TM+" : "+that.TR);
        console.log(that.CL+" : 000,000 : "+that.CR);
        console.log(that.BL+" : "+that.BM+" : "+that.BR);
        console.log("\n");
        
    }

    that.isJumping = false;
    that.isFalling = false;
    that.isLeft = false;
    that.isRight = false;
    that.jumpSpeed = 0;
    that.jumpMax = 15;
    that.fallSpeed = 0;
    that.moveSpeed = 5;
    that.isColliding = false;

    that.interval = 0;
    that.draw = function(){ //this function gets called each frame
        while(that.actions.length > 0){
            DoAction = that.actions.pop();
            
            switch(DoAction){
                case "moveLeft":
                    that.isLeft = true;
                    break;
                
                case "moveRight":
                    that.isRight = true;  
                    break;
                
                case "stopLeft":
                    that.isLeft = false;
                    break;
                
                case "stopRight":
                    that.isRight = false;  
                    break;
                
                case "collide":
                    that.isColliding = true;
                    break;
                
                case "stopFalling":
                    that.isFalling = false;
                    that.isJumping = false;
                    //that.fallSpeed = 0;
                    that.jumpSpeed = 0;
                    break;

                
                case "Jump":
                    if (!that.isJumping && !that.isFalling) {   //on the ground and you just pressed jump
                        console.log("Jump!");
                        //that.fallSpeed = 0;
                        that.isJumping = true;
                        that.jumpSpeed = that.jumpMax;
                    }
                    break;
                
                default:
                    console.log("Unknown Command: "+DoAction);
                    break;
            }//end action switch
            
        }//end loop
            
        if (that.isJumping){
            that.Y -= that.jumpSpeed;
            that.jumpSpeed--;  
            if (that.jumpSpeed == 0) {  
                that.isJumping = false;  
                //that.isFalling = true;  
                that.fallSpeed = 1;  
            }  
        }else{
            if (that.Y < height - that.height) {
                that.Y += that.fallSpeed;
                if(that.fallSpeed <= that.jumpMax){
                    that.fallSpeed++;    
                }
            } else {    //stops at the ground
                //that.isFalling = false;
                that.fallSpeed = 0;
            }              
        }
        
        if (that.isLeft){
            if( (that.X-that.moveSpeed) > 0  ){ //if this not land us left of the wall
                //if( CheckNewCollision(new Point(), new Rect()  ))
                that.X -= that.moveSpeed;
            }else{
                that.X = 0;
            }            
        }
        
        if (that.isRight){
            if( (that.X+that.moveSpeed) < (width-that.width)  ){ //if this not land us right of the wall
                that.X += that.moveSpeed;
            }else{
                that.X = width-that.width;
            }              
        }
        
        if(that.isJumping || that.isFalling){
            that.image.src = "greenbox.png";
        }else{
            that.image.src = "blackbox.png";
        }
        
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

qwer = new Point(5,6);
console.log(qwer);


//--------------------------------------------------
// KEYS
//--------------------------------------------------

document.onkeydown = function(e){
    var evtobj=window.event? event : e; //distinguish between IE's explicit event object (window.event) and Firefox's implicit.
    var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var actualkey=(String.fromCharCode(unicode));
    
    if(actualkey=='A'){
        player.actions.push('moveLeft');
    }else if(actualkey=='D'){
        player.actions.push('moveRight');
    }else if(actualkey=='W'){
        player.actions.push("Jump");
    }else if(actualkey=='Q'){
        player.setPoints();
    }else if(actualkey=='E'){
      
    }
}

document.onkeyup = function(e){
    var evtobj=window.event? event : e; //distinguish between IE's explicit event object (window.event) and Firefox's implicit.
    var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var actualkey=(String.fromCharCode(unicode));
    
    if(actualkey=='A'){
        player.actions.push('stopLeft');
    }else if(actualkey=='D'){
        player.actions.push('stopRight');
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
        player.actions.push("stopFalling");
        console.log("Collision");
    };



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
/*
    var position = 0, type;
    for (var i = 0; i < nrOfPlatforms; i++) {
        type = ~~(Math.random()*5);
        platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
        if (position < height - platformHeight){
            position += ~~(height / nrOfPlatforms);
        }
    }
 */
    platforms[0]=new Platform(0,height-platformHeight-5,0);
}();

//--------------------------------------------------
// MISC
//--------------------------------------------------

var checkCollision = function(){
    platforms.forEach(function(e,  ind){
    if (
        //(player.isFalling) &&
        (player.X < e.x + platformWidth) &&
        (player.X + player.width > e.x) &&
        (player.Y + player.height > e.y) &&
        (player.Y + player.height < e.y + platformHeight)
    ) {
        player.actions.push("collide");
        //e.onCollide();
    }
})
}

var CheckNewCollision = function(p,r){
    return (
            (r.x <= p.x) && (p.x <= (r.x + r.w ))
            )
    && ((r.y <= p.y) && (p.y <= (r.y + r.h)));
}


var GameLoop = function(){
    clear();        //Draw background box
 
    platforms.forEach(function(platform){   //draw all the platforms
        platform.draw();
    });

    checkCollision();   //check if player hits platforms.
    
    player.draw();
    gLoop = setTimeout(GameLoop, 1000 / 50);
}

GameLoop();