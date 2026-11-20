package com.watchhub.nativeapp.domain.repository

import com.watchhub.nativeapp.domain.model.OtpDispatchInfo
import com.watchhub.nativeapp.domain.model.User
import kotlinx.coroutines.flow.StateFlow

sealed class AuthState {
    data object Initial : AuthState()
    data object Loading : AuthState()
    data class Authenticated(val user: User) : AuthState()
    data object Unauthenticated : AuthState()
    data class Error(val message: String) : AuthState()
}

interface AuthRepository {
    val authState: StateFlow<AuthState>

    suspend fun login(email: String, password: String): Result<User>
    suspend fun sendEmailOtp(email: String, purpose: String = "registration", name: String? = null): Result<OtpDispatchInfo>
    suspend fun emailLogin(email: String, otp: String): Result<User>
    suspend fun register(name: String, email: String, password: String, phone: String? = null): Result<User>
    suspend fun verifyRegistrationOtp(
        email: String,
        otp: String,
        name: String? = null,
        phone: String? = null,
        password: String? = null
    ): Result<User>
    suspend fun forgotPassword(email: String): Result<Int>
    suspend fun resetPassword(email: String, otp: String, newPassword: String): Result<String>
    suspend fun getCurrentUser(): Result<User>
    suspend fun validateSessionOnLaunch(): Boolean
    fun logout()
    fun isAuthenticated(): Boolean
    fun getSavedUser(): User?
}
