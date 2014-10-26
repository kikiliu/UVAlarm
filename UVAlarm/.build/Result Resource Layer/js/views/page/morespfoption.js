/*global define, $, console, window, document, history, tau*/
/*jslint plusplus: true*/

/**
 * Details page module
 */

define({
    name: 'views/page/morespfoption',
    requires: [
        'core/event',
        'models/settings',
    ],
    def: function viewsPageDetails(req) {
        'use strict';

        var e = req.core.event,
            page = null;

        function show() {
            console.log('morespfoption: show()');            	
            tau.changePage('#MoreSPFOption');
        }      
        
        function onApplySPF10(){
            console.log('apply: SPF10'); 
            e.fire('risk.apply10');
        	e.fire('applytime.show');
        }
        function onApplySPF25(){
            console.log('apply: SPF25');
            e.fire('risk.apply25');
        	e.fire('applytime.show');
        }
        function onApplySPF35(){
            console.log('apply: SPF35');
            e.fire('risk.apply35');
        	e.fire('applytime.show');
        }
        function onApplySPF40(){
            console.log('apply: SPF40'); 
            e.fire('risk.apply40');
        	e.fire('applytime.show');
        }
        function onApplySPF45(){
            console.log('apply: SPF45'); 
            e.fire('risk.apply45');
        	e.fire('applytime.show');
        }

        function bindEvents() {
        	console.log("222");
        	var elSPF10 = document.getElementById('spf10'),
        		elSPF25 = document.getElementById('spf25'),
        		elSPF35 = document.getElementById('spf35'),
        		elSPF40 = document.getElementById('spf40'),
        		elSPF45 = document.getElementById('spf45');
        	elSPF10.addEventListener('click', onApplySPF10);
        	elSPF25.addEventListener('click', onApplySPF25);
        	elSPF35.addEventListener('click', onApplySPF35);
        	elSPF40.addEventListener('click', onApplySPF40);
        	elSPF45.addEventListener('click', onApplySPF45);
        }
        
        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('MoreSPFOption');
            bindEvents();
        }

        e.on({   
            'views.page.apply.morespfoption.show': show
        });

        return {
            init: init
        };
    }

});
