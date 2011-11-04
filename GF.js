var GF = function(){
    var options = {},
    gameElements = [],
    mainScreen = null, //main screen is the place where we will render our game, it will be independent from the fpsContainer
    states = {}, //we will store currently pressed keys in the states object
    frameCount = 0,
    fps = 0,
    fpsContainer = null,
    lastTime = +(new Date());

    var mainLoop = function(){
        //main function, called each frame
        MeasureFPS();

        for (var i = 0; i < gameElements.length; i++) {
            var currentEl = gameElements[i];
            var computedStyle = window.getComputedStyle(currentEl);

            if (states.left) {
                currentEl.style.left = computedStyle.left - 2;
            } else if (states.up) {
                currentEl.style.top = computedStyle.top - 2;
            } else if (states.right) {
                currentEl.style.left = computedStyle.left + 2;
            } else if (states.down) {
                currentEl.style.top = computedStyle.top + 2;
            }
        }

        loop(mainLoop);
    }

    var MeasureFPS = function(){
        var newTime = +(new Date());
        var diffTime = newTime - lastTime; //calculate the difference between last & current frame

        if (diffTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }

        if (fpsContainer !== null) {
            fpsContainer.innerHTML = 'FPS: ' + fps;
        }

        frameCount++;
    };

    var loop = (function(){
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    var addEvent = function(obj, type, fn) {
        if (obj.attachEvent) {
            obj.attachEvent(type, fn);
        } else {
            obj.addEventListener(type, fn, false);
        }
    };

    var createScreen = function(parentElement) {
        mainScreen = document.createElement('div');
        mainScreen.style.width = "200px";
        mainScreen.style.height = "200px";
        mainScreen.style.top = "0";
        mainScreen.style.left = "0";
        document.body.appendChild(mainScreen);
        for (var i = 0; i < gameElements.length; i++) {
            mainScreen.appendChild(gameElements[i]);
        }
    };

    var start = function(opt){
        if (opt !== undefined) {
            options = opt; //Some options
        }

        //create main screen
        createScreen(document.body);
        //add the listener to the main, window object, and update the states
        addEvent(window, 'keydown', function(event) {
            if (event.keyCode === 37) {
                states.left = true;
            } else if (event.keyCode === 38) {
                states.up = true;
            } else if (event.keyCode === 39) {
                states.right = true;
            } else if (event.keyCode === 40) {
                states.down = true;
            }
        });

        //if the key will be released, change the states object
        addEvent(window, 'keyup', function(event){
            if (event.keyCode === 37) {
                states.left = false;
            } else if (event.keyCode === 38) {
                states.up = false;
            } else if (event.keyCode === 39) {
                states.right = false;
            } else if (event.keyCode === 40) {
                states.down = false;
            }
        });
        
        if (options.debug === true) {
            fpsContainer = document.createElement('div');
            document.body.appendChild(fpsContainer);
        }

        loop(mainLoop);
    };

    //our GameFramework returns public API visible from outside scope
    return {
        start: start,
        //Just a simple function to have a nice way to create elements
        //I would like to put the events here, but no time =/
        createElement: function(definitions) {
            var gameEl = document.createElement(definitions.domEl);
            for (var key in definitions.style) {
                gameEl.style[key] = definitions.style[key];
            }
            gameElements.push(gameEl);
            return gameEl;
        }
    }
}
