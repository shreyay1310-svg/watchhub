package com.watchhub.nativeapp.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.watchhub.nativeapp.WatchHubApplication
import com.watchhub.nativeapp.domain.repository.AuthState
import com.watchhub.nativeapp.ui.auth.AuthViewModel
import com.watchhub.nativeapp.ui.auth.ForgotPasswordScreen
import com.watchhub.nativeapp.ui.auth.LoginScreen
import com.watchhub.nativeapp.ui.auth.OtpVerificationScreen
import com.watchhub.nativeapp.ui.auth.RegisterScreen
import com.watchhub.nativeapp.ui.auth.ResetPasswordScreen
import com.watchhub.nativeapp.ui.auth.SplashScreen
import com.watchhub.nativeapp.ui.dashboard.DashboardScreen

@Composable
fun AppNavigation(
    navController: NavHostController = rememberNavController()
) {
    val context = LocalContext.current
    val app = context.applicationContext as WatchHubApplication
    val authRepository = app.container.authRepository

    val viewModel: AuthViewModel = viewModel(
        factory = AuthViewModel.Factory(authRepository)
    )

    val authState by viewModel.authState.collectAsState()

    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route
    ) {
        composable(Screen.Splash.route) {
            SplashScreen(
                onSplashFinished = {
                    if (authRepository.isAuthenticated()) {
                        navController.navigate(Screen.Dashboard.route) {
                            popUpTo(Screen.Splash.route) { inclusive = true }
                        }
                    } else {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(Screen.Splash.route) { inclusive = true }
                        }
                    }
                }
            )
        }

        composable(Screen.Login.route) {
            LoginScreen(
                viewModel = viewModel,
                onNavigateToDashboard = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    viewModel.clearMessages()
                    navController.navigate(Screen.Register.route)
                },
                onNavigateToForgotPassword = {
                    viewModel.clearMessages()
                    navController.navigate(Screen.ForgotPassword.route)
                }
            )
        }

        composable(Screen.Register.route) {
            RegisterScreen(
                viewModel = viewModel,
                onNavigateToLogin = {
                    viewModel.clearMessages()
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Register.route) { inclusive = true }
                    }
                },
                onNavigateToDashboard = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Register.route) { inclusive = true }
                    }
                },
                onNavigateToOtpVerify = { email, _ ->
                    viewModel.clearMessages()
                    navController.navigate(Screen.OtpVerify.createRoute(email, "registration"))
                }
            )
        }

        composable(Screen.ForgotPassword.route) {
            ForgotPasswordScreen(
                viewModel = viewModel,
                onNavigateToResetPassword = { email ->
                    viewModel.clearMessages()
                    navController.navigate(Screen.ResetPassword.createRoute(email))
                },
                onNavigateBackToLogin = {
                    viewModel.clearMessages()
                    navController.popBackStack()
                }
            )
        }

        composable(
            route = Screen.ResetPassword.route,
            arguments = listOf(
                navArgument("email") {
                    type = NavType.StringType
                    defaultValue = ""
                }
            )
        ) { backStackEntry ->
            val email = backStackEntry.arguments?.getString("email") ?: ""
            ResetPasswordScreen(
                initialEmail = email,
                viewModel = viewModel,
                onNavigateToLogin = {
                    viewModel.clearMessages()
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.ResetPassword.route) { inclusive = true }
                    }
                }
            )
        }

        composable(
            route = Screen.OtpVerify.route,
            arguments = listOf(
                navArgument("email") { type = NavType.StringType; defaultValue = "" },
                navArgument("purpose") { type = NavType.StringType; defaultValue = "registration" }
            )
        ) { backStackEntry ->
            val email = backStackEntry.arguments?.getString("email") ?: ""
            val purpose = backStackEntry.arguments?.getString("purpose") ?: "registration"
            OtpVerificationScreen(
                email = email,
                purpose = purpose,
                viewModel = viewModel,
                onNavigateToDashboard = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.OtpVerify.route) { inclusive = true }
                    }
                },
                onNavigateBack = {
                    viewModel.clearMessages()
                    navController.popBackStack()
                }
            )
        }

        composable(Screen.Dashboard.route) {
            DashboardScreen(
                viewModel = viewModel,
                onNavigateToLogin = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Dashboard.route) { inclusive = true }
                    }
                }
            )
        }
    }
}
