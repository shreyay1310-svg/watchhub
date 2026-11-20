package com.watchhub.nativeapp.domain.usecase

import com.watchhub.nativeapp.domain.model.User
import com.watchhub.nativeapp.domain.repository.AuthRepository

class LoginUseCase(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String): Result<User> {
        if (email.isBlank()) {
            return Result.failure(IllegalArgumentException("Email cannot be empty."))
        }
        if (password.isBlank()) {
            return Result.failure(IllegalArgumentException("Password cannot be empty."))
        }
        return authRepository.login(email.trim(), password)
    }
}
