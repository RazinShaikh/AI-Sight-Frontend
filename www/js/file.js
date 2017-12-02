document.addEventListener("deviceready", function() {


        $$(document).on("click", "#openAlbum", function () {

            navigator.camera.getPicture(displayImage, onFail, {
                quality: 100,
                sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM,
                destinationType: Camera.DestinationType.DATA_URL,
            });

        });

        function onFail(message) {
            /*alert('Failed because: ' + message);*/
            alert("Failed");
        }

}, false);
