/*global define, $, console, window, document, history, tau*/
/*jslint plusplus: true*/

/**
 * Details page module
 */

define({
    name: 'views/page/risk',
    requires: [
        'core/event',
        'models/routes',
        'models/timer',
        'models/settings',
        'models/pedometer',
        'helpers/timer',
        'helpers/units',
        'helpers/page',
        'helpers/route'
    ],
    def: function viewsPageDetails(req) {
        'use strict';

        var e = req.core.event,
        	showNotificationWarningSunburn = false,
        	showNotificationWarningSuncreenExpired = false,
        	Timer = req.models.timer.Timer,
            page = null,
            elCheckRisk = null,
            elIndicator = null,
            
            screenTimeToSunburn = null,
            screenSunscreenStatus = null,
            
            //The variable to display on page
            elTimeToSunburn = null,
            elSunscreenStatus = null,
            
            //Two time that can aggregate to TimeToSunBurn
            elSkinResistanceTime = null,
            elSunscreenProtectionTime = null,
            
            //Variable for calculating Skin Resistence Time
            elDailyMED = null,
            elAccumulativeMED = null,
            elSensorUV = null,
            elAdjustmentBySkinType = null,
            elUVToMED = 0.0025,
        	//Variable for calculating Sunscreen Protection Time
            elSPF = null,
            //For each SPF the time to expire is 10 mins = 900 seconds
            elBaseTime = 900,
        	elSunscreenApply = null,
        	elSunscreenExpired = null,
        	
        	timer = null;
        	
        
        
        function refreshIndicator(value) {
        	elIndicator.innerHTML = value;
        }

        function show() {
            console.log('risk: show');            	
            tau.changePage('#Risk');
        }      
        
        function updateTimeToSunburn(value) {
        	value = Math.round(value);
        	var hrs = Math.floor(value / 3600);
        	value = value - hrs * 3600;
        	var mins = Math.floor(value / 60);
        	screenTimeToSunburn.innerHTML = hrs+"h "+mins+"m";
        	
        	if (hrs >= 3){		//Time Range 1
        		document.getElementById("time-image").src="./images/time1.png";	
        		//Green
        		document.getElementById("timetosunburn").style.color = "#8CC63F"; 
        		document.getElementById("sunscreenstatus").style.color = "#8CC63F"; 
        		document.getElementById("icon-note").style.color = "#8CC63F"; 
        	
        	} else if (hrs >= 2){  //Time Range 2
        		document.getElementById("time-image").src="./images/time2.png"; 
        		//Yellow
        		document.getElementById("timetosunburn").style.color = "#ffff00"; 
        		document.getElementById("sunscreenstatus").style.color = "#ffff00"; 
        		document.getElementById("icon-note").style.color = "#ffff00"; 
        	} else if (hrs >= 1){  //Time Range 3
        		document.getElementById("time-image").src="./images/time3.png"; 
        		//orange
        		document.getElementById("timetosunburn").style.color = "#fbb13b"; 
        		document.getElementById("sunscreenstatus").style.color = "#fbb13b"; 
        		document.getElementById("icon-note").style.color = "#fbb13b"; 
        	} else if (mins >=30){  //Time Range 4
        		document.getElementById("time-image").src="./images/time4.png"; 
        		//red
        		document.getElementById("timetosunburn").style.color = "#ed1c23"; 
        		document.getElementById("sunscreenstatus").style.color = "#ed1c23"; 
        		document.getElementById("icon-note").style.color = "#ed1c23"; 
        	} else{  //Time Range 5
        		document.getElementById("time-image").src="./images/time5.png";
        		//purple
        		document.getElementById("timetosunburn").style.color = "#916ae6"; 
        		document.getElementById("sunscreenstatus").style.color = "#916ae6"; 
        		document.getElementById("icon-note").style.color = "#916ae6"; 
        	}
        }
        
        function updateSunscreenStatus(value){
        	screenSunscreenStatus.innerHTML = value;
        }
        
        function onClickApplySunscreenBtn() {
            console.log('Risk: applysunscreen');        	
        	e.fire('apply.show');
        }    
 
        function onClickRestartDetectingBtn() {
            console.log('Risk: Restart Detecting');        	
        	e.fire('detecting.show');
        }           


        
        function changeUV(value){
        	console.log("Risk: Change UV to "+value);
        	elSensorUV = value;     	
        }
        
        function applySunscreen(SPF){
        	elSPF = SPF;
        	elSunscreenProtectionTime = elSPF * elBaseTime;
        	elSunscreenApply = true;
        	elSunscreenExpired = false;
        	showNotificationWarningSuncreenExpired = false;
        }
        
        function refreshTimeForSkinburn(){
        	elTimeToSunburn = (elSkinResistanceTime + elSunscreenProtectionTime);

        	if (elTimeToSunburn < 0){
        		if (showNotificationWarningSunburn === false){
        			tau.changePage("#WarningSunburn");
        			showNotificationWarningSunburn = true;
        		}
        		elTimeToSunburn = 0;
        	}
        	
        	if (elSunscreenApply === false && elSunscreenExpired === false){
        		elSunscreenStatus = "w/o sunscreen";
        	} else if (elSunscreenApply === true && elSunscreenExpired === false) {
        		elSunscreenStatus = "w/ sunscreen";
        	} else if (elSunscreenApply === false && elSunscreenExpired === true){
        		elSunscreenStatus = "sunscreen expired";
        	}
        	
        	updateTimeToSunburn(elTimeToSunburn);
        	updateSunscreenStatus(elSunscreenStatus);
        	/*
        	console.log(elTimeToSunburn);
        	console.log(elSkinResistanceTime);
        	console.log(elSunscreenProtectionTime);
        	console.log(elSunscreenStatus);
        	*/
        }        
        
        function refreshSkinResistenceTime(){
        	// If Sunscreen didn't apply, add elAccumulativeMED
        	if (elSunscreenApply === false){
        		elAccumulativeMED += elSensorUV *elUVToMED;
        	}
        	
        	//If UV = 0: Keep the resistance time
        	if (elSensorUV > 0){
            	elSkinResistanceTime = (elDailyMED - elAccumulativeMED)/(elSensorUV*elUVToMED*elAdjustmentBySkinType);        		
        	}
        	//console.log(elSkinResistanceTime);
        }
        
        function refreshSunscreenProtectionTime(){
        	if (elSunscreenApply === true){
        		elSunscreenProtectionTime -= 1;
        		if (elSunscreenProtectionTime < 0){
            		if (showNotificationWarningSuncreenExpired === false){
            			tau.changePage("#WarningSunscreenExpired");
            			showNotificationWarningSuncreenExpired = true;
            		}
        			
        			elSunscreenExpired = true;
        			elSunscreenApply = false;
        			elSunscreenProtectionTime = 0;
        		}
        	}
        	//console.log(elSunscreenProtectionTime);
        	
        }
        
        function tick() {
            refreshSkinResistenceTime();
            refreshSunscreenProtectionTime();
            refreshTimeForSkinburn();
        }        

        function initAlgorithm(){
        	
        	console.log("risk:initAlgorithm");
        	
        	elTimeToSunburn = 0;
        	elSunscreenStatus = "w/o Sunscreen";
        	
            //Daily MED base for people is 21 mJ/cm^2
            elDailyMED = 21;
            elAccumulativeMED = 0;
                      
            elAdjustmentBySkinType = 1;
            elSPF = 0;

            
            
            elSunscreenApply = false;
            elSunscreenExpired = false;
            
            timer = new Timer(1000, 'views.risk.tick');
            timer.run();
        }        
        
        
        function bindEvents() {
        	var elApplySunscreenBtn = document.getElementById('ApplySunscreen');
        	var elRestartDetectingBtn = document.getElementById('RestartDetecting');
        	
            elApplySunscreenBtn.addEventListener('click', onClickApplySunscreenBtn);
            elRestartDetectingBtn.addEventListener('click',onClickRestartDetectingBtn);
        }
        
        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('Risk');
            screenTimeToSunburn = document.getElementById('timetosunburn');
            screenSunscreenStatus = document.getElementById('sunscreenstatus');
            
            
            initAlgorithm();
            
            bindEvents();

            
        }

        function applySunscreen15(){
        	applySunscreen(15);
        }

        function applySunscreen30(){
        	applySunscreen(30);
        }
        
        function applySunscreen50(){
        	applySunscreen(50);
        }        
        
        function applySunscreen10(){
        	applySunscreen(10);
        }        
        function applySunscreen25(){
        	applySunscreen(25);
        }   
        function applySunscreen35(){
        	applySunscreen(35);
        }  
        function applySunscreen40(){
        	applySunscreen(40);
        }   
        function applySunscreen45(){
        	applySunscreen(45);
        }   
        function applyTimeNow(){
        	elSunscreenProtectionTime -= 0;
        }
        function applyTime30m(){
        	elSunscreenProtectionTime -= 1800;
        }
        function applyTime60m(){
        	elSunscreenProtectionTime -= 3600;
        }
        function applyTime90m(){
        	elSunscreenProtectionTime -= 5400;
        }
        function setUV0(){
            changeUV(0);
        }
        function setUV1(){
            changeUV(1);
        }
        function setUV2(){
            changeUV(2);
        }
        function setUV3(){
            changeUV(3);
        }
        function setUV4(){
            changeUV(4);
        }
        function setUV5(){
            changeUV(5);
        }
        function setUV6(){
            changeUV(6);
        }
        function setUV7(){
            changeUV(7);
        }
        function setUV8(){
            changeUV(8);
        }
        function setUV9(){
            changeUV(9);
        }
        function setUV10(){
            changeUV(10);
        }
        function setUV11(){
            changeUV(11);
        }
        function setUV12(){
            changeUV(12);
        }
        function setUV13(){
            changeUV(13);
        }
        function setUV14(){
            changeUV(14);
        }
        function setUV15(){
            changeUV(15);
        }
        
        e.on({
            'views.page.current.risk.show': show,
            'views.page.applytime.risk.show': show,
            'models.timer.views.risk.tick': tick,
            'views.page.apply.risk.apply15': applySunscreen15,
            'views.page.apply.risk.apply30': applySunscreen30,
            'views.page.apply.risk.apply50': applySunscreen50,
            'views.page.morespfoption.risk.apply10': applySunscreen10,
            'views.page.morespfoption.risk.apply25': applySunscreen25,
            'views.page.morespfoption.risk.apply35': applySunscreen35,
            'views.page.morespfoption.risk.apply40': applySunscreen40,
            'views.page.morespfoption.risk.apply45': applySunscreen45,
            'views.page.applytime.risk.applytimenow': applyTimeNow,
            'views.page.applytime.risk.applytime30m': applyTime30m,
            'views.page.applytime.risk.applytime60m': applyTime60m,
            'views.page.applytime.risk.applytime90m': applyTime90m,
            'views.page.current.risk.setUV0': setUV0,
            'views.page.current.risk.setUV1': setUV1,
            'views.page.current.risk.setUV2': setUV2,
            'views.page.current.risk.setUV3': setUV3,
            'views.page.current.risk.setUV4': setUV4,
            'views.page.current.risk.setUV5': setUV5,
            'views.page.current.risk.setUV6': setUV6,
            'views.page.current.risk.setUV7': setUV7,
            'views.page.current.risk.setUV8': setUV8,
            'views.page.current.risk.setUV9': setUV9,
            'views.page.current.risk.setUV10': setUV10,
            'views.page.current.risk.setUV11': setUV11,
            'views.page.current.risk.setUV12': setUV12,
            'views.page.current.risk.setUV13': setUV13,
            'views.page.current.risk.setUV14': setUV14,
            'views.page.current.risk.setUV15': setUV15
        });

        return {
            init: init
        };
    }

});
