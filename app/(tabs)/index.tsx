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
        ) : (
          <>
            {/* Main Card Section */}
            <View className="px-6 mt-6">
              <View 
                className="w-full bg-primary rounded-3xl p-6 shadow-xl shadow-primary/40 overflow-hidden"
                style={{ backgroundColor: "#1e293b" }}
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-gray-400 text-sm font-medium">Total Balance</Text>
                    <Text className="text-white text-3xl font-bold mt-1">$12,480.00</Text>
                  </View>
                  <View className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
                    <Text className="text-white text-xs font-bold">+2.4%</Text>
                  </View>
                </View>

                <View className="flex-row gap-x-4 mt-8">
                  <TouchableOpacity className="flex-1 h-12 bg-white rounded-2xl items-center justify-center flex-row gap-x-2">
                    <Ionicons name="add" size={20} color="#1e293b" />
                    <Text className="text-primary font-bold">Top Up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 h-12 bg-white/10 rounded-2xl items-center justify-center flex-row gap-x-2 border border-white/20">
                    <Ionicons name="send-outline" size={18} color="#ffffff" />
                    <Text className="text-white font-bold">Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Stats Grid */}
            <View className="px-6 mt-8 flex-row gap-x-4">
              <View className="flex-1 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                <View className="h-10 w-10 rounded-2xl bg-blue-50 items-center justify-center mb-3">
                  <Ionicons name="trending-up-outline" size={20} color="#3b82f6" />
                </View>
                <Text className="text-gray-500 text-xs font-medium">Income</Text>
                <Text className="text-primary text-lg font-bold mt-1">$4,250</Text>
              </View>
              <View className="flex-1 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                <View className="h-10 w-10 rounded-2xl bg-orange-50 items-center justify-center mb-3">
                  <Ionicons name="trending-down-outline" size={20} color="#f97316" />
                </View>
                <Text className="text-gray-500 text-xs font-medium">Expenses</Text>
                <Text className="text-primary text-lg font-bold mt-1">$1,840</Text>
              </View>
            </View>

            {/* My Data Section */}
            <View className="px-6 mt-8">
              <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-primary text-lg font-bold">My Data</Text>
                </View>
                <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 min-h-[120px] justify-center">
                  {user ? (
                    <View className="gap-y-2">
                      <Text className="text-gray-600 font-medium">Name: <Text className="text-primary font-bold">{user.name}</Text></Text>
                      <Text className="text-gray-600 font-medium">Email: <Text className="text-primary font-bold">{user.email}</Text></Text>
                      <Text className="text-gray-600 font-medium">Role: <Text className="text-primary font-bold">{user.role}</Text></Text>
                      <Text className="text-gray-600 font-medium">Status: <Text className="text-green-500 font-bold">{user.status}</Text></Text>
                      <Text className="text-gray-600 font-medium">Account ID: <Text className="text-gray-400 font-mono text-xs">{user.id}</Text></Text>
                    </View>
                  ) : (
                    <Text className="text-gray-400 font-medium text-center">
                      Your custom data will appear here
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Recent Activity */}
            <View className="px-6 mt-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-primary text-lg font-bold">Recent Activity</Text>
                <TouchableOpacity>
                  <Text className="text-gray-500 text-sm font-medium">View All</Text>
                </TouchableOpacity>
              </View>

              <View className="gap-y-3">
                {[
                  { id: 1, name: "Apple Store", date: "24 Apr 2024", amount: "-$19.99", icon: "logo-apple", color: "#000000" },
                  { id: 2, name: "Stripe Payout", date: "22 Apr 2024", amount: "+$1,250.00", icon: "card-outline", color: "#6366f1" },
                  { id: 3, name: "Netflix Sub", date: "20 Apr 2024", amount: "-$14.99", icon: "play-outline", color: "#ef4444" },
                ].map((item) => (
                  <TouchableOpacity 
                    key={item.id}
                    className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm"
                  >
                    <View className="flex-row items-center gap-x-4">
                      <View 
                        style={{ backgroundColor: `${item.color}15` }}
                        className="h-12 w-12 rounded-2xl items-center justify-center"
                      >
                        <Ionicons name={item.icon as any} size={22} color={item.color} />
                      </View>
                      <View>
                        <Text className="text-primary font-bold">{item.name}</Text>
                        <Text className="text-gray-400 text-xs mt-1">{item.date}</Text>
                      </View>
                    </View>
                    <Text className={`font-bold ${item.amount.startsWith("+") ? "text-green-500" : "text-primary"}`}>
                      {item.amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
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

