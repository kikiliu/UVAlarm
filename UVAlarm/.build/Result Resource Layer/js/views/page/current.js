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
        
        function bindEvents() {

        	var elCheckRisk = document.getElementById('CheckRisk');
            elCheckRisk.addEventListener('click', onCheckRisk);
        }

        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('Current');
           // elCheckRisk = document.getElementById('CheckRisk');
           // elIndicator = document.getElementById('Indicator');
            bindEvents();
        }

        e.on({
            'views.page.current.show': show
        });

        return {
            init: init
        };
    }

});
