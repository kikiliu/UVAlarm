/*global define, $, console, window, document, history, tau*/
/*jslint plusplus: true*/

/**
 * Details page module
 */

define({
    name: 'views/page/current',
    requires: [
        'core/event',
        'models/settings',
    ],
    def: function viewsPageDetails(req) {
        'use strict';

        var e = req.core.event,
            page = null,
            elCheckRisk = null,
            elIndicator = null;

        function refreshIndicator(value) {
        	elIndicator.innerHTML = value;
        }

        function show(params) {
        }

        function onCheckRisk() {
            console.log('current: here');        	
        	e.fire('risk.show');
        }        
        
        function getRandomArbitrary(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }
        
        function setUV(){
        	//Temp: Currently UV is randomly generate 
        	//TODO: Go to UV sensor Data 
        	var currentUV = getRandomArbitrary(1,13);
        	console.log("Random CurrentUV:"+currentUV);
        	
        	//change pic
        	document.getElementById('Indicator').src = "./images/uv"+currentUV+".png";
        	//change text
        	if (currentUV <=2){ // low
        		document.getElementById('indicator-text').innerHTML = currentUV+": Low";
        		document.getElementById('indicator-text').style.color = "#8CC63F";
        	} else if (currentUV <=5){ // Moderate
        		document.getElementById('indicator-text').innerHTML = currentUV+": Moderate";
        		document.getElementById('indicator-text').style.color = "#ffff00";
        	} else if (currentUV <=7){ // High
        		document.getElementById('indicator-text').innerHTML = currentUV+": High";
        		document.getElementById('indicator-text').style.color = "#e0570d";
        	} else if (currentUV <=10){ // Very High
        		document.getElementById('indicator-text').innerHTML = currentUV+": Very High";
        		document.getElementById('indicator-text').style.color = "#ed1c23";
        	} else if (currentUV >10){ // Extremely High
        		document.getElementById('indicator-text').innerHTML = currentUV+": Dangerous";
        		document.getElementById('indicator-text').style.color = "#916ae6";
        	}
        	//send UV to Risk page
        	console.log("send UV to Risk:"+"risk.setUV"+currentUV);
        	e.fire('risk.setUV'+currentUV);
        	
        	
        }
        
        function bindEvents() {
        	var elCheckRisk = document.getElementById('CheckRisk');
            elCheckRisk.addEventListener('click', onCheckRisk);
        }

       
        
        
        
        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('Current');
            console.log(page);
           // elCheckRisk = document.getElementById('CheckRisk');
           // elIndicator = document.getElementById('Indicator');
            bindEvents();
        }

        e.on({
            'views.page.current.show': show,
            'views.page.detecting.current.setUV': setUV, 
            'gesture.current.setUV': setUV
        });

        return {
            init: init
        };
    }

});
