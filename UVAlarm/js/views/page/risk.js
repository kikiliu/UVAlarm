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
        	elBaseTime = null,
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
        	screenTimeToSunburn.innerHTML = value;
        }
        
        function updateSunscreenStatus(value){
        	screenSunscreenStatus.innerHTML = value;
        }
        
        function onClickApplySunscreenBtn() {
            console.log('Risk: applysunscreen');        	
        	e.fire('apply.show');
        }    
 
        


        
        function changeUV(value){
        	elSensorUV = value;     	
        }
        
        function applySunscreen(SPF){
        	elSPF = SPF;
        	elSunscreenProtectionTime = elSPF * elBaseTime;
        	elSunscreenApply = true;
        	elSunscreenExpired = false;
        }
        
        function refreshTimeForSkinburn(){
        	elTimeToSunburn = (elSkinResistanceTime + elSunscreenProtectionTime);

        	if (elTimeToSunburn < 0){
        		// TODO: Send Notification 
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
        	
        	console.log(elTimeToSunburn);
        	console.log(elSkinResistanceTime);
        	console.log(elSunscreenProtectionTime);
        	console.log(elSunscreenStatus);
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
        			//TODO: Send Notification
        			
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
            
            elSensorUV = 0;            
            elAdjustmentBySkinType = 1;
            elSPF = 0;
            //For each SPF the time to expire is 15 mins = 900 seconds
            elBaseTime = 900;
            
            
            elSunscreenApply = false;
            elSunscreenExpired = false;
            
            timer = new Timer(1000, 'views.risk.tick');
            timer.run();
            
            //testing purpose
            changeUV(10);
        }        
        
        
        function bindEvents() {
        	var elApplySunscreenBtn = document.getElementById('ApplySunscreen');
        	console.log(elApplySunscreenBtn.innerHTML);
            elApplySunscreenBtn.addEventListener('click', onClickApplySunscreenBtn);
            
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
            'views.page.applytime.risk.applytime90m': applyTime90m
        });

        return {
            init: init
        };
    }

});
