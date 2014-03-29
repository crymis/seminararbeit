window.performanceDemos = {};
window.demoWidth = -1;
window.demoHeight = -1;

(function($) {
    var selectedDemo = "canvas";
    
    var maxVec = 10;
    var amountObjects = 10;
    var objectRadius = 10;
    
    var targetedF = 30;
    var fpsCounterInterval = 1000;
    
    //simulation-vars
    var runningSimulation = null;
    var lastWatch = window.performance.now();
    var fpsCounter = 0;
    
    function simulation(drawingFunction) {
        var objects = [];
        for(var i=0;i<amountObjects;i++) {
            objects.push({
                x: Math.random()*(window.demoWidth-4*objectRadius),
                y: Math.random()*(window.demoHeight-4*objectRadius),
                vecX: (Math.random()*maxVec)-(maxVec/2),
                vecY: (Math.random()*maxVec)-(maxVec/2)
            });
        }
        function tick() {
            for(var i=0;i<amountObjects;i++) {
                var objectToMove = objects[i];
                if(objectToMove.x+objectToMove.vecX+2*objectRadius > window.demoWidth || objectToMove.x+objectToMove.vecX < 0) {
                    objectToMove.vecX *= -1;
                }
                if(objectToMove.y+objectToMove.vecY+2*objectRadius > window.demoHeight || objectToMove.y+objectToMove.vecY < 0) {
                    objectToMove.vecY *= -1;
                }
                objectToMove.x += objectToMove.vecX;
                objectToMove.y += objectToMove.vecY;
            }
            drawingFunction(objects);
            fpsCounter++;
        }
        runningSimulation = setInterval(tick, targetedF);
    }
    
    
    function fpsWatcher() {
        var currentFPS = fpsCounter;
        fpsCounter = 0;
        var currentTime = window.performance.now();
        var lastlastWatch = lastWatch;
        lastWatch = currentTime;
        return currentFPS / ((currentTime - lastlastWatch) / 1000);
    }
    
    $(document).ready(function() {
        var counterEl = $('#fps-counter');
        $('#demo-nav li').click(function (){
            $(this).addClass("active").siblings().removeClass("active");
            $('#democontainer').html("");
            selectedDemo = $(this).attr("data-show");
        });
        
        $('#stop-button').click(function (e){
            $('#democontainer').html("");
            if(runningSimulation != null) {
                clearInterval(runningSimulation);
            }
            e.preventDefault();
        });
        
        $('#start-button').click(function (e){
            $('#democontainer').html("");
            if(runningSimulation != null) {
                clearInterval(runningSimulation);
            }
            amountObjects = parseInt($('#amountObjects').val());
            targetedF = 1000/parseInt($('#fps').val());
            window.demoWidth = $('#democontainer').width();
            window.demoHeight = $('#democontainer').height();
            //trigger demo
            if(typeof window.performanceDemos[selectedDemo] != "function") {
                alert("Not yet implemented");
            } else {
                window.performanceDemos[selectedDemo].call($('#democontainer'),$, simulation);
            }
            e.preventDefault();
        });
        
        setInterval(function() {
            counterEl.html("<i class='glyphicon glyphicon-eye-open'></i> FPS: "+fpsWatcher());
        }, fpsCounterInterval);
    });
})(jQuery);
    
