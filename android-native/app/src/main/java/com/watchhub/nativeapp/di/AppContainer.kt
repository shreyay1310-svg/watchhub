package com.watchhub.nativeapp.di

import android.content.Context
import com.watchhub.nativeapp.data.local.EncryptedTokenManager
import com.watchhub.nativeapp.data.local.TokenManager
import com.watchhub.nativeapp.data.remote.ApiClient
import com.watchhub.nativeapp.data.remote.AuthApiService
import com.watchhub.nativeapp.data.repository.AuthRepositoryImpl
import com.watchhub.nativeapp.domain.repository.AuthRepository

interface AppContainer {
    val tokenManager: TokenManager
    val authApiService: AuthApiService
    val authRepository: AuthRepository
}

class DefaultAppContainer(private val context: Context) : AppContainer {

    override val tokenManager: TokenManager by lazy {
        EncryptedTokenManager(context)
    }

    override val authApiService: AuthApiService by lazy {
        ApiClient.createAuthService(
            tokenManager = tokenManager,
            onUnauthorized = {
                authRepository.logout()
            }
        )
    }

    override val authRepository: AuthRepository by lazy {
        AuthRepositoryImpl(authApiService, tokenManager)
    }
}
