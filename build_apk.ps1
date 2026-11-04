$ErrorActionPreference = "Stop"

$env:JAVA_HOME = "C:\Program Files\Android\openjdk\jdk-21.0.8"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

$JDK_BIN = "C:\Program Files\Android\openjdk\jdk-21.0.8\bin"
$JAVAC = Join-Path $JDK_BIN "javac.exe"
$KEYTOOL = Join-Path $JDK_BIN "keytool.exe"
$JAR = Join-Path $JDK_BIN "jar.exe"

$SDK_DIR = "C:\Users\shrey\AppData\Local\Android\Sdk"
$ANDROID_JAR = Join-Path $SDK_DIR "platforms\android-35\android.jar"
$BUILD_TOOLS = Join-Path $SDK_DIR "build-tools\34.0.0"
$AAPT2 = Join-Path $BUILD_TOOLS "aapt2.exe"
$D8 = Join-Path $BUILD_TOOLS "d8.bat"
$ZIPALIGN = Join-Path $BUILD_TOOLS "zipalign.exe"
$APKSIGNER = Join-Path $BUILD_TOOLS "apksigner.bat"

$PROJECT_ROOT = (Get-Location).Path
$BUILD_DIR = Join-Path $PROJECT_ROOT "build_android_temp"
$SRC_DIR = Join-Path $PROJECT_ROOT "android\app\src\main"
$RES_DIR = Join-Path $SRC_DIR "res"
$MANIFEST = Join-Path $SRC_DIR "AndroidManifest.xml"
$JAVA_SRC = Join-Path $SRC_DIR "java"

Write-Host "==> Cleaning old build directory..."
if (Test-Path $BUILD_DIR) { Remove-Item -Recurse -Force $BUILD_DIR }
New-Item -ItemType Directory -Force -Path $BUILD_DIR | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $BUILD_DIR "compiled_res") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $BUILD_DIR "gen") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $BUILD_DIR "obj") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $BUILD_DIR "assets\www") | Out-Null

Write-Host "==> 1. Compiling Android Resources with AAPT2..."
& $AAPT2 compile --dir $RES_DIR -o (Join-Path $BUILD_DIR "compiled_res.zip")

Write-Host "==> 2. Linking Resources and generating R.java (Targeting Android 15 / API 35)..."
& $AAPT2 link `
    -I $ANDROID_JAR `
    --manifest $MANIFEST `
    --min-sdk-version 26 `
    --target-sdk-version 35 `
    --version-code 101 `
    --version-name "1.0.1" `
    -o (Join-Path $BUILD_DIR "base_unaligned.apk") `
    --java (Join-Path $BUILD_DIR "gen") `
    --auto-add-overlay `
    (Join-Path $BUILD_DIR "compiled_res.zip")

Write-Host "==> 3. Compiling Java sources..."
$javaFiles = Get-ChildItem -Path $JAVA_SRC, (Join-Path $BUILD_DIR "gen") -Filter "*.java" -Recurse | Select-Object -ExpandProperty FullName
& $JAVAC -cp $ANDROID_JAR -d (Join-Path $BUILD_DIR "obj") -source 1.8 -target 1.8 $javaFiles

Write-Host "==> 4. Converting Java bytecode to Dalvik DEX with D8..."
$classFiles = Get-ChildItem -Path (Join-Path $BUILD_DIR "obj") -Filter "*.class" -Recurse | Select-Object -ExpandProperty FullName
& $D8 --min-api 26 --output $BUILD_DIR $classFiles

Write-Host "==> 5. Bundling classes.dex into APK..."
Set-Location $BUILD_DIR
& $JAR uf "base_unaligned.apk" "classes.dex"

Write-Host "==> 6. Bundling web assets for offline fallback..."
if (Test-Path (Join-Path $PROJECT_ROOT "client\dist")) {
    Copy-Item -Path (Join-Path $PROJECT_ROOT "client\dist\*") -Destination (Join-Path $BUILD_DIR "assets\www") -Recurse -Force
    if (Test-Path (Join-Path $BUILD_DIR "assets\www\downloads")) {
        Remove-Item -Recurse -Force (Join-Path $BUILD_DIR "assets\www\downloads")
    }
    & $JAR uf "base_unaligned.apk" "assets"
}
Set-Location $PROJECT_ROOT

Write-Host "==> 7. Creating or checking Release KeyStore..."
$KEYSTORE = Join-Path $PROJECT_ROOT "watchhub_release.keystore"
if (-not (Test-Path $KEYSTORE)) {
    & $KEYTOOL -genkeypair -v `
        -keystore $KEYSTORE `
        -alias watchhub `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -storepass "WatchHub@2026" `
        -keypass "WatchHub@2026" `
        -dname "CN=WatchHub, OU=Mobile, O=WatchHub Inc, L=Mumbai, ST=Maharashtra, C=IN"
}

Write-Host "==> 8. Aligning APK with zipalign (4-byte alignment)..."
$ALIGNED_APK = Join-Path $BUILD_DIR "WatchHub-aligned.apk"
& $ZIPALIGN -v -p -f 4 (Join-Path $BUILD_DIR "base_unaligned.apk") $ALIGNED_APK

Write-Host "==> 9. Signing APK with apksigner (v1, v2, v3 schemes)..."
$FINAL_APK = Join-Path $PROJECT_ROOT "WatchHub-v1.0.0.apk"
Copy-Item $ALIGNED_APK $FINAL_APK -Force
& $APKSIGNER sign `
    --ks $KEYSTORE `
    --ks-key-alias watchhub `
    --ks-pass "pass:WatchHub@2026" `
    --key-pass "pass:WatchHub@2026" `
    --v1-signing-enabled true `
    --v2-signing-enabled true `
    --v3-signing-enabled true `
    $FINAL_APK

Write-Host "==> 10. Verifying APK signature..."
& $APKSIGNER verify --verbose $FINAL_APK

Write-Host "==> 11. Copying signed APK to client downloads..."
Copy-Item $FINAL_APK "client\public\downloads\WatchHub-latest.apk" -Force
Copy-Item $FINAL_APK "client\public\downloads\WatchHub-v1.0.0.apk" -Force
if (Test-Path "client\dist\downloads") {
    Copy-Item $FINAL_APK "client\dist\downloads\WatchHub-latest.apk" -Force
    Copy-Item $FINAL_APK "client\dist\downloads\WatchHub-v1.0.0.apk" -Force
}

# Cleanup temp
Remove-Item -Recurse -Force $BUILD_DIR -ErrorAction SilentlyContinue

Write-Host "SUCCESS! Certified Android APK generated at: $FINAL_APK"
