/*global define, $, console, window, document, history, tau*/
/*jslint plusplus: true*/

/**
 * Details page module
 */

define({
    name: 'views/page/apply',
    requires: [
        'core/event',
        'models/settings',
    ],
    def: function viewsPageDetails(req) {
        'use strict';

        var e = req.core.event,
            page = null;

        function show() {
            console.log('apply: show()');            	
            tau.changePage('#Apply');
        }      
        
        function bindEvents() {
        }
        
        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('Apply');
            bindEvents();
        }

        e.on({   
            'views.page.risk.apply.show': show
        });

        return {
            init: init
        };
    }

});
