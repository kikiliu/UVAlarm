/*    
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.   
 * All rights reserved.   
 *   
 * Redistribution and use in source and binary forms, with or without   
 * modification, are permitted provided that the following conditions are   
 * met:   
 *   
 *     * Redistributions of source code must retain the above copyright   
 *        notice, this list of conditions and the following disclaimer.  
 *     * Redistributions in binary form must reproduce the above  
 *       copyright notice, this list of conditions and the following disclaimer  
 *       in the documentation and/or other materials provided with the  
 *       distribution.  
 *     * Neither the name of Samsung Electronics Co., Ltd. nor the names of its  
 *       contributors may be used to endorse or promote products derived from  
 *       this software without specific prior written permission.  
 *  
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS  
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT  
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR  
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT  
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,  
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT  
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,  
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY  
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT  
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE  
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
var GALL_THM_RQST = 'gallery-thumbnail-req';
var GALL_THM_RESP = 'gallery-thumbnail-rsp';
var GALL_IMG_RQST = 'gallery-image-req';
var GALL_IMG_RESP = 'gallery-image-rsp';

var gLatestOffset = -1;

function toastAlert(msg) {
	$('#popupToastMsg').empty();
	$('#popupToastMsg').append(msg);
	gear.ui.openPopup($('#popupToast'));
	console.log(msg);
}

function showImage() {
	$('#main').hide();
	$('#imagePage').show();
}

function showList() {
	$('#imagePage').hide();
	$('#main').show();
}

var sapinitsuccesscb = {
	onsuccess : function() {
		console.log('Succeed to connect');
		requestList();
	},
	ondevicestatus : function(status) {
		if (status == "DETACHED") {
			toastAlert('Detached remote peer device');
			clearList();
		} else if (status == "ATTACHED") {
			reconnect();
		}
	}
};

function initialize() {
	sapInit(sapinitsuccesscb, function(err) {
		console.log(err.name);
		if (err.name == "PEER_DISCONNECTED") {
			toastAlert(err.message);
			clearList(true);
		} else {
			toastAlert('Failed to connect to service');
			clearList();
		}
	});
}

function requestList() {
	var reqData = {
	    'msgId' : GALL_THM_RQST,
	    'offset' : gLatestOffset
	};
	sapRequest(reqData, function(respData) {
		var count = respData.count;
		var list = respData.list;

		$('#main ul li:last-child').remove();

		for ( var i = 0; i < count; i++) {
			var id = list[i].id;
			var image = list[i].image;
			var name = list[i].name;

			var nameStr = (name.length > 15) ? (name.substring(0, 11) + '...') : name;

			$('#main ul').append(
			        '<li><a onclick="requestImage(' + id + ');"><img src="data:image/jpeg;base64,' + image + '" width="30" height="30"/> ' + nameStr
			                + '</a></li>');
		}
		$('#main ul').append('<li><a href="#" onclick="requestList();">More...</a></li>');

		gLatestOffset = list[respData.count - 1].id;
	}, function(err) {
		console.log('Failed to get list.');
	});
}

function reconnect() {
	$('#main ul').empty();
	sapFindPeer(function(){
		console.log('Succeed to reconnect');
	}, function(err){
		toastAlert('Failed to reconnect to service');
		clearList(true);
	});
}

function clearList(reconnect) {
	console.log('clear List');
	gLatestOffset = -1;
	$('#main ul').empty();
	if (reconnect) {
		$('#main ul').append('<input type="button" class="ui-btn ui-inline" value="Connect" onclick="reconnect();" style="width:100%;"/>');
	} else {
		$('#main ul').append('<li>BT Disconnected. Connection waiting...</li>');
	}
}

function requestImage(id) {
	var reqData = {
	    'msgId' : GALL_IMG_RQST,
	    'id' : id,
	    'width' : 320,
	    'height' : 320
	};

	sapRequest(reqData, function(respData) {
		$('#imageView').html('<img src="data:image/jpeg;base64,' + respData.image.image + '" onclick="showList();"/>');
		showImage();
	}, function(err) {
		toastAlert('Failed to get image');
	});
}

(function() {
	window.addEventListener('tizenhwkey', function(ev) {
		if (ev.keyName == 'back') {
			tizen.application.getCurrentApplication().exit();
		}
	});
	window.addEventListener('load', function(ev) {
		$('#imagePage').hide();
		initialize();
	});
}());

(function(ui) {
	var closePopup = ui.closePopup.bind(ui);
	var toastPopup = document.getElementById('popupToast');
	toastPopup.addEventListener('popupshow', function(ev){
		setTimeout(closePopup, 3000);
	}, false);
})(window.gear.ui);