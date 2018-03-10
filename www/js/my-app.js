document.addEventListener("deviceready", onDeviceReady, false);

// Initialize app
var myApp = new Framework7({
    swipePanel:'left',
    swipePanelActiveArea: 24,
    material:true,
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    domCache: true  ,
    dynamicNavbar: true
});

function onDeviceReady() {
    // Now safe to use device APIs

    // document.addEventListener('backbutton', function (e) {
    //     mainView.router.back();
    // });

    StatusBar.backgroundColorByHexString("#12a6b3");

    $$(document).on("click", "#getPhoto", function () {

        navigator.camera.getPicture(displayImage, errorCallback, {
            quality: 100,
            saveToPhotoAlbum: false, //added
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true
        });
    });

    $$(document).on("click", "#openAlbum", function () {

        navigator.camera.getPicture(displayImage, errorCallback, {
            quality: 50,
            sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true
        });
    });


    function displayImage(fileUri) {
        // mainView.router.load({pageName: 'send'});
        var popupHTML = '<div class="popup bg-black">' +
                        '    <div class="page-content page-content-for-send">' +
                        '        <img id="imgShow" class="imgShow hCenter vCenter" />' +
                        '        <canvas id="myCanvas" class="myCanvas hCenter vCenter"> </canvas>' +
                        '        <div href="#" class="close-popup">' +
                        '            <i class="icon material-icons md-dark closeIcon">cancel</i>' +
                        '        </div>' +
                        '        <!-- TODO: Use the send icon instead of button -->' +
                        '        <a href="#" id="sendButton" class="button button-big button-fill button-raised color-white sendButton  hCenter">' +
                        '            <span class="color-black">Detect</span>' +
                        '        </a>' +
                        '    </div>' +
                        '</div>';
                        
        myApp.popup(popupHTML);
        $$('#imgShow').attr('src', fileUri);

        $$('#sendButton').on("click", function() {
            $$('#sendButton').hide();
            myApp.showIndicator();
            sendImage(fileUri);
        });
    }

    function sendImage(fileUri) {
        window.resolveLocalFileSystemURL(
            fileUri,
            function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function() {
                        var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
                        var oReq = new XMLHttpRequest();
                        oReq.open("POST", "http://10.176.66.155:8000/img3/", true);

                        oReq.onload = function (oEvent) {
                            showDetectionResult(oReq.response);
                        };
                        // Pass the blob in to XHR's send method
                        oReq.send(blob);
                    };

                    reader.readAsArrayBuffer(file);

                }, errorCallback);
            },
            errorCallback);
    }

    function showDetectionResult(img_arg) {

        var imageJSON = JSON.parse(img_arg);
        var boxes = imageJSON.boxes;
        var scores = imageJSON.scores;
        var classes = imageJSON.classes;
        var display_string = imageJSON.display_string;
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');

        canvas.width = $$("#imgShow").width();
        canvas.height = $$("#imgShow").height();

        drawBoxes(ctx, boxes, scores, classes, display_string, canvas.width, canvas.height);

        myApp.hideIndicator();
    }

    function drawBoxes(ctx, boxes, scores, classes, display_string, canvas_width, canvas_height) {
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

            x = boxes[i][1] * canvas_width;
            y = boxes[i][0] * canvas_height;
            box_width = (boxes[i][3] - boxes[i][1]) * canvas_width;
            box_height = (boxes[i][2] - boxes[i][0]) * canvas_height;

            var color = std_colors[classes[i] % std_colors.length];
            ctx.beginPath();

            ctx.strokeStyle = color;
            
            ctx.rect(x, y, box_width, box_height);

            ctx.fillStyle = color;

            var textwidth = ctx.measureText(display_string[i]).width;

            ctx.fillRect(x, y-18, textwidth, 18);

            ctx.fillStyle = 'black';

            ctx.font = "Arial";
            ctx.fillText(display_string[i], x, y-9);
            ctx.stroke();
        }
    }

    function errorCallback(err) {
        //uncomment for debugging.
        //alert("error: "+err);
    }
}


//////////////////////////////////////////////////////
////////////////////////TESTING///////////////////////
//////////////////////////////////////////////////////
// var img_arg = '{"boxes":[[0.20688289403915405,0.02382335066795349,0.8024314045906067,0.9165056943893433]],"scores":[0.9100580811500549],"classes":[3],"display_string":["car: 91%"]}';

// displayImage("test.jpg");

// showDetectionResult(img_arg);
