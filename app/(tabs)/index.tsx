import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useAuth } from "../_layout";
import { getAdminOverview } from "../../lib/api/admin";
import { getTeacherDashboard } from "../../lib/api/teacher";
import { useEffect } from "react";

function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await getAdminOverview();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#1e293b" />
      </View>
    );
  }

  if (!data) return null;

  return (
    <View className="pb-10">
      {/* Horizontal Counts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 mt-6 pb-4">
        <View className="flex-row gap-x-4 pr-12">
           {Object.entries(data.counts).map(([key, value]) => (
              <View key={key} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-w-[150px]">
                 <Text className="text-gray-500 text-xs font-bold uppercase mb-2 tracking-wider">
                   {key.replace(/([A-Z])/g, ' $1').trim()}
                 </Text>
                 <Text className="text-primary text-3xl font-black">{String(value)}</Text>
              </View>
           ))}
        </View>
      </ScrollView>

      {/* Recent Batches */}
      <View className="px-6 mt-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-primary text-lg font-bold">Recent Batches</Text>
          <TouchableOpacity>
            <Text className="text-blue-500 text-sm font-medium">View All</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-y-3">
          {data.recentBatches?.map((batch: any) => (
             <View key={batch.id} className="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm flex-row items-center gap-x-4">
                <View className="h-12 w-12 rounded-2xl bg-blue-50 items-center justify-center">
                  <Ionicons name="folder-outline" size={22} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-primary font-bold text-base">{batch.name}</Text>
                  <Text className="text-gray-500 text-sm mt-0.5">Teacher: {batch.teacher?.user?.name}</Text>
                </View>
                <Text className="text-gray-400 text-xs font-medium">
                  {new Date(batch.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Text>
             </View>
          ))}
        </View>
      </View>

      {/* Recent Quizzes */}
      <View className="px-6 mt-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-primary text-lg font-bold">Recent Quizzes</Text>
          <TouchableOpacity>
            <Text className="text-blue-500 text-sm font-medium">View All</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-y-3">
          {data.recentQuizzes?.map((quiz: any) => (
             <View key={quiz.id} className="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm flex-row justify-between items-center">
                <View className="flex-1 pr-4">
                   <Text className="text-primary font-bold text-base" numberOfLines={1}>{quiz.title}</Text>
                   <Text className="text-gray-500 text-sm mt-1">{quiz.batch?.name}</Text>
                   <Text className="text-gray-400 text-xs mt-2">Due: {new Date(quiz.dueDate).toLocaleDateString()}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${quiz.isPublished ? 'bg-green-100' : 'bg-orange-100'}`}>
                   <Text className={`text-xs font-bold ${quiz.isPublished ? 'text-green-600' : 'text-orange-600'}`}>
                     {quiz.isPublished ? 'Published' : 'Draft'}
                   </Text>
                </View>
             </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function TeacherOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const res = await getTeacherDashboard();
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch teacher dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#1e293b" />
      </View>
    );
  }

  if (!data) return null;

  return (
    <View className="pb-10">
      {/* Horizontal Counts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 mt-6 pb-4">
        <View className="flex-row gap-x-4 pr-12">
           <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-w-[140px]">
             <Text className="text-gray-500 text-xs font-bold uppercase mb-2 tracking-wider">Total Batches</Text>
             <Text className="text-primary text-3xl font-black">{data.summary.totalBatches}</Text>
           </View>
           <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-w-[140px]">
             <Text className="text-gray-500 text-xs font-bold uppercase mb-2 tracking-wider">Students</Text>
             <Text className="text-primary text-3xl font-black">{data.summary.totalStudents}</Text>
           </View>
           <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-w-[140px]">
             <Text className="text-gray-500 text-xs font-bold uppercase mb-2 tracking-wider">Avg Score</Text>
             <Text className="text-blue-500 text-3xl font-black">{data.summary.averageScorePercentage}%</Text>
           </View>
           <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-w-[140px]">
             <Text className="text-gray-500 text-xs font-bold uppercase mb-2 tracking-wider">Attendance</Text>
             <Text className="text-green-500 text-3xl font-black">{data.summary.attendanceRate}%</Text>
           </View>
        </View>
      </ScrollView>

      {/* Recent Quizzes */}
      <View className="px-6 mt-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-primary text-lg font-bold">Recent Quizzes</Text>
          <TouchableOpacity>
            <Text className="text-blue-500 text-sm font-medium">View All</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-y-3">
          {data.recentQuizzes?.length === 0 ? (
            <Text className="text-gray-400 font-medium">No recent quizzes found.</Text>
          ) : data.recentQuizzes?.map((quiz: any) => (
             <View key={quiz.id} className="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm flex-row justify-between items-center">
                <View className="flex-1 pr-4">
                   <Text className="text-primary font-bold text-base" numberOfLines={1}>{quiz.title}</Text>
                   <Text className="text-gray-500 text-sm mt-1">{quiz.batch?.name}</Text>
                   <View className="flex-row gap-x-3 mt-2">
                     <Text className="text-gray-400 text-xs">Questions: {quiz._count?.questions || 0}</Text>
                     <Text className="text-gray-400 text-xs">Submissions: {quiz._count?.submissions || 0}</Text>
                   </View>
                </View>
                <View className="items-end gap-y-2">
                  <View className={`px-2 py-1 rounded-full ${quiz.isPublished ? 'bg-green-100' : 'bg-orange-100'}`}>
                     <Text className={`text-[10px] font-bold ${quiz.isPublished ? 'text-green-600' : 'text-orange-600'}`}>
                       {quiz.isPublished ? 'PUBLISHED' : 'DRAFT'}
                     </Text>
                  </View>
                  <Text className="text-gray-400 text-[10px] font-medium">Due: {new Date(quiz.dueDate).toLocaleDateString()}</Text>
                </View>
             </View>
          ))}
        </View>
      </View>

      {/* Recent Submissions */}
      <View className="px-6 mt-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-primary text-lg font-bold">Recent Submissions</Text>
          <TouchableOpacity>
            <Text className="text-blue-500 text-sm font-medium">View All</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-y-3">
          {data.recentSubmissions?.length === 0 ? (
            <Text className="text-gray-400 font-medium">No recent submissions found.</Text>
          ) : data.recentSubmissions?.map((sub: any) => (
             <View key={sub.id} className="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm flex-row justify-between items-center">
                <View className="flex-1 pr-4">
                   <Text className="text-primary font-bold text-base" numberOfLines={1}>{sub.student?.user?.name}</Text>
                   <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>{sub.quiz?.title}</Text>
                   <Text className="text-gray-400 text-[10px] mt-1.5">{new Date(sub.submittedAt).toLocaleDateString()} at {new Date(sub.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-primary font-black text-lg">{sub.score} <Text className="text-gray-400 text-sm font-medium">/ {sub.totalPoints}</Text></Text>
                  <Text className={`text-[10px] font-bold mt-1 ${(sub.score/sub.totalPoints) >= 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.round((sub.score/sub.totalPoints)*100)}%
                  </Text>
                </View>
             </View>
          ))}
        </View>
      </View>

      {/* Batch Summary */}
      <View className="px-6 mt-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-primary text-lg font-bold">My Batches</Text>
          <TouchableOpacity>
            <Text className="text-blue-500 text-sm font-medium">View All</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-y-3">
          {data.batchSummary?.map((batch: any) => (
             <View key={batch.id} className="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm flex-row items-center gap-x-4">
                <View className="h-12 w-12 rounded-2xl bg-blue-50 items-center justify-center">
                  <Ionicons name="people-outline" size={22} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-primary font-bold text-base">{batch.name}</Text>
                  <View className="flex-row gap-x-2 mt-1">
                    <Text className="text-gray-500 text-xs font-medium">{batch.studentCount} Students</Text>
                    <Text className="text-gray-300 text-xs">•</Text>
                    <Text className="text-gray-500 text-xs font-medium">{batch.quizCount} Quizzes</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-blue-500 font-bold text-sm">{batch.averageScorePercentage}%</Text>
                  <Text className="text-gray-400 text-[10px]">Avg Score</Text>
                </View>
             </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function Dashboard() {
  const { logout, user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9E6" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header Section */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-x-3">
            <TouchableOpacity 
              onPress={() => setMenuVisible(true)}
              className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm"
            >
              <Image
                source={require("../../assets/images/user-profile.png")}
                className="h-full w-full"
              />
            </TouchableOpacity>
            <View>
              <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                Welcome Back
              </Text>
              <Text className="text-primary text-xl font-bold">
                {user ? `${user.name} 👋` : 'Loading...'}
              </Text>
            </View>
          </View>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
            <Ionicons name="notifications-outline" size={22} color="#1e293b" />
            <View className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
          </TouchableOpacity>
        </View>

        {user?.role === 'ADMIN' ? (
          <AdminOverview />
        ) : user?.role === 'TEACHER' ? (
          <TeacherOverview />
        ) : (
          <View className="px-6 mt-6 items-center justify-center py-20">
            <View className="h-20 w-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="construct-outline" size={32} color="#94a3b8" />
            </View>
            <Text className="text-primary font-bold text-xl mb-2">Coming Soon</Text>
            <Text className="text-gray-500 text-center">
              The {user?.role || 'Student'} dashboard is currently under development.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Profile Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          className="flex-1 bg-black/40 items-center justify-center"
          onPress={() => setMenuVisible(false)}
        >
          <View className="bg-white w-64 rounded-3xl p-4 shadow-xl">
            <View className="items-center mb-6 pt-2">
              <View className="h-16 w-16 rounded-full overflow-hidden mb-3 border-2 border-gray-100">
                <Image
                  source={require("../../assets/images/user-profile.png")}
                  className="h-full w-full"
                />
              </View>
              <Text className="text-primary font-bold text-lg">Raja</Text>
              <Text className="text-gray-400 text-sm">raja@example.com</Text>
            </View>

            <View className="h-px bg-gray-100 w-full mb-2" />
            
            <TouchableOpacity className="flex-row items-center p-3 gap-x-3 rounded-2xl active:bg-gray-50">
              <Ionicons name="person-outline" size={20} color="#1e293b" />
              <Text className="text-primary font-medium">My Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center p-3 gap-x-3 rounded-2xl active:bg-gray-50">
              <Ionicons name="settings-outline" size={20} color="#1e293b" />
              <Text className="text-primary font-medium">Settings</Text>
            </TouchableOpacity>

            <View className="h-px bg-gray-100 w-full my-2" />

            <TouchableOpacity 
              onPress={handleLogout}
              className="flex-row items-center p-3 gap-x-3 rounded-2xl active:bg-red-50"
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text className="text-red-500 font-bold">Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

