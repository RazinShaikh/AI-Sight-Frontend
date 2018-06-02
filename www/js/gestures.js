var element, element2;
var manager;

function gesturesInit(element, element2) {
    this.element = element;
    this.element2 = element2;

    manager = new Hammer.Manager(element, {recognizers: []});
    manager.add(new Hammer.Tap({ event: 'singletap', taps: 1 }));
    manager.on("singletap", onTap);

    console.log("initialized");
}

function onTap(ev) {
    console.log("going to camera...");
    $$('#imgjs').hide();
    $$('#camCanvas').hide();
    $$('#clickarea').show();
    cameraOrResult = true;
    tapToDet = true;
    tapToDetect();
}

function gesturesDestroy() {
    manager.destroy();
}
