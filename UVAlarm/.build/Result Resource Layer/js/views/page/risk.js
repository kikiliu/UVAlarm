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

        function show(params) {
        }

        function bindEvents() {
        }
        
        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('Risk');
            bindEvents();
        }

        e.on({
            'views.page.risk.show': show
        });

        return {
            init: init
        };
    }

});
