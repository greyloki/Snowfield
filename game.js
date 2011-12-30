var width = 800,
height = 600,
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
    this.width = w;
    this.height = h;
    this.r = x+w; //right side
    this.b = y+h; //bottom
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


    that.setPosition = function(x, y){  //sets location
        that.X = x;
        that.Y = y;
    }
    
    that.isJumping = false;
    that.isFalling = false;
    that.isLeft = false;
    that.isRight = false;
    that.isUp = false;
    that.isDown = false;
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
                
                case "moveUp":
                    that.isUp = true;
                    break;
                
                case "moveDown":
                    that.isDown = true;  
                    break;
                
                case "stopUp":
                    that.isUp = false;
                    break;
                
                case "stopDown":
                    that.isDown = false;  
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

/*            
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
*/        
        if (that.isLeft){
            that.X -= CheckMove(
                new Point(that.X-that.moveSpeed, that.Y), 
		new Point(that.X-that.moveSpeed, that.Y+(that.height/2) ), 
		new Point(that.X-that.moveSpeed,(that.Y+that.height)),
		"l",that.moveSpeed 
	    );
        }
        
        if (that.isRight){

            that.X += CheckMove(
                new Point(that.X+that.width+that.moveSpeed, that.Y), 
                new Point(that.X+that.width+that.moveSpeed, that.Y+(that.height/2) ), 
		new Point(that.X+that.width+that.moveSpeed,(that.Y+that.height)),  
		"r",that.moveSpeed
	    );            
            
            
        }
        
        if (that.isUp){
            that.Y -= CheckMove(
                new Point(that.X, that.Y-that.moveSpeed), 
		new Point(that.X+(that.width/2), that.Y-that.moveSpeed), 
		new Point(that.X+that.width, that.Y-that.moveSpeed),
		"u",that.moveSpeed
            );   
        }        
        
        if (that.isDown){
            that.Y +=CheckMove(
                new Point(that.X, that.Y+that.height+that.moveSpeed), 
                new Point(that.X+(that.width/2), that.y+that.height+that.moveSpeed), 
		new Point(that.X+that.width, that.y+that.height+that.moveSpeed),
		"d",that.moveSpeed  
	    );    
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

player.setPosition(~~((width-player.width)/2), ~~((height - player.height)/2));   //starting position TODO: Move this


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
        player.actions.push("moveUp");    //Jump
    }else if(actualkey=='S'){
        player.actions.push("moveDown");
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
    }else if(actualkey=='W'){
        player.actions.push('stopUp');
    }else if(actualkey=='S'){
        player.actions.push('stopDown');
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
    this.width = 70;
    this.height=20;
    
    that.width = 70;
    that.height=20;

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
        var gradient = ctx.createRadialGradient(that.x + (that.width/2), that.y + (that.height/2), 5, that.x + (that.width/2), that.y + (that.height/2), 45);
        gradient.addColorStop(0, that.firstColor);
        gradient.addColorStop(1, that.secondColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(that.x, that.y, that.width, that.height);
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
    platforms[0]=new Platform(20,height-platformHeight-5,0);
}();

//--------------------------------------------------
// MISC
//--------------------------------------------------

    var CheckMove = function(p1,p2,p3,dir,speed){
        var tempObj;
        var aHit = false;
        var hitP = new Point(0,0);
        var hitRect = new Rect(0,0,0,0);
			
            platforms.forEach(function(e,  ind){
		tempObj = new Rect(e.x,e.y,e.width,e.height);
                
                if( hitTestPoint(p1.x,p1.y,tempObj)   ){
		    console.log("Hit P1");
                    aHit=true;
                    hitP = p1;
                    
                    //xyz = FindAcceptable(tempObj,p1,dir,speed);
		}else if( hitTestPoint(p2.x,p2.y,tempObj)  ){
                    console.log("Hit P2");
                    aHit=true;
                    hitP = p2;
                    
                }else if(hitTestPoint(p3.x,p3.y,tempObj)){
                    console.log("Hit P3");
		    aHit=true;
                    hitP = p3;
                    
		}
                    
	    });
            //console.log("MoveIt: ",MoveIt);
        if(!aHit){return speed;}
        else{
            return FindAcceptable(tempObj,hitP,dir,speed);
        }
    }

    var hitTestPoint = function(px,py,Re){
        if ( ( (px >= Re.x) && (px <= Re.x+Re.width) ) && ( (py >= Re.y) &&  (py <= Re.y+Re.height) )){
            return true;
        }else{
            return false;
        }
    }

    var FindAcceptable = function (Obj,p1,dir,speed){
			
        var NP;
    	switch(dir){
		case "u":
		    NP = new Point(0,-1);
		    break;
		
                case "d":
                    NP = new Point(0,1);
                    break;
				
                case "l":
		    NP = new Point(-1,0);
		    break;
		
                case "r":
		    NP = new Point(1,0);
		    break;
		
                default:
		    NP = new Point(0,0);
		    break;
				
	}
        for(var q=speed;q>=0;q--){
	    if (!hitTestPoint(p1.x,p1.y,Obj)){
                console.log(Obj.x,p1.x,(Obj.x+Obj.width));
                console.log(Obj.y,p1.y,(Obj.y+Obj.height));
                console.log("");
                //console.log("returning ",q);
		return q;					
	    }else{
                console.log("Removing");
		p1.X -= NP.x;
		p1.Y -= NP.y;
	    }							
	}
    return 0;
    }



var GameLoop = function(){
    clear();        //Draw background box
 
    platforms.forEach(function(platform){   //draw all the platforms
        platform.draw();
    });
    
    player.draw();
    gLoop = setTimeout(GameLoop, 1000 / 50);
}

GameLoop();