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
 
 
package com.samsung.accessory.FTSampleProvider.backend;

import java.io.UnsupportedEncodingException;

import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import com.samsung.accessory.FTSampleProvider.ui.FTSampleProviderActivity;
import com.samsung.android.sdk.SsdkUnsupportedException;
import com.samsung.android.sdk.accessory.SAAgent;
import com.samsung.android.sdk.accessory.SAPeerAgent;
import com.samsung.android.sdk.accessory.SASocket;
import com.samsung.android.sdk.accessoryfiletransfer.SAFileTransfer;
import com.samsung.android.sdk.accessoryfiletransfer.SAFileTransfer.EventListener;
import com.samsung.android.sdk.accessoryfiletransfer.SAft;

public class FTSampleProviderImpl extends SAAgent {
    private static final String TAG = "FTSampleProviderImpl";
    public static final int MSG_PUSHFILE_ACCEPTED = 1;
    public static final int MSG_PUSHFILE_NOT_ACCEPTED = 2;

    private FileAction mFileAction = null;

    private final IBinder mBinder = new LocalBinder();
    private FTSampleProviderConnection mConnection = null;
    private SAFileTransfer mSAFileTransfer = null;
    private EventListener mCallback;
    
    private Context mContext;

    public FTSampleProviderImpl() {
        super("FTSampleProviderImpl", FTSampleProviderConnection.class);
    }

    public class LocalBinder extends Binder {
        public FTSampleProviderImpl getService() {
            return FTSampleProviderImpl.this;
        }
    }

    @Override
    public IBinder onBind(Intent arg0) {
        // super.findPeerAgents();
        return mBinder;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        mContext = getApplicationContext();
        Log.d(TAG, "On Create of Sample Provider Service");

        mCallback = new EventListener() {                
            @Override
            public void onProgressChanged(int transId, int progress) {
                Log.d(TAG, "onTransferProgress : " + progress + " transId : " + transId);

                if (mFileAction != null) {
                    mFileAction.onProgress(progress);
                }
            }
                
            @Override
            public void onTransferCompleted(int transId, String fileName, int errorCode) {
                Log.d(TAG, "onTransferComplete,  tr id : " + transId +  " file name : " + fileName + " error code : " + errorCode);
                if (errorCode == 0) {
                    mFileAction.onTransferComplete(fileName);
                } else {
                    mFileAction.onError("Error", errorCode);
                }
            }                

            @Override
            public void onTransferRequested(int id, String fileName) {
                Log.d(TAG, "onTransferRequested,  tr id : " + id +  " file name : " + fileName);
                if (FTSampleProviderActivity.isUp)
                    mFileAction.onTransferRequested(id, fileName);
                else
                    mContext.startActivity(new Intent().setClass(mContext, FTSampleProviderActivity.class)
                                                       .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                                       .setAction("incomingFT")
                                                       .putExtra("tx", id)
                                                       .putExtra("fileName", fileName));
            }

        };

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
            return;
        } catch (Exception e1) {
            Toast.makeText(getBaseContext(), "Cannot initialize, SAFileTransfer.", Toast.LENGTH_SHORT).show();
            e1.printStackTrace();
            return;
        }
        
        mSAFileTransfer = new SAFileTransfer(FTSampleProviderImpl.this, mCallback);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.i(TAG, "Service Stopped.");
    }

    public void onDataAvailableonChannel(int connectionId, long channelId, String data) {
        Log.i(TAG, " This is response received" + data);
    }

    @Override
    protected void onServiceConnectionResponse(SASocket uSocket, int error) {
        if (error == 0) {
        	FTSampleProviderConnection localConnection = (FTSampleProviderConnection) uSocket;
            if (uSocket != null) {
                mConnection = localConnection;
                Toast.makeText(getBaseContext(), "Connection established for FT", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onFindPeerAgentResponse(SAPeerAgent peerAgent, int result) {
    }

    public void registerFileAction(FileAction action){
        this.mFileAction = action;
    }

    public void cancelFileTransfer(int transId) {
        if (mSAFileTransfer != null) { 
            mSAFileTransfer.cancel(transId);
        }
    }

    public void receiveFile(int transId, String path, boolean bAccept) {
        Log.d(TAG, "receiving file : transId: " + transId + "bAccept : " + bAccept);
        if (mSAFileTransfer != null) {
            if (bAccept) {
                mSAFileTransfer.receive(transId, path);
            } else {
                mSAFileTransfer.reject(transId);
            }
        }
    }

    public class FTSampleProviderConnection extends SASocket {
        public static final String TAG = "FTSampleProviderConnection";
        int mConnectionId;

        public FTSampleProviderConnection() {
            super(FTSampleProviderConnection.class.getName());
        }

        @Override
        protected void onServiceConnectionLost(int errorCode) {
            Log.e(TAG, "onServiceConectionLost  for peer = " + mConnectionId + "error code =" + errorCode);
            mConnection = null;
        }

        @Override
        public void onReceive(int channelId, byte[] data) {
            try {
                onDataAvailableonChannel(mConnectionId, channelId, new String(data, "UTF-8"));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onError(int channelId, String errorMessage, int errorCode) {
            mFileAction.onError(errorMessage, errorCode);
            Log.e(TAG, "Connection is not alive ERROR: " + errorMessage + "  " + errorCode);
        }
    }

    public interface FileAction {
        void onError(String errorMsg, int errorCode);
        void onProgress(long progress);
        void onTransferComplete(String path);
        void onTransferRequested(int id, String path);
    }
}
