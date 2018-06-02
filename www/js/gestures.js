// Main gesture handling function.
// Written by GRP Team 3

var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var element, element2;
var ticking = false;
var cur_x = 0;
var cur_y = 0;
var last_x = 0;
var last_y = 0;
var max_x = 0;
var max_y = 0;
var transform;
var visibility = "visible";
var opacity = 1;
var manager;

function gesturesInit(element, element2) {
    this.element = element;
    this.element2 = element2;

    this.last_x = Math.round((window.innerWidth - element.offsetWidth) / 2);
    this.last_y = Math.round((window.innerHeight - element.offsetHeight) / 2);

    this.transform = {
        translate: { x: cur_x, y: cur_y },
        scale: 1
    };

    this.element.classList.add("animate");

    manager = new Hammer.Manager(element, {recognizers: []});

    manager.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    manager.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(manager.get('pan'));
    var sTap = new Hammer.Tap({ event: 'singletap', taps: 1 });
    var dTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
    manager.add([dTap, sTap]);
    
    dTap.recognizeWith(sTap);
    sTap.requireFailure(dTap);

    manager.on("panstart panmove", onPan);
    manager.on("panend", onPanEnd);
    manager.on("pinchstart pinchmove", onPinch);
    manager.on("singletap", onTap);
    manager.on("doubletap", onDoubleTap);

    console.log("initialized");
}


function updateElementTransform() {
    var value = [
                'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
                'scale(' + transform.scale + ', ' + transform.scale + ')'
    ];
    
    value = value.join(" ");

    element.style.webkitTransform = value;
    element.style.mozTransform = value;
    element.style.transform = value;

    if (element2) {
        element2.style.webkitTransform = value;
        element2.style.mozTransform = value;
        element2.style.transform = value;
    }

    ticking = false;
}

function updateElementVisibility() {
    if (element2) {
        element2.style.visibility = visibility;
        element2.style.opacity = opacity;
    }
    ticking = false;
}

function requestElementUpdate(updateElement) {
    if(!ticking) {
        reqAnimationFrame(updateElement);
        ticking = true;
    }
}


var initScale = 1;
function onPinch(ev) {
    if(ev.type == 'pinchstart') {
        initScale = transform.scale || 1;
    }

    element.classList.remove("animate");
    if (element2)
        element2.classList.remove("animate");

    transform.scale = initScale * ev.scale;
    if (transform.scale < 1) {
        transform.scale = 1;
    } else if (transform.scale > 4) {
        transform.scale = 4;
    }

    requestElementUpdate(updateElementTransform);
}

function onPan(ev) {
    element.classList.remove("animate");
    if (element2)
        element2.classList.remove("animate");

    if (transform.scale != 1) {
        cur_x = last_x + ev.deltaX;
        cur_y = last_y + ev.deltaY;
        max_x = Math.ceil((transform.scale - 1) * element.clientWidth / 2);
        max_y = Math.ceil((transform.scale - 1) * element.clientHeight / 2);

        if (cur_x > max_x) {
            cur_x = max_x;
        }
        if (cur_x < -max_x) {
            cur_x = -max_x;
        }
        if (cur_y > max_y) {
            cur_y  = max_y;
        }
        if (cur_y < -max_y) {
            cur_y = -max_y;
        }

        transform.translate = {
            x: cur_x,
            y: cur_y
        };
        
    }

    requestElementUpdate(updateElementTransform);
}

function onPanEnd(ev) {
    last_x = cur_x <= max_x ? cur_x : max_x;
    last_y = cur_y <= max_y ? cur_y : max_y;
}

function onDoubleTap(ev) {
    element.classList.add("animate");
    if (element2)
        element2.classList.add("animate");
    
    if (transform.scale >= 2) {
        transform.scale = 1;
        cur_x = 0;
        cur_y = 0;
        transform.translate = {
            x: cur_x,
            y: cur_y
        };
    } else {
        transform.scale = 2;
    }

    requestElementUpdate(updateElementTransform);
}

function onTap(ev) {
    element.classList.add("animate");
    if (element2)
        element2.classList.add("animate");

    console.log("tapping");

    if (opacity == 1) {
        opacity = 0;
        visibility = "hidden";
    } else {
        opacity = 1;
        visibility = "visible";
    }

    requestElementUpdate(updateElementVisibility);
    tapToDet = false;
}

function gesturesDestroy() {
    manager.destroy();
}