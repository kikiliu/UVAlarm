// Gear 2 Swipe Gesture Tutorial
// ----------------------------------
//
// Copyright (c)2014 Dibia Victor, Denvycom
// Distributed under MIT license
//
// https://github.com/chuvidi2003/GearSwipeTutorial




$(window).load(function(){
	var element = document.getElementById('content');
	var page, pageid;
	
    var hammertime = Hammer(element).on("swipeleft", function(event) {
    	page = document.getElementsByClassName('ui-page-active')[0];
        pageid = page ? page.id : '';	
        
    	console.log("Gesture: swipe left");
    	
    	if (pageid === 'Current') {
            tau.changePage('#Risk');
        } else if (pageid === 'Risk') {
            tau.changePage('#Apply');
        } else if (pageid === 'Detecting') {
            tau.changePage('#Current');
        }
    	
    });
    var hammertime = Hammer(element).on("swiperight", function(event) {
    	page = document.getElementsByClassName('ui-page-active')[0];
        pageid = page ? page.id : '';	
        
    	console.log("Gesture: swipt right");
    	
    	if (pageid === 'Apply') {
            tau.changePage('#Risk');
        } else if (pageid === 'Risk') {
            tau.changePage('#Current');
        } else if (pageid === 'Current') {
            tau.changePage('#Detecting');
            //Temp: No UV detecting
            setTimeout(function(){tau.changePage('#Current');}, 3000);
        }
    });
    
    
    // Temp: for demo, show warning message by swipe up
    var hammertime = Hammer(element).on("swipeup", function(event) {
    	page = document.getElementsByClassName('ui-page-active')[0];
        pageid = page ? page.id : '';	
        
    	console.log("Gesture: swipt up");
    	
    	if (pageid === 'Risk') {
            tau.changePage('#WarningSunscreenExpired');
        } else if (pageid === 'WarningSunscreenExpired'){
        	tau.changePage('#WarningSunburn');
        }
    });   
});