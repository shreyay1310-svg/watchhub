package com.watchhub.nativeapp

import com.watchhub.nativeapp.data.local.TokenManager
import com.watchhub.nativeapp.data.remote.ApiClient
import com.watchhub.nativeapp.data.remote.AuthApiService
import com.watchhub.nativeapp.data.repository.AuthRepositoryImpl
import com.watchhub.nativeapp.domain.model.User
import kotlinx.coroutines.test.runTest
import okhttp3.OkHttpClient
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class FakeTokenManager(
    private var token: String? = null,
    private var user: User? = null
) : TokenManager {
    override fun saveAccessToken(accessToken: String) {
        token = accessToken
    }

    override fun saveTokens(accessToken: String, refreshToken: String?) {
        token = accessToken
    }

    override fun getAccessToken(): String? = token

    override fun getRefreshToken(): String? = null

    override fun saveUser(user: User) {
        this.user = user
    }

    override fun getUser(): User? = user

    override fun clearTokens() {
        token = null
        user = null
    }
}

class AuthRepositoryMockTest {

    private lateinit var mockWebServer: MockWebServer
    private lateinit var tokenManager: FakeTokenManager

    @Before
    fun setup() {
        mockWebServer = MockWebServer()
        mockWebServer.start()
        tokenManager = FakeTokenManager()
    }

    @After
    fun tearDown() {
        mockWebServer.shutdown()
    }

    private fun createRepository(
        initialToken: String? = null,
        initialUser: User? = null
    ): AuthRepositoryImpl {
        tokenManager = FakeTokenManager(initialToken, initialUser)
        val httpClient = OkHttpClient.Builder().build()
        val retrofit = ApiClient.createRetrofit(mockWebServer.url("/api/").toString(), httpClient)
        val apiService = retrofit.create(AuthApiService::class.java)
        return AuthRepositoryImpl(apiService, tokenManager)
    }

    @Test
    fun testPasswordLogin_Success() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "success",
                "message": "Login successful.",
                "accessToken": "mock_jwt_access_token_12345",
                "user": {
                    "id": "usr_999",
                    "name": "Horology Master",
                    "email": "master@watchhub.in",
                    "role": "Super Admin"
                }
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(200).setBody(jsonResponse))

        val result = repo.login("master@watchhub.in", "RolexDaytona2026!")

        assertTrue(result.isSuccess)
        val user = result.getOrNull()
        assertNotNull(user)
        assertEquals("Horology Master", user?.name)
        assertEquals("master@watchhub.in", user?.email)
        assertEquals("Super Admin", user?.role)

        // Verify token was stored securely
        assertEquals("mock_jwt_access_token_12345", tokenManager.getAccessToken())
        assertTrue(repo.isAuthenticated())

        val recordedRequest = mockWebServer.takeRequest()
        assertEquals("/api/auth/login", recordedRequest.path)
        assertEquals("POST", recordedRequest.method)
    }

    @Test
    fun testPasswordLogin_Failure_401InvalidCredentials() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "fail",
                "message": "Invalid email or password."
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(401).setBody(jsonResponse))

        val result = repo.login("wrong@watchhub.in", "bad_password")

        assertTrue(result.isFailure)
        assertEquals("Invalid email or password.", result.exceptionOrNull()?.message)
        assertNull(tokenManager.getAccessToken())
        assertFalse(repo.isAuthenticated())
    }

    @Test
    fun testSendEmailOtp_Success() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "success",
                "message": "A verification code has been dispatched to collector@watchhub.in.",
                "identifier": "collector@watchhub.in",
                "channel": "email",
                "purpose": "login",
                "expiresInSeconds": 300,
                "cooldownSeconds": 60
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(200).setBody(jsonResponse))

        val result = repo.sendEmailOtp("collector@watchhub.in", "login")

        assertTrue(result.isSuccess)
        val info = result.getOrNull()
        assertNotNull(info)
        assertEquals(60, info?.cooldownSeconds)
        assertEquals(300, info?.expiresInSeconds)

        val req = mockWebServer.takeRequest()
        assertEquals("/api/auth/send-email-otp", req.path)
    }

    @Test
    fun testSendEmailOtp_Cooldown_429RateLimit() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "fail",
                "message": "Please wait 48 seconds before requesting a new verification code.",
                "waitSeconds": 48
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(429).setBody(jsonResponse))

        val result = repo.sendEmailOtp("collector@watchhub.in", "login")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull()?.message?.contains("48 seconds") == true)
    }

    @Test
    fun testEmailLogin_Success() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "success",
                "message": "Sign-in verified successfully.",
                "accessToken": "jwt_otp_login_token_abc",
                "user": {
                    "id": "usr_777",
                    "name": "collector",
                    "email": "collector@watchhub.in",
                    "role": "Customer"
                }
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(200).setBody(jsonResponse))

        val result = repo.emailLogin("collector@watchhub.in", "482910")

        assertTrue(result.isSuccess)
        val user = result.getOrNull()
        assertEquals("Customer", user?.role)
        assertEquals("jwt_otp_login_token_abc", tokenManager.getAccessToken())

        val req = mockWebServer.takeRequest()
        assertEquals("/api/auth/email-login", req.path)
    }

    @Test
    fun testEmailLogin_InvalidOtp_400() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "fail",
                "message": "Invalid verification code. You have 4 attempt(s) remaining.",
                "remainingAttempts": 4
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(400).setBody(jsonResponse))

        val result = repo.emailLogin("collector@watchhub.in", "000000")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull()?.message?.contains("4 attempt(s)") == true)
    }

    @Test
    fun testCustomerRegistration_Success() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "success",
                "message": "Customer registered successfully.",
                "accessToken": "jwt_reg_token_xyz",
                "user": {
                    "id": "usr_new_123",
                    "name": "Jane Collector",
                    "email": "jane@watchhub.in",
                    "role": "Customer"
                }
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(201).setBody(jsonResponse))

        val result = repo.register("Jane Collector", "jane@watchhub.in", "SecurePassword123")

        assertTrue(result.isSuccess)
        assertEquals("Jane Collector", result.getOrNull()?.name)
        assertEquals("jwt_reg_token_xyz", tokenManager.getAccessToken())

        val req = mockWebServer.takeRequest()
        assertEquals("/api/auth/register", req.path)
    }

    @Test
    fun testRegistrationDuplicateEmail_400() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "fail",
                "message": "An account with this email address already exists."
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(400).setBody(jsonResponse))

        val result = repo.register("Jane", "existing@watchhub.in", "password123")

        assertTrue(result.isFailure)
        assertEquals("An account with this email address already exists.", result.exceptionOrNull()?.message)
    }

    @Test
    fun testForgotPassword_Success() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "success",
                "message": "If an account is associated with user@watchhub.in, a password recovery code has been sent.",
                "cooldownSeconds": 60
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(200).setBody(jsonResponse))

        val result = repo.forgotPassword("user@watchhub.in")

        assertTrue(result.isSuccess)
        assertEquals(60, result.getOrNull())

        val req = mockWebServer.takeRequest()
        assertEquals("/api/auth/forgot-password", req.path)
    }

    @Test
    fun testResetPassword_Success() = runTest {
        val repo = createRepository()

        val jsonResponse = """
            {
                "status": "success",
                "message": "Password reset confirmed. You may now sign in with your new credentials."
            }
        """.trimIndent()

        mockWebServer.enqueue(MockResponse().setResponseCode(200).setBody(jsonResponse))

        val result = repo.resetPassword("user@watchhub.in", "123456", "BrandNewPassword123")

        assertTrue(result.isSuccess)
        assertEquals("Password reset confirmed. You may now sign in with your new credentials.", result.getOrNull())

        val req = mockWebServer.takeRequest()
        assertEquals("/api/auth/reset-password", req.path)
    }

    @Test
    fun testTokenPersistenceAfterRestart() = runTest {
        val initialUser = User(id = "usr_1", name = "Test User", email = "test@watchhub.in")
        val repo = createRepository(initialToken = "valid_persisted_token", initialUser = initialUser)

        assertTrue(repo.isAuthenticated())
        assertEquals(initialUser, repo.getSavedUser())
    }

    @Test
    fun testHttp401ClearsToken() = runTest {
        val initialUser = User(id = "usr_1", name = "Test User", email = "test@watchhub.in")
        val repo = createRepository(initialToken = "expired_token", initialUser = initialUser)

        mockWebServer.enqueue(
            MockResponse()
                .setResponseCode(401)
                .setBody("""{"status":"fail","message":"Invalid or expired authentication token."}""")
        )

        val result = repo.getCurrentUser()

        assertTrue(result.isFailure)
        assertNull(tokenManager.getAccessToken())
        assertFalse(repo.isAuthenticated())
    }

    @Test
    fun testLogout_ClearsSession() = runTest {
        val initialUser = User(id = "usr_1", name = "Test", email = "test@watchhub.in")
        val repo = createRepository(initialToken = "valid_token", initialUser = initialUser)

        assertTrue(repo.isAuthenticated())
        assertEquals(initialUser, repo.getSavedUser())

        repo.logout()

        assertFalse(repo.isAuthenticated())
        assertNull(repo.getSavedUser())
        assertNull(tokenManager.getAccessToken())
    }

    @Test
    fun testServer_500InternalError() = runTest {
        val repo = createRepository()

        mockWebServer.enqueue(
            MockResponse()
                .setResponseCode(500)
                .setBody("""{"status":"error","message":"Database connection timeout."}""")
        )

        val result = repo.login("user@watchhub.in", "password")

        assertTrue(result.isFailure)
        assertEquals("Database connection timeout.", result.exceptionOrNull()?.message)
    }

    @Test
    fun testNetworkUnavailable() = runTest {
        val repo = createRepository()

        // Shutdown MockWebServer to simulate network connection drop / airplane mode
        mockWebServer.shutdown()

        val result = repo.login("user@watchhub.in", "password")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull()?.message?.contains("Network communication failure") == true)
    }
}
