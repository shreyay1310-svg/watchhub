package com.watchhub.nativeapp.data.local

import com.watchhub.nativeapp.domain.model.User

interface TokenManager {
    fun saveAccessToken(accessToken: String)
    fun saveTokens(accessToken: String, refreshToken: String?)
    fun getAccessToken(): String?
    fun getRefreshToken(): String?
    fun saveUser(user: User)
    fun getUser(): User?
    fun clearTokens()
}
