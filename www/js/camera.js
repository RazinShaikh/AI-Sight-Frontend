document.addEventListener("deviceready", function() {


        $$(document).on("click", "#getPhoto", function () {

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
				saveToPhotoAlbum: false, //added
                destinationType: Camera.DestinationType.DATA_URL,
            });

        });

        function onSuccess(imageData) {
            var image = document.getElementById('image');
            image.style.display = 'block';
            image.src = "data:image/jpeg;base64," + imageData;
        }

        function onFail(message) {
            /*alert('Failed because: ' + message);*/
        }

}, false);

