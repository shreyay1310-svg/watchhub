package com.watchhub.nativeapp.data.remote

import com.google.gson.annotations.SerializedName
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

// ============================================================================
// DTOs for WatchHub Authentication Contracts
// ============================================================================

data class UserDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("userId") val userId: String? = null,
    @SerializedName("name") val name: String? = null,
    @SerializedName("fullName") val fullName: String? = null,
    @SerializedName("email") val email: String = "",
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("role") val role: String = "Customer",
    @SerializedName("permissions") val permissions: List<String>? = null,
    @SerializedName("avatar") val avatar: String? = null,
    @SerializedName("avatarUrl") val avatarUrl: String? = null,
    @SerializedName("isEmailVerified") val isEmailVerified: Boolean = false
) {
    fun resolveId(): String = id ?: userId ?: ""
    fun resolveName(): String = name ?: fullName ?: email.substringBefore("@")
    fun resolveAvatar(): String? = avatar ?: avatarUrl
}

// 1. Password Login
data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)

data class LoginResponse(
    @SerializedName("status") val status: String,
    @SerializedName("message") val message: String? = null,
    @SerializedName("accessToken") val accessToken: String? = null,
    @SerializedName("user") val user: UserDto? = null
)

// 2. Email OTP Dispatch
data class SendEmailOtpRequest(
    @SerializedName("email") val email: String,
    @SerializedName("purpose") val purpose: String = "registration",
    @SerializedName("name") val name: String? = null
)

data class SendEmailOtpResponse(
    @SerializedName("status") val status: String,
    @SerializedName("message") val message: String? = null,
    @SerializedName("identifier") val identifier: String? = null,
    @SerializedName("channel") val channel: String? = null,
    @SerializedName("purpose") val purpose: String? = null,
    @SerializedName("expiresInSeconds") val expiresInSeconds: Int? = null,
    @SerializedName("cooldownSeconds") val cooldownSeconds: Int? = null,
    @SerializedName("waitSeconds") val waitSeconds: Int? = null
)

// 3. Email OTP Login
data class EmailLoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("otp") val otp: String
)

// 4. Registration
data class RegisterRequest(
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("phone") val phone: String? = null
)

// 5. Verify Registration OTP
data class VerifyEmailOtpRequest(
    @SerializedName("email") val email: String,
    @SerializedName("otp") val otp: String,
    @SerializedName("purpose") val purpose: String = "registration",
    @SerializedName("name") val name: String? = null,
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("password") val password: String? = null,
    @SerializedName("role") val role: String? = "Customer"
)

data class VerifyEmailOtpResponse(
    @SerializedName("status") val status: String,
    @SerializedName("verified") val verified: Boolean = false,
    @SerializedName("message") val message: String? = null,
    @SerializedName("accessToken") val accessToken: String? = null,
    @SerializedName("user") val user: UserDto? = null,
    @SerializedName("remainingAttempts") val remainingAttempts: Int? = null,
    @SerializedName("expired") val expired: Boolean? = null,
    @SerializedName("locked") val locked: Boolean? = null
)

// 6. Forgot Password
data class ForgotPasswordRequest(
    @SerializedName("email") val email: String
)

data class ForgotPasswordResponse(
    @SerializedName("status") val status: String,
    @SerializedName("message") val message: String? = null,
    @SerializedName("cooldownSeconds") val cooldownSeconds: Int? = null,
    @SerializedName("waitSeconds") val waitSeconds: Int? = null
)

// 7. Reset Password
data class ResetPasswordRequest(
    @SerializedName("email") val email: String,
    @SerializedName("otp") val otp: String,
    @SerializedName("newPassword") val newPassword: String
)

// 8. Generic / Me Responses
data class GetMeResponse(
    @SerializedName("status") val status: String,
    @SerializedName("user") val user: UserDto? = null
)

data class StandardApiResponse(
    @SerializedName("status") val status: String,
    @SerializedName("message") val message: String? = null,
    @SerializedName("remainingAttempts") val remainingAttempts: Int? = null,
    @SerializedName("expired") val expired: Boolean? = null
)

// ============================================================================
// Retrofit API Service Interface
// ============================================================================

interface AuthApiService {

    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<LoginResponse>

    @POST("auth/send-email-otp")
    suspend fun sendEmailOtp(
        @Body request: SendEmailOtpRequest
    ): Response<SendEmailOtpResponse>

    @POST("auth/email-login")
    suspend fun emailLogin(
        @Body request: EmailLoginRequest
    ): Response<LoginResponse>

    @POST("auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): Response<LoginResponse>

    @POST("auth/verify-email-otp")
    suspend fun verifyEmailOtp(
        @Body request: VerifyEmailOtpRequest
    ): Response<VerifyEmailOtpResponse>

    @POST("auth/forgot-password")
    suspend fun forgotPassword(
        @Body request: ForgotPasswordRequest
    ): Response<ForgotPasswordResponse>

    @POST("auth/reset-password")
    suspend fun resetPassword(
        @Body request: ResetPasswordRequest
    ): Response<StandardApiResponse>

    @GET("auth/me")
    suspend fun getMe(
        @Header("Authorization") bearerToken: String
    ): Response<GetMeResponse>
}
