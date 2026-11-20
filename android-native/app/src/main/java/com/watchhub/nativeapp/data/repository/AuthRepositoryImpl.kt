package com.watchhub.nativeapp.data.repository

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.watchhub.nativeapp.data.local.TokenManager
import com.watchhub.nativeapp.data.remote.AuthApiService
import com.watchhub.nativeapp.data.remote.EmailLoginRequest
import com.watchhub.nativeapp.data.remote.ForgotPasswordRequest
import com.watchhub.nativeapp.data.remote.LoginRequest
import com.watchhub.nativeapp.data.remote.RegisterRequest
import com.watchhub.nativeapp.data.remote.ResetPasswordRequest
import com.watchhub.nativeapp.data.remote.SendEmailOtpRequest
import com.watchhub.nativeapp.data.remote.VerifyEmailOtpRequest
import com.watchhub.nativeapp.domain.model.OtpDispatchInfo
import com.watchhub.nativeapp.domain.model.User
import com.watchhub.nativeapp.domain.repository.AuthRepository
import com.watchhub.nativeapp.domain.repository.AuthState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import retrofit2.Response
import java.io.IOException

class AuthRepositoryImpl(
    private val apiService: AuthApiService,
    private val tokenManager: TokenManager,
    private val gson: Gson = Gson()
) : AuthRepository {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Initial)
    override val authState: StateFlow<AuthState> = _authState.asStateFlow()

    init {
        val savedUser = tokenManager.getUser()
        val token = tokenManager.getAccessToken()
        if (token != null && savedUser != null) {
            _authState.value = AuthState.Authenticated(savedUser)
        } else {
            _authState.value = AuthState.Unauthenticated
        }
    }

    private fun extractErrorMessage(response: Response<*>): String {
        return try {
            val errorBody = response.errorBody()?.string()
            if (!errorBody.isNullOrBlank()) {
                val json = gson.fromJson(errorBody, JsonObject::class.java)
                json.get("message")?.asString ?: "Operation failed (HTTP ${response.code()})"
            } else {
                "Server returned HTTP ${response.code()}"
            }
        } catch (_: Exception) {
            "Unexpected error occurred (HTTP ${response.code()})"
        }
    }

    override suspend fun login(email: String, password: String): Result<User> {
        _authState.value = AuthState.Loading
        return try {
            val response = apiService.login(LoginRequest(email.trim().lowercase(), password.trim()))
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val token = body.accessToken ?: ""
                val dto = body.user

                val user = User(
                    id = dto?.resolveId() ?: "",
                    name = dto?.resolveName() ?: email.substringBefore("@"),
                    email = dto?.email ?: email,
                    role = dto?.role ?: "Customer",
                    permissions = dto?.permissions ?: emptyList(),
                    avatar = dto?.resolveAvatar()
                )

                tokenManager.saveAccessToken(token)
                tokenManager.saveUser(user)
                _authState.value = AuthState.Authenticated(user)
                Result.success(user)
            } else {
                val msg = extractErrorMessage(response)
                _authState.value = AuthState.Error(msg)
                Result.failure(Exception(msg))
            }
        } catch (e: IOException) {
            val msg = "Network communication failure. Please verify your connection."
            _authState.value = AuthState.Error(msg)
            Result.failure(Exception(msg))
        } catch (e: Exception) {
            val msg = e.message ?: "Authentication error."
            _authState.value = AuthState.Error(msg)
            Result.failure(Exception(msg))
        }
    }

    override suspend fun sendEmailOtp(
        email: String,
        purpose: String,
        name: String?
    ): Result<OtpDispatchInfo> {
        return try {
            val response = apiService.sendEmailOtp(
                SendEmailOtpRequest(email = email.trim().lowercase(), purpose = purpose, name = name)
            )
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val info = OtpDispatchInfo(
                    identifier = body.identifier ?: email,
                    message = body.message ?: "Verification code dispatched.",
                    cooldownSeconds = body.cooldownSeconds ?: 60,
                    expiresInSeconds = body.expiresInSeconds ?: 300
                )
                Result.success(info)
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: IOException) {
            Result.failure(Exception("Network communication failure. Unable to reach email gateway."))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun emailLogin(email: String, otp: String): Result<User> {
        _authState.value = AuthState.Loading
        return try {
            val response = apiService.emailLogin(
                EmailLoginRequest(email = email.trim().lowercase(), otp = otp.trim())
            )
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val token = body.accessToken ?: ""
                val dto = body.user

                val user = User(
                    id = dto?.resolveId() ?: "",
                    name = dto?.resolveName() ?: email.substringBefore("@"),
                    email = dto?.email ?: email,
                    role = dto?.role ?: "Customer",
                    permissions = dto?.permissions ?: emptyList(),
                    avatar = dto?.resolveAvatar(),
                    isEmailVerified = true
                )

                tokenManager.saveAccessToken(token)
                tokenManager.saveUser(user)
                _authState.value = AuthState.Authenticated(user)
                Result.success(user)
            } else {
                val msg = extractErrorMessage(response)
                _authState.value = AuthState.Error(msg)
                Result.failure(Exception(msg))
            }
        } catch (e: IOException) {
            val msg = "Network communication failure. Please verify connection."
            _authState.value = AuthState.Error(msg)
            Result.failure(Exception(msg))
        } catch (e: Exception) {
            val msg = e.message ?: "Email sign-in failed."
            _authState.value = AuthState.Error(msg)
            Result.failure(Exception(msg))
        }
    }

    override suspend fun register(
        name: String,
        email: String,
        password: String,
        phone: String?
    ): Result<User> {
        _authState.value = AuthState.Loading
        return try {
            val response = apiService.register(
                RegisterRequest(name = name.trim(), email = email.trim().lowercase(), password = password.trim(), phone = phone?.trim())
            )
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val token = body.accessToken ?: ""
                val dto = body.user

                val user = User(
                    id = dto?.resolveId() ?: "",
                    name = dto?.resolveName() ?: name,
                    email = dto?.email ?: email,
                    role = dto?.role ?: "Customer",
                    permissions = dto?.permissions ?: emptyList(),
                    avatar = dto?.resolveAvatar(),
                    isEmailVerified = true
                )

                tokenManager.saveAccessToken(token)
                tokenManager.saveUser(user)
                _authState.value = AuthState.Authenticated(user)
                Result.success(user)
            } else {
                val msg = extractErrorMessage(response)
                _authState.value = AuthState.Error(msg)
                Result.failure(Exception(msg))
            }
        } catch (e: IOException) {
            val msg = "Network failure during registration. Please verify connection."
            _authState.value = AuthState.Error(msg)
            Result.failure(Exception(msg))
        } catch (e: Exception) {
            val msg = e.message ?: "Registration failed."
            _authState.value = AuthState.Error(msg)
            Result.failure(Exception(msg))
        }
    }

    override suspend fun verifyRegistrationOtp(
        email: String,
        otp: String,
        name: String?,
        phone: String?,
        password: String?
    ): Result<User> {
        _authState.value = AuthState.Loading
        return try {
            val response = apiService.verifyEmailOtp(
                VerifyEmailOtpRequest(
                    email = email.trim().lowercase(),
                    otp = otp.trim(),
                    purpose = "registration",
                    name = name?.trim(),
                    phone = phone?.trim(),
                    password = password?.trim()
                )
            )
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val token = body.accessToken ?: ""
                val dto = body.user

                val user = User(
                    id = dto?.resolveId() ?: "",
                    name = dto?.resolveName() ?: name ?: email.substringBefore("@"),
                    email = dto?.email ?: email,
                    role = dto?.role ?: "Customer",
                    permissions = dto?.permissions ?: emptyList(),
                    avatar = dto?.resolveAvatar(),
                    isEmailVerified = true
                )

                if (token.isNotBlank()) {
                    tokenManager.saveAccessToken(token)
                }
                tokenManager.saveUser(user)
                _authState.value = AuthState.Authenticated(user)
                Result.success(user)
            } else {
                val msg = extractErrorMessage(response)
                _authState.value = AuthState.Error(msg)
                Result.failure(Exception(msg))
            }
        } catch (e: IOException) {
            val msg = "Network failure during OTP verification."
            _authState.value = AuthState.Error(msg)
            Result.failure(Exception(msg))
        } catch (e: Exception) {
            val msg = e.message ?: "OTP verification error."
            _authState.value = AuthState.Error(msg)
            Result.failure(Exception(msg))
        }
    }

    override suspend fun forgotPassword(email: String): Result<Int> {
        return try {
            val response = apiService.forgotPassword(ForgotPasswordRequest(email = email.trim().lowercase()))
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()?.cooldownSeconds ?: 60)
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: IOException) {
            Result.failure(Exception("Network failure. Unable to reach recovery gateway."))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun resetPassword(
        email: String,
        otp: String,
        newPassword: String
    ): Result<String> {
        return try {
            val response = apiService.resetPassword(
                ResetPasswordRequest(
                    email = email.trim().lowercase(),
                    otp = otp.trim(),
                    newPassword = newPassword.trim()
                )
            )
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()?.message ?: "Password reset confirmed.")
            } else {
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: IOException) {
            Result.failure(Exception("Network failure during password reset."))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getCurrentUser(): Result<User> {
        val token = tokenManager.getAccessToken()
        if (token.isNullOrBlank()) {
            _authState.value = AuthState.Unauthenticated
            return Result.failure(Exception("No authentication token stored."))
        }

        return try {
            val response = apiService.getMe("Bearer $token")
            if (response.isSuccessful && response.body()?.user != null) {
                val dto = response.body()!!.user!!
                val user = User(
                    id = dto.resolveId(),
                    name = dto.resolveName(),
                    email = dto.email,
                    role = dto.role,
                    permissions = dto.permissions ?: emptyList(),
                    avatar = dto.resolveAvatar(),
                    isEmailVerified = dto.isEmailVerified
                )
                tokenManager.saveUser(user)
                _authState.value = AuthState.Authenticated(user)
                Result.success(user)
            } else {
                if (response.code() == 401) {
                    tokenManager.clearTokens()
                    _authState.value = AuthState.Unauthenticated
                }
                Result.failure(Exception(extractErrorMessage(response)))
            }
        } catch (e: Exception) {
            // Offline fallback: if token is present, preserve cached user
            val cachedUser = tokenManager.getUser()
            if (cachedUser != null) {
                _authState.value = AuthState.Authenticated(cachedUser)
                Result.success(cachedUser)
            } else {
                _authState.value = AuthState.Unauthenticated
                Result.failure(e)
            }
        }
    }

    override suspend fun validateSessionOnLaunch(): Boolean {
        val token = tokenManager.getAccessToken()
        if (token.isNullOrBlank()) {
            _authState.value = AuthState.Unauthenticated
            return false
        }
        val result = getCurrentUser()
        return result.isSuccess
    }

    override fun logout() {
        tokenManager.clearTokens()
        _authState.value = AuthState.Unauthenticated
    }

    override fun isAuthenticated(): Boolean {
        return !tokenManager.getAccessToken().isNullOrBlank()
    }

    override fun getSavedUser(): User? {
        return tokenManager.getUser()
    }
}
