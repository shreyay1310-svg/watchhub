# WatchHub Native Android Proguard Rules
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
-keep class com.watchhub.nativeapp.data.remote.** { *; }
-keep class com.watchhub.nativeapp.domain.model.** { *; }
