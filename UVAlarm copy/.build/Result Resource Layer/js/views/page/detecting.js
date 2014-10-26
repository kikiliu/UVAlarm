/*global define, $, console, window, document, history, tau*/
/*jslint plusplus: true*/

/**
 * Details page module
 */

define({
    name: 'views/page/detecting',
    requires: [
        'core/event',
        'models/settings',
    ],
    def: function viewsPageDetails(req) {
        'use strict';

        var e = req.core.event,
            page = null,
            elIndicator = null;

        function refreshIndicator(value) {
        	elIndicator.innerHTML = value;
        }

        function show(params) {
            console.log('detecting: here');  
        	setTimeout(function(){tau.changePage('#Current');}, 4000);        	
        }
        
        function bindEvents() {
        	
        }

        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('Current');
            bindEvents();
            show();
        }

        e.on({
            'views.page.current.show': show
        });

        return {
            init: init
        };
    }

});
