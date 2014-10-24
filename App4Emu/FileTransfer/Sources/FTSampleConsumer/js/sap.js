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

var gSocket = null;
var gPeerAgent = null;
var gChannel = 107;
var gAgent = null;
var gUnavailable = false;
var gFileTransfer = null;

var PROVIDER_APP_NAME = 'FTSampleProvider';

var gCurrentRequest = null;

function sapRequest(reqData, successCb, errorCb) {
	if (gSocket == null || !gSocket.isConnected()) {
		throw {
		    name : 'NotConnectedError',
		    message : 'SAP is not connected'
		};
	}

	gSocket.sendData(gChannel, JSON.stringify(reqData));

	gCurrentRequest = {
	    data : reqData,
	    successCb : successCb,
	    errorCb : errorCb
	}
}

function ftCancel(id, successCb, errorCb) {
	if (gAgent == null || gFileTransfer == null || gPeerAgent == null) {
		errorCb({
			name : 'NotConnectedError',
		    message : 'SAP is not connected'
		});
		return;
	}

	try {
		gFileTransfer.cancelFile(id);
		successCb();
	} catch (err) {
		console.log('cancelFile exception <' + err.name + '> : ' + err.message);
		window.setTimeout(function() {
			errorCb({
			    name : 'RequestFailedError',
			    message : 'cancel request failed'
			});
		}, 0);
	}
	
}

function ftSend(path, successCb, errorCb) {
	if (gAgent == null || gFileTransfer == null || gPeerAgent == null) {
		errorCb({
			name : 'NotConnectedError',
		    message : 'SAP is not connected'
		});
		return;
	}
	
	try {
		var transferId = gFileTransfer.sendFile(gPeerAgent, path);
		successCb(transferId);
	} catch (err) {
		console.log('sendFile exception <' + err.name + '> : ' + err.message);
		window.setTimeout(function() {
			errorCb({
			    name : 'RequestFailedError',
			    message : 'send request failed'
			});
		}, 0);
	}
}

function ftInit(successCb, errorCb) {
	if (gAgent == null) {
		errorCb({
		    name : 'NetworkError',
		    message : 'Connection failed'
		});
		return;
	}

	var filesendcallback = {
		onprogress : successCb.onsendprogress,
		oncomplete : successCb.onsendcomplete,
		onerror : successCb.onsenderror
	};
	
	try {
		gFileTransfer = gAgent.getSAFileTransfer();
		gFileTransfer.setFileSendListener(filesendcallback);
		successCb.onsuccess();
	} catch (err) {
		console.log('getSAFileTransfer exception <' + err.name + '> : ' + err.message);
		window.setTimeout(function() {
			errorCb({
			    name : 'NetworkError',
			    message : 'Connection failed'
			});
		}, 0);
	}
}

function sapInit(successCb, errorCb) {
	if (gUnavailable == true) {
		console.log('connection failed previously');
		window.setTimeout(function() {
			errorCb({
			    name : 'NetworkError',
			    message : 'Connection failed'
			});
		}, 0);
		return;
	}

	if (gSocket != null) {
		console.log('socket already exists');
		window.setTimeout(function() {
			successCb();
		}, 0);
		return;
	}

	try {
		webapis.sa.requestSAAgent(function(agents) {
			console.log('requestSAAgent succeeded');

			gAgent = agents[0];

			gAgent.setServiceConnectionListener({
			    onconnect : function(sock) {
				    console.log('onconnect');

				    gSocket = sock;
				    gSocket.setDataReceiveListener(function(channel, respDataJSON) {
					    console.log('message received : ' + respDataJSON);

					    if (gCurrentRequest == null)
						    return;

					    var currentRequest = gCurrentRequest;
					    gCurrentRequest = null;

					    var respData = JSON.parse(respDataJSON);

					    if (currentRequest.successCb) {
						    currentRequest.successCb(respData);
					    }
				    });
				    gSocket.setSocketStatusListener(function(errCode) {
					    console.log('socket disconnected : ' + errCode);

					    if (gCurrentRequest != null) {
						    var currentRequest = gCurrentRequest;
						    gCurrentRequest = null;

						    if (currentRequest.errorCb) {
							    currentRequest.errorCb({
							        name : 'RequestFailedError',
							        message : 'request failed'
							    });
						    }
						    
						    gSocket = null;
					    }
				    });
				    successCb();
			    },
			    onerror : function(errCode) {
				    console.log('requestServiceConnection error <' + errCode + '>');
				    errorCb({
				        name : 'NetworkError',
				        message : 'Connection failed'
				    });
			    }
			});

			gAgent.setPeerAgentFindListener({
			    onpeeragentfound : function(peerAgent) {
				    if (gPeerAgent != null) {
					    console.log('already get peer agent');
					    return;
				    }
				    try {
					    if (peerAgent.appName == PROVIDER_APP_NAME) {
						    console.log('peerAgent found');

						    gAgent.requestServiceConnection(peerAgent);
						    gPeerAgent = peerAgent;
					    } else {
						    console.log('not expected app : ' + peerAgent.appName);
					    }
				    } catch (err) {
					    console.log('exception [' + err.name + '] msg[' + err.message + ']');
				    }
			    },
			    onerror : function(errCode) {
				    console.log('findPeerAgents error <' + errCode + '>');
				    errorCb({
				        name : 'NetworkError',
				        message : 'Connection failed'
				    });
			    }
			});

			try {
				gPeerAgent = null;
				gAgent.findPeerAgents();
			} catch (err) {
				console.log('findPeerAgents exception <' + err.name + '> : ' + err.message);
				errorCb({
				    name : 'NetworkError',
				    message : 'Connection failed'
				});
			}

		}, function(err) {
			console.log('requestSAAgent error <' + err.name + '> : ' + err.message);
			errorCb({
			    name : 'NetworkError',
			    message : 'Connection failed'
			});
		});
	} catch (err) {
		console.log('requestSAAgent exception <' + err.name + '> : ' + err.message);
		window.setTimeout(function() {
			errorCb({
			    name : 'NetworkError',
			    message : 'Connection failed'
			});
		}, 0);
		gUnavailable = true;
	}
}
