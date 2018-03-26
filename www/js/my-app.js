// var tmp = prompt("enter server address:");
const serverAddr = "http://10.6.1.101:8000/img/";
console.log(serverAddr);


document.addEventListener("deviceready", onDeviceReady, false);

// Initialize app
var myApp = new Framework7({
    pushState: true,
    swipePanel:'left',
    swipePanelActiveArea: 24,
    material:true,
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    domCache: true  ,
    dynamicNavbar: true
});

var cameraOrResult = true; // true = camera page, false = result page.

function onDeviceReady() {
    // Now safe to use device APIs

    var fileLocation;

    StatusBar.backgroundColorByHexString("#0097A7");

    CameraPreview.startCamera({
        camera: CameraPreview.CAMERA_DIRECTION.BACK,
        toBack: true,
        tapPhoto: true,
    });

    var clickarea = document.getElementById('clickarea');
    camGestureInit(clickarea);

    $$(document).on("click", "#openAlbum", function () {

        navigator.camera.getPicture(galleryImage, errorCallback, {
            quality: 50,
            sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM,
            destinationType: Camera.DestinationType.DATA_URL,
            correctOrientation: true
        });
    });


    function showDetectionResult(img_arg) {

        var imageJSON = JSON.parse(img_arg);
        var boxes = imageJSON.boxes;
        var scores = imageJSON.scores;
        var classes = imageJSON.classes;
        var display_string = imageJSON.display_string;
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');
        var image = document.getElementById("imgShow");

    
        canvas.width = $$("#imgShow").width();
        canvas.height = $$("#imgShow").height();
    
        drawBoxes(ctx, boxes, scores, classes, display_string, canvas.width, canvas.height);
    
        myApp.hideIndicator();

        gesturesInit(image, canvas);

        speakResults(display_string);
    
        insertEntry(fileLocation, boxes, scores, classes, display_string);
    }


    function errorCallback(err) {
        console.log("error: "+err);
    }

    myApp.onPageInit("history", function() {
        getHistory();
    });

    myApp.onPageAfterAnimation('index', function (page){
        $$('.page-on-left').remove();
    });

}

function speakResults(results) {
    var i = 0;
    var s = function () {
        if (i < results.length) {
            i++;
            TTS.speak(results[i-1].split(":")[0], s, err);
        }
    };

    function err(reason) {
        console.log("error: " + reason);
    }
    
    s();
}

function galleryImage(base64Img) {
    myApp.showIndicator();
    b64src = 'data:image/jpeg;base64,'+base64Img;
    $$('#clickarea').hide();
    $$('#imgjs').show();
    $$('#imgjs').attr('src',b64src);
    sendImage(base64Img);
    cameraOrResult = false;
}


function capture() {
    myApp.showIndicator();
    console.log("function called.");
    CameraPreview.takePicture({},function(base64Img) {
        b64src = 'data:image/jpeg;base64,'+base64Img;
        $$('#clickarea').hide();
        $$('#imgjs').show();
        $$('#imgjs').attr('src',b64src);
        sendImage(base64Img);
        cameraOrResult = false;
    });
}

function sendImage(image_b64) {
    console.log("Sending image...");
    var imgdata = '{ "img" : "' + image_b64 + '" }';
    $$.ajax({
        datatype: 'json',
        type: 'POST',
        data: imgdata,
        url: serverAddr,
        success: handleResponse,
        error: function(){
            myApp.dialog.alert("Sorry, something went wrong.", "Error");
            myApp.hideIndicator();
        }
    });
}

function handleResponse(result) {
    $$('#camCanvas').show();

    var imageJSON = JSON.parse(result);
    var boxes = imageJSON.boxes;
    var scores = imageJSON.scores;
    var classes = imageJSON.classes;
    var display_string = imageJSON.display_string;
    var canvas = document.getElementById('camCanvas');
    var ctx = canvas.getContext('2d');
    var image = document.getElementById('imgjs');

    canvas.width = $$("#imgjs").width();
    canvas.height = $$("#imgjs").height();

    drawBoxes(ctx, boxes, scores, classes, display_string, canvas.width, canvas.height);
    myApp.hideIndicator();

    gesturesInit(image, canvas);
    speakResults(display_string);
}

function captureButton() {
    if (cameraOrResult) {
        console.log("capturing...");
        capture();
    } else {
        console.log("going to camera...");
        gesturesDestroy();
        $$('#imgjs').hide();
        $$('#camCanvas').hide();
        $$('#clickarea').show();
        cameraOrResult = true;
    }
}


function showDetectionResult2(img_arg, searchTerm) {

    var imageJSON = JSON.parse(img_arg);
    var boxes = imageJSON.boxes;
    var scores = imageJSON.scores;
    var classes = imageJSON.classes;
    var display_string = imageJSON.display_string;
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    canvas.width = $$("#imgShow").width();
    canvas.height = $$("#imgShow").height();

    drawBoxes(ctx, boxes, scores, classes, display_string, canvas.width, canvas.height, searchTerm);
}

function drawBoxes(ctx, boxes, scores, classes, display_string, canvas_width, canvas_height, searchTerm) {
    var i, x, y, box_width, box_height;

    ctx.lineWidth = "5";
    var std_colors = [
        'AliceBlue', 'Chartreuse', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque',
        'BlanchedAlmond', 'BlueViolet', 'BurlyWood', 'CadetBlue', 'AntiqueWhite',
        'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan',
        'DarkCyan', 'DarkGoldenRod', 'DarkGrey', 'DarkKhaki', 'DarkOrange',
        'DarkOrchid', 'DarkSalmon', 'DarkSeaGreen', 'DarkTurquoise', 'DarkViolet',
        'DeepPink', 'DeepSkyBlue', 'DodgerBlue', 'FireBrick', 'FloralWhite',
        'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod',
        'Salmon', 'Tan', 'HoneyDew', 'HotPink', 'IndianRed', 'Ivory', 'Khaki',
        'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue',
        'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey',
        'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue',
        'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime',
        'LimeGreen', 'Linen', 'Magenta', 'MediumAquaMarine', 'MediumOrchid',
        'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen',
        'MediumTurquoise', 'MediumVioletRed', 'MintCream', 'MistyRose', 'Moccasin',
        'NavajoWhite', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed',
        'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed',
        'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple',
        'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Green', 'SandyBrown',
        'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue',
        'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'GreenYellow',
        'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White',
        'WhiteSmoke', 'Yellow', 'YellowGreen'
    ];

    for (i = 0; i < boxes.length; i++) {

        if (searchTerm && display_string[i].indexOf(searchTerm) == -1) {
            continue;
        }

        x = boxes[i][1] * canvas_width;
        y = boxes[i][0] * canvas_height;
        box_width = (boxes[i][3] - boxes[i][1]) * canvas_width;
        box_height = (boxes[i][2] - boxes[i][0]) * canvas_height;

        var color = std_colors[classes[i] % std_colors.length];

        ctx.beginPath();

        ctx.strokeStyle = color;
        ctx.rect(x, y, box_width, box_height);
        
        ctx.stroke();

        ctx.beginPath();

        ctx.fillStyle = color;
        var fSize = 20;
        ctx.font = "small-caps " + fSize + "px Arial";
        var textwidth = ctx.measureText(display_string[i].split(":")[0]).width;

        if(textwidth > box_width) {
            fSize = fSize * (box_width / textwidth);
            if(fSize < 12) { 
                fSize = 12;
            }
            ctx.font = "small-caps " + fSize + "px Arial";
            textwidth = ctx.measureText(display_string[i].split(":")[0]).width;
        }

        ctx.fillRect(x, y, textwidth+10, fSize+3);
        ctx.fillStyle = 'black';
        ctx.fillText(display_string[i].split(":")[0], x+3, y+fSize-3);        

        ctx.stroke();
    }
}




function showImageHistory(key, myJson, searchTerm) {
    var img = document.getElementById("img" + key);

    var popupHTML = '<div class="popup backGroundImage">' +
                    '    <div class="page-content page-content-for-send">' +
                    '        <img id="imgShow" class="imgShow imgCenter" />' +
                    '        <canvas id="myCanvas" class="myCanvas imgCenter"> </canvas>' +
                    '        <div href="#" class="close-popup">' +
                    '            <i class="icon material-icons md-dark md-30 closeIcon">cancel</i>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>';
                    
    myApp.popup(popupHTML);

    var image = document.getElementById("imgShow");
    var canvas = document.getElementById("myCanvas");
    image.src = img.src;
    
    showDetectionResult2(myJson, searchTerm);

    image.onload = function() {
        
        $$('.imgCenter').css('top', (window.innerHeight - image.height) / 2 + 'px');

        gesturesInit(image, canvas);
    };
}