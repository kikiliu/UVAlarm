/*global define, $, console, window, document, history, tau*/
/*jslint plusplus: true*/

/**
 * Details page module
 */

define({
    name: 'views/page/applytime',
    requires: [
        'core/event',
        'models/settings',
    ],
    def: function viewsPageDetails(req) {
        'use strict';

        var e = req.core.event,
            page = null;

        function show() {
            console.log('applytime: show()');            	
            tau.changePage('#ApplyTime');
        }      
        
        function onApplyTimeNow(){
            console.log('applytime: Now'); 
            e.fire('risk.applytimenow');
        	e.fire('risk.show');
        }
        function onApplyTime30m(){
            console.log('applytime: 30m');   
            e.fire('risk.applytime30m');
        	e.fire('risk.show');
        }
        function onApplyTime60m(){
            console.log('applytime: 60m'); 
            e.fire('risk.applytime60m');
        	e.fire('risk.show');
        }
        function onApplyTime90m(){
            console.log('applytime: 90m');
            e.fire('risk.applytime90m');
        	e.fire('risk.show');
        }
     
        function bindEvents() {
        	
        	var elapplytimenow = document.getElementById('now'),
        		elapplytime30m = document.getElementById('30m'),
        		elapplytime60m = document.getElementById('60m'),
        		elapplytime90m = document.getElementById('90m');
        	elapplytimenow.addEventListener('click', onApplyTimeNow);
        	elapplytime30m.addEventListener('click', onApplyTime30m);
        	elapplytime60m.addEventListener('click', onApplyTime60m);
        	elapplytime90m.addEventListener('click', onApplyTime90m);
        	
        }
        
        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('ApplyTime');
            bindEvents();
        }

        e.on({   
            'views.page.apply.applytime.show': show,
            'views.page.morespfoption.applytime.show': show
        });

        return {
            init: init
        };
    }

});
