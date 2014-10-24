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
 
 
package com.samsung.accessory.FTSampleConsumer.backend;

import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import com.samsung.android.sdk.accessory.SAAgent;
import com.samsung.android.sdk.accessory.SAPeerAgent;
import com.samsung.android.sdk.accessory.SASocket;

import com.samsung.android.sdk.accessoryfiletransfer.SAFileTransfer;
import com.samsung.android.sdk.accessoryfiletransfer.SAFileTransfer.EventListener;
import com.samsung.android.sdk.accessoryfiletransfer.SAft;

import com.samsung.android.sdk.SsdkUnsupportedException;

public class FTSampleConsumerImpl extends SAAgent {
    private static final String TAG = "FTSampleConsumerService";
    
    private FTSampleConsumerConnection mConnection;
    private SAPeerAgent mPeerAgent;
    private FileAction mFileAction;
    private SAFileTransfer mSAFileTransfer = null;
    private EventListener mCallback;

    private final IBinder mFTSampleBinder = new FTSampleBinder();

    public FTSampleConsumerImpl() {
        super("FTSampleConsumerImpl", FTSampleConsumerConnection.class);
    }

    public class FTSampleBinder extends Binder {
        public FTSampleConsumerImpl getService() {
            return FTSampleConsumerImpl.this;
        }
    }

    @Override
    public int onStartCommand(Intent intent, int arg1, int arg2) {
        if (intent.getAction().equalsIgnoreCase("android.accessory.device.action.DETACHED"))
            mPeerAgent = null;
        return super.onStartCommand(intent, arg1, arg2);
    }
	
    @Override
    public IBinder onBind(Intent arg0) {
        super.findPeerAgents();

        mCallback = new EventListener() {
            @Override
            public void onProgressChanged(int transId, int progress) {
                Log.d(TAG, "progress received : " + progress + " for transaction : " + transId);
                mFileAction.onProgress(transId, progress);
            }
        
            @Override
            public void onTransferCompleted(int transId, String fileName, int errorCode) {
                Log.d(TAG, "onTransferComplete tr id : " + transId + " file name : " + fileName + " error : " + errorCode);

                if (errorCode == 0) {
                    mFileAction.onTransferComplete(fileName);
                } else {
                    mFileAction.onError();
                }
            }

            @Override
            public void onTransferRequested(int id, String fileName) {
            }
        };

        return mFTSampleBinder;
    }
    
    @Override
    public void onDestroy() {
        mSAFileTransfer = null;
        super.onDestroy();
    }

    public void connect(){
        if (mPeerAgent != null) {
            requestServiceConnection(mPeerAgent);
        } else {
            super.findPeerAgents();
            Toast.makeText(getBaseContext(), "No peer agent found yet. Please try again", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onFindPeerAgentResponse(SAPeerAgent peerAgent, int result) {
        if (peerAgent != null) {
            mPeerAgent = peerAgent;
        } else {
            Log.e(TAG, "No peer Aget found:"+result);
            Toast.makeText(getBaseContext(), "No peer agent found.", Toast.LENGTH_SHORT).show();
        }
    }
    
    @Override
    protected void onPeerAgentUpdated(SAPeerAgent peerAgent, int result) {
        Log.d(TAG, "Peer agent updated");
        mPeerAgent = peerAgent;
    }

    @Override
    protected void onServiceConnectionResponse(SAPeerAgent peer, SASocket conn, int result) {
        Log.d(TAG, "onServiceConnectionResponse : " + result);
        if(conn==null) {
            if(result == SAAgent.CONNECTION_ALREADY_EXIST){
                Toast.makeText(getBaseContext(), "Connection Already exists", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(getBaseContext(), "Connection could not be made. Please try again", Toast.LENGTH_SHORT).show();
            }
        } else {
            this.mConnection = (FTSampleConsumerConnection)conn;
            Toast.makeText(getBaseContext(), "Connection established for FT Sample", Toast.LENGTH_SHORT).show();
        }
    }

    public void registerFileAction(FileAction action){
        this.mFileAction = action;
    }
    
    public int sendFile (String mSelectedFileName) {
        if (mSAFileTransfer == null) {
            SAft SAftPkg = new SAft();
            try {
                SAftPkg.initialize(this);
            } catch (SsdkUnsupportedException e) {
                if (e.getType() == SsdkUnsupportedException.DEVICE_NOT_SUPPORTED) {
                    Toast.makeText(getBaseContext(), "Cannot initialize, DEVICE_NOT_SUPPORTED", Toast.LENGTH_SHORT).show();
                } else if (e.getType() == SsdkUnsupportedException.LIBRARY_NOT_INSTALLED) {
                    Toast.makeText(getBaseContext(), "Cannot initialize, LIBRARY_NOT_INSTALLED.", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(getBaseContext(), "Cannot initialize, unknown.", Toast.LENGTH_SHORT).show();
                }
                e.printStackTrace();                
                return -1;
                
            } catch (Exception e1) {
                Toast.makeText(getBaseContext(), "Cannot initialize, SAFileTransfer.", Toast.LENGTH_SHORT).show();
                e1.printStackTrace();
                return -1;
            }
            mSAFileTransfer = new SAFileTransfer(FTSampleConsumerImpl.this, mCallback);
        }
        
        if (mSAFileTransfer != null && mPeerAgent != null) {
            return mSAFileTransfer.send(mPeerAgent, mSelectedFileName);
        } else {
            Toast.makeText(getBaseContext(), "Peer could not be found. Try again.", Toast.LENGTH_SHORT).show();
            findPeerAgents();
            return -1;
        }
    }

    public void cancelFileTransfer(int transId) {
        if(mSAFileTransfer != null) {
            mSAFileTransfer.cancel(transId);
        }
    }

    public class FTSampleConsumerConnection extends SASocket {
        public FTSampleConsumerConnection() {
            super(FTSampleConsumerConnection.class.getName());
        }

        @Override
        protected void onServiceConnectionLost(int errorCode) {
            Log.d(TAG, "connection lost for FT Sample");
            mConnection = null;
            if (mSAFileTransfer != null) {
                mFileAction.onError();
            }
            mPeerAgent = null;
        }

        @Override
        public void onReceive(int channelId, byte[] data) {

        }

        @Override
        public void onError(int channelId, String errorMessage, int errorCode) {

        }
    }


    public interface FileAction {
        void onError();
        void onProgress(int id, long progress);
        void onTransferComplete(String path);
    }
}
