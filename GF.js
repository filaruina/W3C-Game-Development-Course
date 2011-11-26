var GF = function () {  
    var mainScreen = null,  
    //main screen is the place where we will render our game, it will be independent from the fpsContainer  
    states = {},  
    //we will store currently pressed keys in the states object  
    frameCount = 0,  
    fps = 0,  
    lastTime = +(new Date()),  
    fpsContainer = null,  
    isJumping = false,
    isFalling = false,
    jumpSpeed = 0,
    fallSpeed = 0,
    player = null,        //player element  
    playerPosition = {    //player position & size  
        x: 100,
        y: 200,
        width: 50,  
        height: 50  
    },  
    transformSupport = false, //method of moving player - Changed to false to force absolute positioning
    step = 10,                //how many pixel player will move on each frame  
    platform = null,  
    platformPosition = {  //platform position & size  
        x: 200,  
        y: 220,  
        width: 150,  
        height: 50  
    };
    
    var MeasureFPS = function () {  
        var newTime = +(new Date());  
        var diffTime = ~~ ((newTime - lastTime));  

        if (diffTime >= 1000) {  
            fps = frameCount;  
            frameCount = 0;  
            lastTime = newTime;  
        }  

        fpsContainer.innerHTML = 'FPS: ' + fps;  
        frameCount++;  
    };  

    var jump = function() {    
        if (!isJumping && !isFalling) {    
            fallSpeed = 0;    
            isJumping = true;    
            jumpSpeed = 22;    
        }    
    };    

    var checkJump = function() {    
        playerPosition.y -= jumpSpeed;
        if (jumpSpeed == 0) {    
            isJumping = false;    
            isFalling = true;    
        } else if (jumpSpeed > 0) {
            jumpSpeed--;
        }
    };    

    var fallStop = function() {
        isFalling = false; 
        fallSpeed = 1; 
    };

    var checkFall = function() {
        if (
            checkCollision(playerPosition, platformPosition)
        ) {
            playerPosition.y = platformPosition.y - playerPosition.height;
            fallStop();
            return;
        }

        if (playerPosition.y + playerPosition.height < 330) {
            playerPosition.y += fallSpeed;    
            fallSpeed++;    
        } else {    
            fallStop();    
        }    
    };

    var detectPropertyPrefix = function(property) {  
        var prefixes = ['Moz', 'Ms', 'Webkit', 'O'];  
        for (var i=0, j=prefixes.length; i<j; i++) {  
            if (typeof document.body.style[prefixes[i]+property] !== 'undefined') {  
                return prefixes[i]+property;  
            }  
        }  
        return false;  
    };  

    var moveObject = function(object, x, y) {
        if (transformSupport === false) {  
            object.style.top = y + "px";  
            object.style.left = x + "px";  
        } else {  
            object.style[transformSupport] = 'translate(' + x + 'px, ' + y + 'px)';  
        }
    };  

    var mainLoop = function () {  
        MeasureFPS();  

        //update player position on each frame  
        if (states.left) {  
            playerPosition.x -= step;  
        }  

        if (states.right) {  
            playerPosition.x += step;  
        }  

        moveObject(player, playerPosition.x, playerPosition.y)  
        checkJump();
        checkFall();
        loop(mainLoop);  
    }; 

    var loop = (function () {  
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||  
            function ( /* function */ callback, /* DOMElement */ element) {  
            window.setTimeout(callback, 1000 / 60);  
        };  
    })();  

    var checkCollision = function(object1, object2) { //return 'true' if colliding, 'false' if not.  
        if (!(  
             (object1.y > object2.y+object2.height) ||  
             (object1.y+object1.height < object2.y) ||  
             (object1.x > object2.x+object2.width) ||  
             (object1.x+object1.width < object2.x)  
        )){  
            return true;  
        }  

        return false;  
    }

    var start = function () {  
        //features detection  
        /*
         * Removing this since the transform isnt working properly on chrome linux
        transformSupport = detectPropertyPrefix('Transform');  
        */
        //create main screen  
        mainScreen = document.createElement('div');  
        mainScreen.id = 'mainScreen';
        document.body.appendChild(mainScreen);  

        //create player  
        player = mainScreen.appendChild(document.createElement('div'));  
        player.id = 'player';  

        //create platform  
        platform = mainScreen.appendChild(document.createElement('div'));  
        platform.id = 'platform';  
        platform.style.width = platformPosition.width + "px";  
        platform.style.height = platformPosition.height + "px";  
        moveObject(platform, platformPosition.x, platformPosition.y);  

        //add the listener to the main, window object, and update the states  
        window.addEventListener('keydown', function (event) {  
            if (event.keyCode === 37) {  
                states.left = true;  
            }  
            if (event.keyCode === 38) {  
                jump();
            }  
            if (event.keyCode === 39) {  
                states.right = true;  
            }  
            if (event.keyCode === 40) {  
                states.down = true;  
            }  
        }, false);  

        //if the key will be released, change the states object  
        window.addEventListener('keyup', function (event) {  
            if (event.keyCode === 37) {  
                states.left = false;  
            }  
            if (event.keyCode === 39) {  
                states.right = false;  
            }  
            if (event.keyCode === 40) {  
                states.down = false;  
            }  
        }, false);  

        fpsContainer = document.createElement('div');  
        document.body.appendChild(fpsContainer);  
        loop(mainLoop);  
    };  

    //our GameFramework returns public API visible from outside scope  
    return {  
        start: start
    }  
}  

var game = new GF();  
game.start();
