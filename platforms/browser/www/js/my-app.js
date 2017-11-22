// Initialize app
var myApp = new Framework7({
    swipePanel:'left',
    material:true,
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

//Add a inline pages
var mainView = myApp.addView('.view-main', {
    //enable inline pages
    domCache: true  ,
    // Enable dynamic Navbar
    dynamicNavbar: true
});

function sendImage(image_b64) {
    console.log("Sending image...");
    var imgdata = '{ "img" : "' + image_b64 + '" }';
    $$.ajax({
      datatype: 'json',
      type: 'POST',
      data: imgdata,
      url: "http://127.0.0.1:8000/detect/",
      success: handleImage
    });
}

function handleImage(img_arg) {
    var image_json = JSON.parse(img_arg);
    console.log(image_json);
}
