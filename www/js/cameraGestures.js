// Gesture handling function for camera view.
// Written by GRP Team 3

var element;
var ticking = false;
var manager;

var curZoom = 1;
var lastZoom = 1;
var maxZoom;

const multiplier = 32;


function camGestureInit(element) {
    manager = new Hammer.Manager(element, {recognizers: []});
    manager.add(new Hammer.Pinch({ threshold: 0 }));
    manager.add(new Hammer.Tap({taps: 1}));

    manager.on("pinchstart pinchmove pinchend", zoom);
    manager.on("tap", snap);

    CameraPreview.getMaxZoom(function(maxZ) {
        maxZoom = maxZ;
    });

    CameraPreview.getZoom(function(z){
        curZoom = z;
    });

}

function snap(ev) {
    capture();
}

function zoom(ev) {
    if(ev.type == 'pinchstart') {
        console.log("started");
    }

    if (ev.type == 'pinchend') {
        lastZoom = curZoom + lastZoom;
        if (lastZoom < 1) {
            lastZoom = 1;
        }
        if (lastZoom > maxZoom) {
            lastZoom = maxZoom;
        }
        return;
    }

    if (ev.scale > 1) {
        curZoom = Math.floor((ev.scale - 1) * multiplier);        
    } else {
        curZoom = -Math.floor(((1 / ev.scale) - 1) * multiplier);
    }

    curZoom2 = curZoom + lastZoom;

    if(curZoom2 < 1) {
        curZoom2 = 1;
    } 

    if(curZoom2 > maxZoom) {
        curZoom2 = maxZoom;
    }

    CameraPreview.setZoom(curZoom2);

}