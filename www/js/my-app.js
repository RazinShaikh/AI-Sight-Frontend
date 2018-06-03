addr = prompt("Enter ip addr");

const serverAddr = "http://"+addr+":8000/"; // \text
// const serverAddr = "http://10.6.1.101:8000/img/";

console.log(serverAddr);

document.addEventListener("deviceready", onDeviceReady, false);

// Initialize app
var myApp = new Framework7({
    pushState: true,
    material:true,
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    domCache: true  ,
    dynamicNavbar: true
});

var cameraOrResult = true; // true = camera page, false = result page.
var tapToDet = true;
var processText = false;

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

    tapToDetect();

        myApp.onPageAfterAnimation('index', function (page){
            $$('.page-on-left').remove();
            var clickarea = document.getElementById('clickarea');
            camGestureInit(clickarea);
        });

    }

function speakResults(results) {
    var i = 0;
    var s = function () {
        if (i < results.length) {
            i++;
            TTS.speak(results[i-1].split(":")[0], s, errorPrint);
        }
    };

    s();
}

async function tapToDetect()
{
    await sleep(2500);
    if (tapToDet) {
        TTS.speak("Tap to detect.", tapToDetect, errorPrint);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function capture() {
    myApp.showIndicator();
    alert(processText);
    console.log("function called.");
    CameraPreview.takePicture({},function(base64Img) {
        b64src = 'data:image/jpeg;base64,'+base64Img;
        $$('#clickarea').hide();
        $$('#imgjs').show();
        $$('#imgjs').attr('src',b64src);
        sendImage(base64Img);
        cameraOrResult = false;
        tapToDet = false;
    });
}

function sendImage(image_b64) {
    console.log("Sending image...");
    var imgdata = '{ "img" : "' + image_b64 + '" }';
    if(processText){
        var address = serverAddr + "text/"
    }else{
        var address = serverAddr + "img/"
    }

    $$.ajax({
        datatype: 'json',
        type: 'POST',
        data: imgdata,
        url: address,
        success: function(result) {
            if( !processText )
              handleResponse(image_b64, result);
            else {
              handleText(result);
            }
        },
        error: function(){
            alert("Sorry, something went wrong.");
            myApp.hideIndicator();
        }
    });
}

function handleText(text){
    $$('#camCanvas').show();

    gesturesInit(image, canvas);
    speakResults(text);
}

function handleResponse(base64Img, result) {
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

function errorPrint(error) {
    console.log("error: " + error);
}
