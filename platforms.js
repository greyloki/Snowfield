
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