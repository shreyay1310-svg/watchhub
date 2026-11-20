package com.watchhub.nativeapp.domain.model

data class User(
    val id: String,
    val name: String,
    val email: String,
    val role: String = "Customer",
    val permissions: List<String> = emptyList(),
    val avatar: String? = null,
    val isEmailVerified: Boolean = true
)

data class OtpDispatchInfo(
    val identifier: String,
    val message: String,
    val cooldownSeconds: Int = 60,
    val expiresInSeconds: Int = 300
)

data class AuthTokens(
    val accessToken: String,
    val refreshToken: String? = null,
    val expiresInSeconds: Long = 3600
)
