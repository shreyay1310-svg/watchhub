package com.watchhub.nativeapp.ui.navigation

sealed class Screen(val route: String) {
    data object Splash : Screen("splash")
    data object Login : Screen("login")
    data object Register : Screen("register")
    data object ForgotPassword : Screen("forgot_password")
    data object ResetPassword : Screen("reset_password?email={email}") {
        fun createRoute(email: String): String = "reset_password?email=$email"
    }
    data object OtpVerify : Screen("otp_verify?email={email}&purpose={purpose}") {
        fun createRoute(email: String, purpose: String = "registration"): String =
            "otp_verify?email=$email&purpose=$purpose"
    }
    data object Dashboard : Screen("dashboard")
}
