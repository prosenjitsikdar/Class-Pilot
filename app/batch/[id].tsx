import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getBatchStudents } from "../../lib/api/teacher";

export default function BatchStudents() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (id) {
      fetchStudents();
    }
  }, [id]);

  const fetchStudents = async () => {
    try {
      const res = await getBatchStudents(id as string);

      // Determine where the array is in the response
      let studentsArray = [];
      if (Array.isArray(res)) {
        studentsArray = res;
      } else if (res.data && Array.isArray(res.data)) {
        studentsArray = res.data;
      } else if (res.data?.students && Array.isArray(res.data.students)) {
        studentsArray = res.data.students;
      }

      setStudents(studentsArray);
    } catch (err: any) {
      console.error("Fetch Batch Students Error:", err);
      setErrorMsg("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9E6" }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 mr-4"
        >
          <Ionicons name="arrow-back" size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-primary text-xl font-bold">Batch Students</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1e293b" />
        </View>
      ) : errorMsg ? (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-red-500 font-medium text-center">{errorMsg}</Text>
          <TouchableOpacity
            onPress={fetchStudents}
            className="mt-4 px-6 py-2 bg-primary rounded-xl"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View className="px-6 mt-6 gap-y-4">
            {!Array.isArray(students) || students.length === 0 ? (
              <View className="py-20 items-center justify-center">
                <View className="h-20 w-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="people-outline" size={32} color="#94a3b8" />
                </View>
                <Text className="text-gray-400 font-medium">No students enrolled in this batch.</Text>
              </View>
            ) : students.map((student: any) => (
              <View key={student.id || Math.random()} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex-row items-start gap-x-4">
                <View className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                  <Image
                    source={student.user?.image ? { uri: student.user.image } : require("../../assets/images/user-profile.png")}
                    className="h-full w-full"
                    contentFit="cover"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-2">
                      <Text className="text-primary font-bold text-lg" numberOfLines={1}>
                        {student.user?.name || "Unknown Student"}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-0.5" numberOfLines={1}>
                        {student.user?.email || student.email || ""}
                      </Text>
                    </View>
                    <View className={`px-2 py-1 rounded-lg ${student.user?.status === 'ACTIVE' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Text className={`text-[10px] font-bold ${student.user?.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                        {student.user?.status || 'ACTIVE'}
                      </Text>
                    </View>
                  </View>

                  {student.phone && (
                    <View className="flex-row items-center mt-3 pt-3 border-t border-gray-50 gap-x-4">
                      <View className="flex-row items-center gap-x-1">
                        <Ionicons name="call-outline" size={14} color="#64748b" />
                        <Text className="text-gray-500 text-xs font-medium">{student.phone}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
