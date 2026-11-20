package com.watchhub.nativeapp.data.remote

import com.watchhub.nativeapp.data.local.TokenManager
import okhttp3.Interceptor
import okhttp3.Response

/**
 * OkHttp Interceptor that dynamically attaches the stored JWT Bearer token
 * to protected requests and handles HTTP 401 Unauthorized responses by clearing credentials.
 */
class AuthInterceptor(
    private val tokenManager: TokenManager,
    private val onUnauthorized: (() -> Unit)? = null
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()

        // If the request already has an Authorization header or is a public auth route, proceed
        val token = tokenManager.getAccessToken()
        val requestBuilder = originalRequest.newBuilder()

        val isPublicAuth = originalRequest.url.encodedPath.contains("auth/login") ||
                originalRequest.url.encodedPath.contains("auth/register") ||
                originalRequest.url.encodedPath.contains("auth/send-email-otp") ||
                originalRequest.url.encodedPath.contains("auth/email-login") ||
                originalRequest.url.encodedPath.contains("auth/forgot-password") ||
                originalRequest.url.encodedPath.contains("auth/reset-password")

        if (!token.isNullOrBlank() && !isPublicAuth && originalRequest.header("Authorization") == null) {
            requestBuilder.header("Authorization", "Bearer $token")
        }

        val response = chain.proceed(requestBuilder.build())

        // Handle HTTP 401 Unauthorized: clear invalid/expired credentials
        if (response.code == 401) {
            tokenManager.clearTokens()
            onUnauthorized?.invoke()
        }

        return response
    }
}
