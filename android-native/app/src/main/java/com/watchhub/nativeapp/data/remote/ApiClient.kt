package com.watchhub.nativeapp.data.remote

import com.watchhub.nativeapp.BuildConfig
import com.watchhub.nativeapp.data.local.TokenManager
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    private fun createLoggingInterceptor(): HttpLoggingInterceptor {
        return HttpLoggingInterceptor().apply {
            level = if (BuildConfig.IS_DEBUG) {
                HttpLoggingInterceptor.Level.HEADERS
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
            // Strict Security: Redact sensitive tokens and credentials from logs
            redactHeader("Authorization")
            redactHeader("Cookie")
            redactHeader("Set-Cookie")
        }
    }

    fun createHttpClient(
        tokenManager: TokenManager? = null,
        onUnauthorized: (() -> Unit)? = null
    ): OkHttpClient {
        val builder = OkHttpClient.Builder()
            .addInterceptor(createLoggingInterceptor())
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)

        if (tokenManager != null) {
            builder.addInterceptor(AuthInterceptor(tokenManager, onUnauthorized))
        }

        return builder.build()
    }

    fun createRetrofit(
        baseUrl: String = BuildConfig.BASE_URL,
        httpClient: OkHttpClient
    ): Retrofit {
        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(httpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    fun createAuthService(
        baseUrl: String = BuildConfig.BASE_URL,
        tokenManager: TokenManager? = null,
        onUnauthorized: (() -> Unit)? = null
    ): AuthApiService {
        val client = createHttpClient(tokenManager, onUnauthorized)
        val retrofit = createRetrofit(baseUrl, client)
        return retrofit.create(AuthApiService::class.java)
    }
}
