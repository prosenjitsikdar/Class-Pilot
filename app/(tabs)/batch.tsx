import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAdminBatches } from "../../lib/api/admin";
import { getTeacherBatches } from "../../lib/api/teacher";
import { useAuth } from "../_layout";

export default function Batches() {
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBatches();
  }, [user]);

  const fetchBatches = async () => {
    if (!user) return; // Wait until user context loads
    try {
      let res;
      if (user.role === 'TEACHER') {
        res = await getTeacherBatches();
      } else {
        res = await getAdminBatches();
      }
      setBatches(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9E6", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1e293b" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9E6" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Text className="text-primary text-2xl font-bold">Batches</Text>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
            <Ionicons name="filter-outline" size={22} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* List */}
        <View className="px-6 mt-4 gap-y-4">
          {batches.length === 0 ? (
            <View className="py-10 items-center justify-center">
               <Text className="text-gray-400 font-medium">No batches found.</Text>
            </View>
          ) : batches.map((batch: any) => (
            <View key={batch.id || Math.random()} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 pr-4">
                  <Text className="text-primary font-bold text-xl">{batch.name}</Text>
                  <Text className="text-gray-500 text-xs mt-1 leading-tight">{batch.description}</Text>
                </View>
                <View className="h-12 w-12 rounded-2xl bg-blue-50 items-center justify-center">
                  <Ionicons name="layers-outline" size={24} color="#3b82f6" />
                </View>
              </View>

              <View className="flex-row items-center gap-x-2 mb-4">
                <Ionicons name="time-outline" size={16} color="#64748b" />
                <Text className="text-gray-600 font-medium text-xs flex-1">{batch.schedule}</Text>
              </View>
              
              <View className="flex-row items-center justify-between py-3 border-t border-b border-gray-50 mb-3">
                <View>
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Teacher</Text>
                  <Text className="text-primary font-bold text-sm">{batch.teacher?.user?.name || "Unassigned"}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Subject</Text>
                  <Text className="text-primary font-bold text-sm">{batch.teacher?.subject || "N/A"}</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row gap-x-4">
                  <View className="flex-row items-center gap-x-1.5">
                    <Ionicons name="people-outline" size={16} color="#64748b" />
                    <Text className="text-gray-500 font-medium text-xs">{batch._count?.students ?? batch.studentCount ?? 0} Students</Text>
                  </View>
                  <View className="flex-row items-center gap-x-1.5">
                    <Ionicons name="document-text-outline" size={16} color="#64748b" />
                    <Text className="text-gray-500 font-medium text-xs">{batch._count?.quizzes ?? batch.quizCount ?? 0} Quizzes</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  onPress={() => router.push(`/batch/${batch.id}` as any)}
                  className="bg-primary/5 px-3 py-1.5 rounded-xl"
                >
                  <Text className="text-primary font-bold text-xs">Manage</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
