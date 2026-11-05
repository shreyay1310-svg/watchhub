
package com.watchhub.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Toast;
import java.io.File;

public class MainActivity extends Activity {

    // Official production Vercel deployment URL
    public static final String LIVE_PRODUCTION_URL = "https://watchhub-store-silk.vercel.app";
    public static final String OFFLINE_FALLBACK_URL = "file:///android_asset/www/index.html";

    private WebView mWebView;
    private ProgressBar mProgressBar;
    private long downloadId = -1;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Root container
        RelativeLayout rootLayout = new RelativeLayout(this);
        rootLayout.setBackgroundColor(0xFF101C2B); // WatchHub Navy

        // WebView configuration
        mWebView = new WebView(this);
        mWebView.setBackgroundColor(0xFF101C2B);
        RelativeLayout.LayoutParams webParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT
        );
        rootLayout.addView(mWebView, webParams);

        // Top loading progress bar
        mProgressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        mProgressBar.setMax(100);
        mProgressBar.setProgress(0);
        RelativeLayout.LayoutParams barParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                8
        );
        barParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        rootLayout.addView(mProgressBar, barParams);

        setContentView(rootLayout);

        // WebSettings
        WebSettings ws = mWebView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setDatabaseEnabled(true);
        ws.setAllowFileAccess(true);
        ws.setAllowContentAccess(true);
        ws.setLoadWithOverviewMode(true);
        ws.setUseWideViewPort(true);
        ws.setBuiltInZoomControls(false);
        ws.setDisplayZoomControls(false);
        ws.setSupportZoom(false);
        ws.setMediaPlaybackRequiresUserGesture(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ws.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Bridge for In-App Auto-Update Button
        mWebView.addJavascriptInterface(new AppUpdateJSInterface(this), "AndroidInstaller");

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    mProgressBar.setVisibility(View.VISIBLE);
                    mProgressBar.setProgress(newProgress);
                } else {
                    mProgressBar.setVisibility(View.GONE);
                }
            }
        });

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.endsWith(".apk") || url.contains("/downloads/")) {
                    downloadAndPromptInstall(url);
                    return true;
                }
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception ignored) {}
                }
                return false;
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                loadOfflineFallback();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    loadOfflineFallback();
                }
            }
        });

        // Intercept download events
        mWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                if (url.endsWith(".apk") || (mimeType != null && mimeType.contains("package-archive"))) {
                    downloadAndPromptInstall(url);
                } else {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                }
            }
        });

        // Initial Load: Check internet connectivity
        if (isNetworkAvailable()) {
            mWebView.loadUrl(LIVE_PRODUCTION_URL);
        } else {
            loadOfflineFallback();
        }
    }

    private boolean isNetworkAvailable() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo netInfo = cm != null ? cm.getActiveNetworkInfo() : null;
            return netInfo != null && netInfo.isConnected();
        } catch (Exception e) {
            return false;
        }
    }

    private void loadOfflineFallback() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    mWebView.loadUrl(OFFLINE_FALLBACK_URL);
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Offline mode activated.", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    /**
     * Downloads APK using DownloadManager and listens for completion to auto-launch the Package Installer.
     */
    public void downloadAndPromptInstall(String apkUrl) {
        Toast.makeText(this, "WatchHub: Downloading App Upgrade...", Toast.LENGTH_SHORT).show();

        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(apkUrl));
            request.setTitle("WatchHub App Upgrade");
            request.setDescription("Downloading latest WatchHub APK version...");
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
        } catch (Exception e) {
            Toast.makeText(this, "Download error: " + e.getMessage(), Toast.LENGTH_LONG).show();
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

            Uri apkUri = Uri.parse("content://" + getPackageName() + ".fileprovider/" + fileName);
            installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            startActivity(installIntent);
        } catch (Exception e) {
            Toast.makeText(this, "Installation error: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    public class AppUpdateJSInterface {
        private Context mContext;

        public AppUpdateJSInterface(Context context) {
            this.mContext = context;
        }

        @JavascriptInterface
        public void installApk(final String fileName) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    launchApkInstaller(fileName != null ? fileName : "WatchHub-update.apk");
                }
            });
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
