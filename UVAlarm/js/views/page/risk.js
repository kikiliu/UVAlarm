/*global define, $, console, window, document, history, tau*/
/*jslint plusplus: true*/

/**
 * Details page module
 */

define({
    name: 'views/page/risk',
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

        function show() {
            console.log('risk: here');            	
            tau.changePage('#Risk');
        }      
        
        function onApplySunscreen() {
            console.log('Risk: here');        	
        	e.fire('apply.show');
        }    
        function bindEvents() {
        	var elApplySunscreen = document.getElementById('ApplySunscreen');
            elApplySunscreen.addEventListener('click', onApplySunscreen);
        }
        
        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('Risk');
            bindEvents();
        }

        e.on({
            'views.page.current.risk.show': show
        });

        return {
            init: init
        };
    }

});
