import "@/global.css";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { axiosInstance } from "../lib/axios";

// Auth Context
const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: any;
  login: (userData?: any) => void;
  logout: () => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const login = (userData?: any) => {
    if (userData) setUser(userData);
    setIsAuthenticated(true);
  };
  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('better-auth.session_token');
      
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    const timeout = setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        router.replace("/(auth)/sign-in");
      } else if (isAuthenticated && inAuthGroup) {
        router.replace("/(tabs)");
      }
    }, 1);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, segments, rootNavigationState?.key]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthContext.Provider>
  );
}