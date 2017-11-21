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