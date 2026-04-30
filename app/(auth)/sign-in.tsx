import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Animated, {
    FadeInDown
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../_layout";

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { login } = useAuth();

    const handleSignIn = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsLoading(true);
        setErrorMessage("");
        try {
            console.log("Sending login request with payload:", { email, password });
            const response = await axiosInstance.post('/auth/login', {
                email,
                password
            });
            console.log("Login successful! Response data:", response.data);

            // Extract the nested data object
            const payload = response.data?.data;

            if (payload?.accessToken) {
                await SecureStore.setItemAsync('accessToken', payload.accessToken);
            }
            if (payload?.refreshToken) {
                await SecureStore.setItemAsync('refreshToken', payload.refreshToken);
            }
            if (payload?.token) {
                await SecureStore.setItemAsync('better-auth.session_token', payload.token);
            }

            login(payload?.user);
        } catch (error: any) {
            console.log("Sign in failed:", error.message || "Unknown error");
            const msg = error.response?.data?.message || "Invalid email or password. Please try again.";
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log(`Login with ${provider}`);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9E6" }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    className="px-6"
                >
                    {/* Header Section */}
                    <View className="mt-12 items-center">
                        <View className="h-24 w-24 overflow-hidden rounded-3xl bg-white shadow-sm">
                            <Image
                                source={require("../../assets/images/app-logo.png")}
                                contentFit="contain"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </View>
                        <Text className="mt-6 text-3xl font-bold tracking-tight text-primary">
                            Welcome Back
                        </Text>
                        <Text className="mt-2 text-base text-gray-500">
                            Sign in to continue your journey
                        </Text>
                    </View>
                    {/* Quick Login Demo Buttons */}
                    <View className="mt-8">
                        <Text className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider mb-3">Quick Login (Demo)</Text>
                        <View className="flex-row justify-between gap-x-3">
                            <TouchableOpacity
                                onPress={() => { setEmail("admin@classpilot.com"); setPassword("Admin12345"); }}
                                className="flex-1 py-2.5 rounded-xl bg-primary/10 items-center border border-primary/20"
                            >
                                <Text className="text-primary font-bold text-xs">Admin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setEmail("john@example.com"); setPassword("Teacher123"); }}
                                className="flex-1 py-2.5 rounded-xl bg-blue-50 items-center border border-blue-200"
                            >
                                <Text className="text-blue-600 font-bold text-xs">Teacher</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setEmail("alice@example.com"); setPassword("NewPass@1234"); }}
                                className="flex-1 py-2.5 rounded-xl bg-green-50 items-center border border-green-200"
                            >
                                <Text className="text-green-600 font-bold text-xs">Student</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="mt-8 gap-y-4">
                        <View>
                            <Text className="mb-2 ml-1 text-sm font-semibold text-primary">
                                Email Address
                            </Text>
                            <View className="flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-3">
                                <Ionicons name="mail-outline" size={20} color="#64748b" />
                                <TextInput
                                    placeholder="name@example.com"
                                    placeholderTextColor="#94a3b8"
                                    className="ml-3 flex-1 text-base text-primary"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View>
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="ml-1 text-sm font-semibold text-primary">
                                    Password
                                </Text>
                                <TouchableOpacity>
                                    <Text className="text-sm font-semibold text-primary/70">
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center rounded-2xl bg-white border border-gray-200 px-4 py-3">
                                <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor="#94a3b8"
                                    className="ml-3 flex-1 text-base text-primary"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#64748b"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Sign In Button */}
                    <View className="mt-8">
                        {errorMessage ? (
                            <Animated.Text
                                entering={FadeInDown}
                                className="text-red-500 text-center mb-4 text-sm font-medium"
                            >
                                {errorMessage}
                            </Animated.Text>
                        ) : null}
                        <TouchableOpacity
                            onPress={handleSignIn}
                            disabled={isLoading}
                            activeOpacity={0.8}
                            className={`h-14 items-center justify-center rounded-2xl bg-primary ${isLoading ? "opacity-70" : ""}`}
                        >
                            <Text className="text-lg font-bold text-white">
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Social Logins */}
                    <View className="mt-10">
                        <View className="flex-row items-center justify-center gap-x-4">
                            <View className="h-px flex-1 bg-gray-200" />
                            <Text className="text-sm font-medium text-gray-400 mx-4">
                                Or continue with
                            </Text>
                            <View className="h-px flex-1 bg-gray-200" />
                        </View>

                        <View className="mt-8 flex-row justify-center gap-x-6">
                            <TouchableOpacity
                                onPress={() => handleSocialLogin("Google")}
                                className="h-14 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-white"
                            >
                                <Ionicons name="logo-google" size={24} color="#ea4335" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleSocialLogin("Apple")}
                                className="h-14 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-white"
                            >
                                <Ionicons name="logo-apple" size={24} color="#000000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
