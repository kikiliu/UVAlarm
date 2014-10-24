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
 
 
package com.samsung.accessory.FTSampleConsumer.ui;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Environment;
import android.os.IBinder;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.samsung.accessory.FTSampleConsumer.R;
import com.samsung.accessory.FTSampleConsumer.backend.FTSampleConsumerImpl;
import com.samsung.accessory.FTSampleConsumer.backend.FTSampleConsumerImpl.FileAction;
import com.samsung.accessory.FTSampleConsumer.backend.FTSampleConsumerImpl.FTSampleBinder;

public class FTSampleConsumerActivity extends Activity implements OnClickListener {
    private static final String TAG = "FTSample/FTSampleConsumer";    
    private static final String SRC_PATH  = "/storage/emulated/legacy/src.aaa";

    private Button mBtnSend;
    private Button mBtnConn;
    private Button mBtnCancel;
    private ProgressBar mProgressBar;

    private Context mCtxt;
    private String mDirPath;
    private long currentTransId;
    private long mFileSize;
    private List<Long> mTransactions = new ArrayList<Long>();

    private FTSampleConsumerImpl mSampleService;

    private ServiceConnection mFTSampleConnection = new ServiceConnection() {
        @Override
        public void onServiceDisconnected(ComponentName name) {
            Log.i(TAG, "FT Sample service disconnected");
            mSampleService = null;
        }

        @Override
        public void onServiceConnected(ComponentName arg0, IBinder binder) {
        	mSampleService = ((FTSampleBinder) binder).getService();
        	mSampleService.registerFileAction(getFileAction());
        }
    };

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.ft_consumer_activity);

        mCtxt = getApplicationContext();

        mBtnSend = (Button) findViewById(R.id.Send);
        mBtnSend.setOnClickListener(this);
        mBtnConn = (Button) findViewById(R.id.connectButton);
        mBtnConn.setOnClickListener(this);
        mBtnCancel = (Button) findViewById(R.id.cancel);
        mBtnCancel.setOnClickListener(this);

        if (!Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            Toast.makeText(mCtxt, " No SDCARD Present", Toast.LENGTH_SHORT).show();
            finish();
        } else {
            mDirPath = Environment.getExternalStorageDirectory() + File.separator + "FTSample";
            File file = new File(mDirPath);
            if (file.mkdirs()) {
                Toast.makeText(mCtxt, " Stored in " + mDirPath, Toast.LENGTH_LONG).show();
            } 
        }

        getApplicationContext().bindService(new Intent(getApplicationContext(), FTSampleConsumerImpl.class),
                this.mFTSampleConnection, Context.BIND_AUTO_CREATE);

        mProgressBar = (ProgressBar) findViewById(R.id.fileTransferProgressBar);
        mProgressBar.setMax(100);
    }

    public void onDestroy() {
        getApplicationContext().unbindService(mFTSampleConnection);
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        moveTaskToBack(true);
    }
    
    // for Android before 2.0, just in case
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            moveTaskToBack(true);
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    public void onClick(View v) {
        if (v == mBtnSend) {
            File file = new File(SRC_PATH);
            mFileSize = file.length();
            Toast.makeText(mCtxt, SRC_PATH + " selected " + " size " + mFileSize + " bytes", Toast.LENGTH_SHORT).show();
            
            if (isFTSampleServiceBound()) {
                try {
                    int trId = mSampleService.sendFile(SRC_PATH);
                    mTransactions.add((long)trId);
                    currentTransId = trId;
                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(mCtxt, "IllegalArgumentException", Toast.LENGTH_SHORT).show();
                }
            }
        } else if(v == mBtnCancel) {
            if (mSampleService != null) {
                try {
                    mSampleService.cancelFileTransfer((int)currentTransId);
                    mTransactions.remove(currentTransId);
                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(mCtxt, "IllegalArgumentException", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(mCtxt, "no binding to service", Toast.LENGTH_SHORT).show();
            }
        } else if (v == mBtnConn) {
            if (mSampleService!=null){
            	mSampleService.connect();
            } else {
                Toast.makeText(getApplicationContext(), "Service not Bound", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private boolean isFTSampleServiceBound() {
        return this.mSampleService != null;
    }

    public void onError(MediaRecorder mr, int what, int extra) {
        Toast.makeText(mCtxt, " MAX SERVER DIED ", Toast.LENGTH_SHORT).show();
    }

    private FileAction getFileAction(){
        return new FileAction() {
            @Override
            public void onTransferComplete(String path) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mProgressBar.setProgress(0);
                        mTransactions.remove(currentTransId);
                        Toast.makeText(getBaseContext(), "Transfer Completed!", Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onProgress(int id, final long progress) {
                currentTransId = (long)id;
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mProgressBar.setProgress((int) progress);
                    }
                });
            }

            @Override
            public void onError() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mProgressBar.setProgress(0);
                        mTransactions.remove(currentTransId);
                        Toast.makeText(getBaseContext(), "Error", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        };
    }
}
