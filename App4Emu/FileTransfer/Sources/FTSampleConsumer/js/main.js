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

var SOURCE_PATH = "/opt/usr/media/Sounds/Over the horizon.mp3"
var gTransferId = 0;

function toastAlert(msg) {
	$('#popupToastMsg').empty();
	$('#popupToastMsg').append(msg);
	gear.ui.openPopup($('#popupToast'));
	console.log(msg);
}

function showSendPage() {
	$('#main').hide();
	$('#sendPage').show();
	$('#sendprogress').attr('value', 0);
}

function showMain(message) {
	$('#sendPage').hide();
	$('#main').show();
	if (message != undefined) {
		toastAlert(message);
	}
	gTransferId = 0;
}

function updateContents() {
	try {
		tizen.content.find(function(contents) {
			$('#main ul').empty();
			if (contents.length > 0) {
				for(var i = 0; i < contents.length ; i++) {
					console.log('name : ' + contents[i].title + ' URI : ' + contents[i].contentURI);
					var nameStr = (contents[i].title.length > 15) ? (contents[i].title.substring(0, 11) + '...') : contents[i].title;
					$('#main ul').append(
					        '<li><a onclick="sendFile(\'' + contents[i].contentURI + '\');">' + nameStr
					                + '</a></li>');
				}
				$('#main ul').append('<li><a onclick="updateContents();">Update contents...</a></li>');
			} else {
				$('#main ul').append('<li><a onclick="updateContents();">No items. Update contents</a></li>');
			}
		}, function(err) {
			console.log('Failed to find contents');
		});
	} catch(err) {
		console.log('content.find exception <' + err.name + '> : ' + err.message);
	}
}

function initialize() {
	var successCb = {
			onsuccess : function () {
				toastAlert('Succeed to connect');
			},
			onsendprogress : function (id, progress) {
				console.log('onprogress id : ' + id + ' progress : ' + progress);
				$('#sendprogress').attr('value', progress);
			},
			onsendcomplete : function (id, localPath) {
				$('#sendprogress').attr('value', 100);
				showMain('send Completed!! id : ' + id + ' localPath :' + localPath);
			},
			onsenderror : function (errCode, id) {
				showMain('Failed to send File. id : ' + id + ' errorCode :' + errCode);
			}
	};
	
	sapInit(function() {
		console.log('Succeed to connect');
		ftInit(successCb, function(err) {
			toastAlert('Failed to get File Transfer');
		});
	}, function(err) {
		toastAlert('Failed to connect to service');
	});
}

function cancelFile() {
	ftCancel(gTransferId,function() {
		console.log('Succeed to cancel file');
		showMain();
	}, function(err) {
		toastAlert('Failed to cancel File');
	});	
}

function sendFile(path) {
	ftSend(path, function(id) {
		console.log('Succeed to send file');
		gTransferId = id;
		showSendPage();
	}, function(err) {
		showMain('Failed to send File');
	});	
}

(function() {
	window.addEventListener('tizenhwkey', function(ev) {
		if (ev.keyName == 'back') {
			tizen.application.getCurrentApplication().exit();
		}
	});
	window.addEventListener('load', function(ev) {
		$('#sendPage').hide();
		$('#main').show();
		updateContents();
	});
}());

(function(ui) {
	var closePopup = ui.closePopup.bind(ui);
	var toastPopup = document.getElementById('popupToast');
	toastPopup.addEventListener('popupshow', function(ev){
		setTimeout(closePopup, 3000);
	}, false);
})(window.gear.ui);