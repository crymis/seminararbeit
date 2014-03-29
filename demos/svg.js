window.performanceDemos["svg"] = function($, callback) {
    var xmlns = "http://www.w3.org/2000/svg";
    var xlinkns = "http://www.w3.org/1999/xlink";
    
    var cEl = document.createElementNS(xmlns, "svg");
    cEl.setAttribute("width", window.demoWidth);
    cEl.setAttribute("height", window.demoHeight);
    
    var domObjects = [];
    
    function createSVGElementForObject(objectToDraw) {
        var imgEl = document.createElementNS(xmlns, "image");
        imgEl.setAttributeNS(null, "x",objectToDraw.x);
        imgEl.setAttributeNS(null, "y",objectToDraw.y);
        imgEl.setAttributeNS(null, "width",20);
        imgEl.setAttributeNS(null, "height",20);
        imgEl.setAttributeNS(xlinkns, "xlink:href", "img/smiley.png");
        cEl.appendChild(imgEl);
        return imgEl;
    }
    
    function drawIt(objects) {
        if(domObjects.length == 0) {
            for(var i=0;i<objects.length;i++) {
                domObjects.push(createSVGElementForObject(objects[i]));
            }
        }
        for(var i=0;i<objects.length;i++) {
            var objectToDraw = objects[i];
            var correspondingDOMEl = domObjects[i];
            correspondingDOMEl.setAttributeNS(null, "x",objectToDraw.x);
            correspondingDOMEl.setAttributeNS(null, "y",objectToDraw.y);
        }
    }
    
    callback(drawIt);
    
    this.append(cEl);
};