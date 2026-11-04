package com.watchhub.app;

import android.annotation.SuppressLint;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import java.io.File;

public class MainActivity extends AppCompatActivity {

    private WebView mWebView;
    private long downloadId = -1;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mWebView = new WebView(this);
        setContentView(mWebView);

        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(false);

        // Inject Native In-App Auto-Update Bridge
        mWebView.addJavascriptInterface(new AppUpdateJSInterface(this), "AndroidInstaller");

        mWebView.setWebViewClient(new WebViewClient());
        mWebView.setWebChromeClient(new WebChromeClient());

        // Intercept .apk downloads and handle with DownloadManager & auto-installer
        mWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                if (url.endsWith(".apk") || (mimeType != null && mimeType.contains("package-archive"))) {
                    downloadAndPromptInstall(url);
                } else {
                    Intent intent = new Intent(Intent.ACTION_VIEW);
                    intent.setData(Uri.parse(url));
                    startActivity(intent);
                }
            }
        });

        // Load WatchHub Live Storefront (or packaged assets)
        mWebView.loadUrl("https://watchhub-store.vercel.app"); // or http://localhost:5173
    }

    /**
     * Downloads APK using DownloadManager and listens for completion to auto-launch the Package Installer.
     */
    private void downloadAndPromptInstall(String apkUrl) {
        Toast.makeText(this, "WatchHub: Downloading App Update...", Toast.LENGTH_SHORT).show();

        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(apkUrl));
        request.setTitle("WatchHub App Update");
        request.setDescription("Downloading latest WatchHub version...");
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        request.setDestinationInExternalFilesDir(this, Environment.DIRECTORY_DOWNLOADS, "WatchHub-update.apk");
        request.setMimeType("application/vnd.android.package-archive");

        DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        if (dm != null) {
            downloadId = dm.enqueue(request);

            registerReceiver(new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                    if (id == downloadId) {
                        launchApkInstaller("WatchHub-update.apk");
                    }
                }
            }, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
        }
    }

    /**
     * Launches Android Package Installer Intent for in-place upgrade.
     */
    public void launchApkInstaller(String fileName) {
        try {
            File apkFile = new File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), fileName);
            if (!apkFile.exists()) {
                Toast.makeText(this, "APK download in progress. Please wait...", Toast.LENGTH_SHORT).show();
                return;
            }

            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                Uri apkUri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", apkFile);
                installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                installIntent.setDataAndType(Uri.fromFile(apkFile), "application/vnd.android.package-archive");
            }

            startActivity(installIntent);
        } catch (Exception e) {
            Toast.makeText(this, "Error installing update: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    public class AppUpdateJSInterface {
        private Context mContext;

        public AppUpdateJSInterface(Context context) {
            this.mContext = context;
        }

        @JavascriptInterface
        public void installApk(String fileName) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    launchApkInstaller(fileName);
                }
            });
        }
    }

    @Override
    public void onBackPressed() {
        if (mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}

