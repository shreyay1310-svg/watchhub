package com.watchhub.nativeapp

import android.app.Application
import com.watchhub.nativeapp.di.AppContainer
import com.watchhub.nativeapp.di.DefaultAppContainer

class WatchHubApplication : Application() {

    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = DefaultAppContainer(applicationContext)
    }
}
