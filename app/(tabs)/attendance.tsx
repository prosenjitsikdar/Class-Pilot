import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Attendance() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9E6", justifyContent: "center", alignItems: "center" }}>
      <View className="h-20 w-20 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="construct-outline" size={32} color="#94a3b8" />
      </View>
      <Text className="text-primary font-bold text-xl mb-2">Attendance</Text>
      <Text className="text-gray-500 text-center px-10">
        This module is currently under construction.
      </Text>
    </SafeAreaView>
  );
}
