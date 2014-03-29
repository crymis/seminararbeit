window.performanceDemos["canvas"] = function($, callback) {
    var cEl = $('<canvas width="'+window.demoWidth+'" height="'+window.demoHeight+'" />');
    var context = cEl[0].getContext("2d");
    var img = new Image();
    
    function drawIt(objects) {
        context.clearRect ( 0 , 0 , window.demoWidth , window.demoHeight );
        for(var i=0;i<objects.length;i++) {
            var objectToDraw = objects[i];
            context.drawImage(img, objectToDraw.x, objectToDraw.y);
        }
    }
    
    img.onload = function() {
        callback(drawIt);
    };
    
    
    
    
    this.append(cEl);
    //drawing will start if img is loaded
    img.src = "img/smiley.png";
};