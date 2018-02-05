document.addEventListener("deviceready", onDeviceReady, false);

// Initialize app
var myApp = new Framework7({
    swipePanel:'left',
    material:true,
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    domCache: true  ,
    dynamicNavbar: true
});

function onDeviceReady() {
    // Now safe to use device APIs

    $$(document).on("click", "#getPhoto", function () {
        
        navigator.camera.getPicture(displayImage, errorCallback, {
            quality: 50,
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
        mainView.router.load({pageName: 'send'});
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
                        oReq.open("POST", "http://192.168.0.105:8000/img3/", true);

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
        var boxes = imageJSON["boxes"];
        var scores = imageJSON["scores"];
        var classes = imageJSON["classes"];
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');

        canvas.width = $$("#imgShow").width();
        canvas.height = $$("#imgShow").height();

        drawBoxes(ctx, boxes, scores, classes, canvas.width, canvas.height);

        myApp.hideIndicator();
    }

    function drawBoxes(ctx, boxes, scores, classes, canvas_width, canvas_height) {
        var i, x, y, box_width, box_height;

        ctx.lineWidth = "5";
        ctx.strokeStyle = "blue";

        for (i = 0; i < boxes.length; i++) {

            x = boxes[i][1] * canvas_width;
            y = boxes[i][0] * canvas_height;
            box_width = (boxes[i][3] - boxes[i][1]) * canvas_width;
            box_height = (boxes[i][2] - boxes[i][0]) * canvas_height;

            ctx.beginPath();
            ctx.rect(x, y, box_width, box_height);
            ctx.stroke();
        }
    }



    function errorCallback(err) {
        //uncomment for debugging.
        //alert("error: "+err);
    }
}