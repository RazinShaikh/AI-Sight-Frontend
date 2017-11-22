var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent();
    },
    $$: function(id) {
        return document.getElementById(id);
    },
    receivedEvent: function(){
        var _this = this;
        var getDomLabrary = this.$$('openAlbum');
        getDomLabrary.onclick = function(){
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM,
                destinationType: Camera.DestinationType.DATA_URL, });
            function onSuccess(imageData) {
                console.log(imageData)
                image.src = "data:image/jpeg;base64," + imageData;
				document.getElementById("base64").innerHTML = image.src; //test
            }
            function onFail(message) {
                /*alert('Failed because: ' + message);  */
            }
        }
    }
};
app.initialize();
