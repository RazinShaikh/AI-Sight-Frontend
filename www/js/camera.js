document.addEventListener("deviceready", function() {


        $$(document).on("click", "#getPhoto", function () {

            navigator.camera.getPicture(displayImage, onFail, {
                quality: 100,
		saveToPhotoAlbum: false, //added
                destinationType: Camera.DestinationType.DATA_URL,
            });

        });

        function onFail(message) {
            /*alert('Failed because: ' + message);*/
            alert("Failed");
        }

}, false);
