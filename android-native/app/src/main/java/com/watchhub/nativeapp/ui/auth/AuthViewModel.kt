package com.watchhub.nativeapp.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.watchhub.nativeapp.domain.model.User
import com.watchhub.nativeapp.domain.repository.AuthRepository
import com.watchhub.nativeapp.domain.repository.AuthState
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AuthUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val successMessage: String? = null,
    val otpCooldownSeconds: Int = 0,
    val currentUser: User? = null
)

class AuthViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {

    val authState: StateFlow<AuthState> = authRepository.authState

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    private var cooldownJob: Job? = null

    init {
        viewModelScope.launch {
            authRepository.authState.collect { state ->
                when (state) {
                    is AuthState.Authenticated -> {
                        _uiState.update { it.copy(currentUser = state.user, isLoading = false, errorMessage = null) }
                    }
                    is AuthState.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                    is AuthState.Error -> {
                        _uiState.update { it.copy(isLoading = false, errorMessage = state.message) }
                    }
                    is AuthState.Unauthenticated -> {
                        _uiState.update { it.copy(currentUser = null, isLoading = false) }
                    }
                    else -> {}
                }
            }
        }
    }

    fun clearMessages() {
        _uiState.update { it.copy(errorMessage = null, successMessage = null) }
    }

    private fun startCooldownTimer(seconds: Int) {
        cooldownJob?.cancel()
        _uiState.update { it.copy(otpCooldownSeconds = seconds) }
        cooldownJob = viewModelScope.launch {
            for (i in seconds downTo 1) {
                _uiState.update { it.copy(otpCooldownSeconds = i) }
                delay(1000)
            }
            _uiState.update { it.copy(otpCooldownSeconds = 0) }
        }
    }

    fun loginWithPassword(email: String, password: String, onSuccess: () -> Unit) {
        if (!validateEmail(email)) return
        if (password.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Please enter your password.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, successMessage = null) }
            val result = authRepository.login(email.trim(), password)
            if (result.isSuccess) {
                _uiState.update { it.copy(isLoading = false, successMessage = "Authentication successful.") }
                onSuccess()
            } else {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = result.exceptionOrNull()?.message ?: "Login failed."
                    )
                }
            }
        }
    }

    fun sendEmailOtp(email: String, purpose: String = "login", onSuccess: () -> Unit = {}) {
        if (!validateEmail(email)) return
        if (_uiState.value.otpCooldownSeconds > 0) {
            _uiState.update { it.copy(errorMessage = "Please wait ${_uiState.value.otpCooldownSeconds}s before resending.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, successMessage = null) }
            val result = authRepository.sendEmailOtp(email.trim(), purpose)
            if (result.isSuccess) {
                val info = result.getOrNull()!!
                startCooldownTimer(info.cooldownSeconds)
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        successMessage = info.message
                    )
                }
                onSuccess()
            } else {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = result.exceptionOrNull()?.message ?: "Failed to dispatch verification code."
                    )
                }
            }
        }
    }

    fun loginWithOtp(email: String, otp: String, onSuccess: () -> Unit) {
        if (!validateEmail(email)) return
        if (otp.length != 6) {
            _uiState.update { it.copy(errorMessage = "Please enter the complete 6-digit OTP code.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, successMessage = null) }
            val result = authRepository.emailLogin(email.trim(), otp.trim())
            if (result.isSuccess) {
                _uiState.update { it.copy(isLoading = false, successMessage = "Sign-in confirmed.") }
                onSuccess()
            } else {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = result.exceptionOrNull()?.message ?: "Invalid verification code."
                    )
                }
            }
        }
    }

    fun register(name: String, email: String, password: String, phone: String? = null, onSuccess: () -> Unit) {
        if (name.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Full name is required.") }
            return
        }
        if (!validateEmail(email)) return
        if (password.length < 6) {
            _uiState.update { it.copy(errorMessage = "Password must be at least 6 characters.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, successMessage = null) }
            val result = authRepository.register(name.trim(), email.trim(), password, phone?.trim())
            if (result.isSuccess) {
                _uiState.update { it.copy(isLoading = false, successMessage = "Registration successful.") }
                onSuccess()
            } else {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = result.exceptionOrNull()?.message ?: "Registration failed."
                    )
                }
            }
        }
    }

    fun verifyRegistrationOtp(
        email: String,
        otp: String,
        name: String? = null,
        phone: String? = null,
        password: String? = null,
        onSuccess: () -> Unit
    ) {
        if (!validateEmail(email)) return
        if (otp.length != 6) {
            _uiState.update { it.copy(errorMessage = "Please enter the complete 6-digit OTP code.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, successMessage = null) }
            val result = authRepository.verifyRegistrationOtp(
                email.trim(),
                otp.trim(),
                name,
                phone,
                password
            )
            if (result.isSuccess) {
                _uiState.update { it.copy(isLoading = false, successMessage = "Account verified and activated.") }
                onSuccess()
            } else {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = result.exceptionOrNull()?.message ?: "OTP verification failed."
                    )
                }
            }
        }
    }

    fun forgotPassword(email: String, onSuccess: () -> Unit) {
        if (!validateEmail(email)) return

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, successMessage = null) }
            val result = authRepository.forgotPassword(email.trim())
            if (result.isSuccess) {
                val cooldown = result.getOrNull() ?: 60
                startCooldownTimer(cooldown)
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        successMessage = "Recovery code sent if account exists."
                    )
                }
                onSuccess()
            } else {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = result.exceptionOrNull()?.message ?: "Recovery dispatch failed."
                    )
                }
            }
        }
    }

    fun resetPassword(email: String, otp: String, newPass: String, confirmPass: String, onSuccess: () -> Unit) {
        if (!validateEmail(email)) return
        if (otp.length != 6) {
            _uiState.update { it.copy(errorMessage = "Please enter the complete 6-digit code.") }
            return
        }
        if (newPass.length < 6) {
            _uiState.update { it.copy(errorMessage = "Password must be at least 6 characters.") }
            return
        }
        if (newPass != confirmPass) {
            _uiState.update { it.copy(errorMessage = "Passwords do not match.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null, successMessage = null) }
            val result = authRepository.resetPassword(email.trim(), otp.trim(), newPass)
            if (result.isSuccess) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        successMessage = "Password successfully reset. Please sign in."
                    )
                }
                onSuccess()
            } else {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = result.exceptionOrNull()?.message ?: "Password reset failed."
                    )
                }
            }
        }
    }

    fun logout(onSuccess: () -> Unit = {}) {
        viewModelScope.launch {
            authRepository.logout()
            _uiState.update { AuthUiState() }
            onSuccess()
        }
    }

    private fun validateEmail(email: String): Boolean {
        if (email.isBlank() || !email.contains("@") || !email.contains(".")) {
            _uiState.update { it.copy(errorMessage = "Please enter a valid email address.") }
            return false
        }
        return true
    }

    class Factory(private val authRepository: AuthRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            if (modelClass.isAssignableFrom(AuthViewModel::class.java)) {
                return AuthViewModel(authRepository) as T
            }
            throw IllegalArgumentException("Unknown ViewModel class")
        }
    }
}
