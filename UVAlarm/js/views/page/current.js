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

        function bindEvents() {
            elCheckRisk.addEventListener('click', onCheckRisk);
        }
        
        function onCheckRisk() {
        	e.fire('risk.show');
        }

        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('Current');
            elCheckRisk = page.getElementById('CheckRisk');
            elIndicator = page.getElementById('Indicator');
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
