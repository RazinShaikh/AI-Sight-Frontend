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
            image.src = imageData;
			document.getElementById("base64").innerHTML = image.src; //test
        }

        function onFail(message) {
            /*alert('Failed because: ' + message);*/
        }

}, false);


 /*var pictureSource;  //设定图片来源

 function onDeviceReady() {
      pictureSource=navigator.camera.PictureSourceType;
    }

function getPhoto(source) {
// Retrieve image file location from specified source
navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 100,
destinationType: destinationType.DATA_URL,
sourceType: source });
}*/
