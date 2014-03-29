window.performanceDemos["dom"] = function($, callback) {
    var cEl = this;
    var domObjects = [];
    
    function createDOMElementForObject(objectToDraw) {
        var imgEl = document.createElement("img");
        imgEl.setAttribute("class", "smileyEl");
        imgEl.setAttribute("src", "img/smiley.png");
        imgEl.setAttribute("style","left:"+objectToDraw.x+"px;top:"+objectToDraw.y+"px");
        cEl.append(imgEl);
        return imgEl;
    }
    
    function drawIt(objects) {
        if(domObjects.length == 0) {
            for(var i=0;i<objects.length;i++) {
                domObjects.push(createDOMElementForObject(objects[i]));
            }
        }
        for(var i=0;i<objects.length;i++) {
            var objectToDraw = objects[i];
            var correspondingDOMEl = domObjects[i];
            correspondingDOMEl.setAttribute("style","left:"+objectToDraw.x+"px;top:"+objectToDraw.y+"px");
        }
    }
    
    callback(drawIt);
    
    this.append(cEl);
};