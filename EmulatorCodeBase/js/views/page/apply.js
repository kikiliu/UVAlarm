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
        
        function onApplySPF15(){
            console.log('apply: SPF15');
            e.fire('risk.apply15');
        	e.fire('applytime.show');
        }
        function onApplySPF30(){
            console.log('apply: SPF30');
            e.fire('risk.apply30');
        	e.fire('applytime.show');
        }
        function onApplySPF50(){
            console.log('apply: SPF50'); 
            e.fire('risk.apply50');
        	e.fire('applytime.show');
        }
        function onApplySPFOther(){
            console.log('apply: SPFOther'); 
        	e.fire('morespfoption.show');
        }
        
        function bindEvents() {
        	var elSPF15 = document.getElementById('spf15'),
        		elSPF30 = document.getElementById('spf30'),
        		elSPF50 = document.getElementById('spf50'),
        		elSPFOther = document.getElementById('spfOther');
        	elSPF15.addEventListener('click', onApplySPF15);
        	elSPF30.addEventListener('click', onApplySPF30);
        	elSPF50.addEventListener('click', onApplySPF50);
        	elSPFOther.addEventListener('click', onApplySPFOther);
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
