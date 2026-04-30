import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getAdminStudents, createStudent, getAdminBatches } from "../../lib/api/admin";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [batches, setBatches] = useState([]);
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    image: "",
    batchId: "",
    batchName: ""
  });

  useEffect(() => {
    fetchStudents();
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await getAdminBatches();
      setBatches(data.data || []);
    } catch (err) {
      console.log("Failed to fetch batches for dropdown");
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getAdminStudents();
      setStudents(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async () => {
    try {
      setCreating(true);
      setErrorMsg("");
      setFieldErrors({});

      if (!formData.name || !formData.email || !formData.password || !formData.batchId || !formData.phone) {
        setErrorMsg("Please fill in all required fields (Name, Email, Password, Batch, Phone).");
        setCreating(false);
        return;
      }

      const payload = {
        password: formData.password,
        student: {
          name: formData.name,
          email: formData.email,
          batchId: formData.batchId,
          phone: formData.phone,
          enrollmentDate: new Date().toISOString().split('T')[0] + "T00:00:00.000Z",
          ...(formData.image.trim() ? { image: formData.image } : {})
        }
      };

      console.log("Sending Student Payload:", JSON.stringify(payload, null, 2));

      await createStudent(payload);
      setModalVisible(false);
      setFormData({ name: "", email: "", password: "", phone: "", image: "", batchId: "", batchName: "" });
      Alert.alert("Success", "Student created successfully!");
      fetchStudents();
    } catch (err: any) {
      console.error("Create Student Error:", err.response?.data || err);
      let errorMessage = "Failed to create student. Please try again.";
      const newFieldErrors: Record<string, string> = {};

      if (err.response?.data) {
        if (err.response.data.errorSources && err.response.data.errorSources.length > 0) {
           const messages: string[] = [];
           err.response.data.errorSources.forEach((e: any) => {
             messages.push(`• ${e.message}`);
             if (e.path) {
               const pathStr = Array.isArray(e.path) ? e.path[e.path.length - 1] : String(e.path);
               const field = pathStr.split('=>').pop() || pathStr;
               newFieldErrors[field] = e.message;
             }
           });
           errorMessage = "Please fix the following errors:\n" + messages.join('\n');
        } else if (err.response.data.message) {
           errorMessage = err.response.data.message;
        }
      }
      
      setFieldErrors(newFieldErrors);
      setErrorMsg(errorMessage);
    } finally {
      setCreating(false);
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
          <Text className="text-primary text-2xl font-bold">Students</Text>
          <View className="flex-row gap-x-3">
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
              <Ionicons name="search-outline" size={22} color="#1e293b" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              className="h-10 w-10 items-center justify-center rounded-full bg-primary shadow-sm"
            >
              <Ionicons name="add" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* List */}
        <View className="px-6 mt-4 gap-y-4">
          {students.length === 0 ? (
            <View className="py-10 items-center justify-center">
               <Text className="text-gray-400 font-medium">No students found.</Text>
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
                      {student.user?.status || 'UNKNOWN'}
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

      {/* Add Student Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "#ffffff" }}
        >
          <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
            <Text className="text-primary text-xl font-bold">Add New Student</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
            {errorMsg ? (
              <View className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-6">
                <Text className="text-red-600 font-medium text-sm text-center">{errorMsg}</Text>
              </View>
            ) : null}

            <View className="gap-y-5 pb-10">
              <View>
                <Text className="text-sm font-semibold text-primary mb-2 ml-1">Full Name *</Text>
                <View className={`flex-row items-center rounded-2xl bg-gray-50 border px-4 py-3 ${fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                  <Ionicons name="person-outline" size={20} color={fieldErrors.name ? '#f87171' : '#94a3b8'} />
                  <TextInput
                    placeholder="e.g. Alice Smith"
                    placeholderTextColor="#94a3b8"
                    className="ml-3 flex-1 text-base text-primary"
                    value={formData.name}
                    onChangeText={(t) => { setFormData({...formData, name: t}); setFieldErrors({...fieldErrors, name: ''}); }}
                  />
                </View>
                {fieldErrors.name ? <Text className="text-red-500 text-xs ml-2 mt-1">{fieldErrors.name}</Text> : null}
              </View>

              <View>
                <Text className="text-sm font-semibold text-primary mb-2 ml-1">Email Address *</Text>
                <View className={`flex-row items-center rounded-2xl bg-gray-50 border px-4 py-3 ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                  <Ionicons name="mail-outline" size={20} color={fieldErrors.email ? '#f87171' : '#94a3b8'} />
                  <TextInput
                    placeholder="alice@example.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="ml-3 flex-1 text-base text-primary"
                    value={formData.email}
                    onChangeText={(t) => { setFormData({...formData, email: t}); setFieldErrors({...fieldErrors, email: ''}); }}
                  />
                </View>
                {fieldErrors.email ? <Text className="text-red-500 text-xs ml-2 mt-1">{fieldErrors.email}</Text> : null}
              </View>

              <View>
                <Text className="text-sm font-semibold text-primary mb-2 ml-1">Password *</Text>
                <View className={`flex-row items-center rounded-2xl bg-gray-50 border px-4 py-3 ${fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                  <Ionicons name="lock-closed-outline" size={20} color={fieldErrors.password ? '#f87171' : '#94a3b8'} />
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#94a3b8"
                    className="ml-3 flex-1 text-base text-primary"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(t) => { setFormData({...formData, password: t}); setFieldErrors({...fieldErrors, password: ''}); }}
                  />
                </View>
                {fieldErrors.password ? <Text className="text-red-500 text-xs ml-2 mt-1">{fieldErrors.password}</Text> : null}
              </View>

              {/* Batch Dropdown */}
              <View>
                <Text className="text-sm font-semibold text-primary mb-2 ml-1">Assign Batch *</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => setShowBatchDropdown(!showBatchDropdown)}
                  className={`flex-row items-center rounded-2xl bg-gray-50 border px-4 py-3 ${fieldErrors.batchId ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                >
                  <Ionicons name="layers-outline" size={20} color={fieldErrors.batchId ? '#f87171' : '#94a3b8'} />
                  <Text className={`ml-3 flex-1 text-base ${formData.batchName ? 'text-primary' : 'text-gray-400'}`}>
                    {formData.batchName || "Select a batch"}
                  </Text>
                  <Ionicons name={showBatchDropdown ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
                </TouchableOpacity>
                {fieldErrors.batchId ? <Text className="text-red-500 text-xs ml-2 mt-1">{fieldErrors.batchId}</Text> : null}

                {showBatchDropdown && (
                  <View className="mt-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden z-50">
                    {batches.length === 0 ? (
                      <Text className="p-4 text-center text-gray-400">No batches available</Text>
                    ) : (
                      batches.map((b: any) => (
                        <TouchableOpacity
                          key={b.id}
                          className="p-4 border-b border-gray-50 flex-row items-center justify-between"
                          onPress={() => {
                            setFormData({ ...formData, batchId: b.id, batchName: b.name });
                            setFieldErrors({ ...fieldErrors, batchId: '' });
                            setShowBatchDropdown(false);
                          }}
                        >
                          <Text className="text-primary font-medium">{b.name}</Text>
                          {formData.batchId === b.id && <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />}
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
              </View>

              <View>
                <Text className="text-sm font-semibold text-primary mb-2 ml-1">Phone Number *</Text>
                <View className={`flex-row items-center rounded-2xl bg-gray-50 border px-4 py-3 ${fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                  <Ionicons name="call-outline" size={20} color={fieldErrors.phone ? '#f87171' : '#94a3b8'} />
                  <TextInput
                    placeholder="e.g. 01712345678"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    className="ml-3 flex-1 text-base text-primary"
                    value={formData.phone}
                    onChangeText={(t) => { setFormData({...formData, phone: t}); setFieldErrors({...fieldErrors, phone: ''}); }}
                  />
                </View>
                {fieldErrors.phone ? <Text className="text-red-500 text-xs ml-2 mt-1">{fieldErrors.phone}</Text> : null}
              </View>

              <View>
                <Text className="text-sm font-semibold text-primary mb-2 ml-1">Image URL</Text>
                <View className={`flex-row items-center rounded-2xl bg-gray-50 border px-4 py-3 ${fieldErrors.image ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                  <Ionicons name="image-outline" size={20} color={fieldErrors.image ? '#f87171' : '#94a3b8'} />
                  <TextInput
                    placeholder="https://example.com/photo.jpg"
                    placeholderTextColor="#94a3b8"
                    className="ml-3 flex-1 text-base text-primary"
                    autoCapitalize="none"
                    value={formData.image}
                    onChangeText={(t) => { setFormData({...formData, image: t}); setFieldErrors({...fieldErrors, image: ''}); }}
                  />
                </View>
                {fieldErrors.image ? <Text className="text-red-500 text-xs ml-2 mt-1">{fieldErrors.image}</Text> : null}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="p-6 pb-10 border-t border-gray-100">
            <TouchableOpacity 
              onPress={handleCreateStudent}
              disabled={creating}
              className={`h-14 bg-primary items-center justify-center rounded-2xl ${creating ? 'opacity-70' : ''}`}
            >
              {creating ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-lg">Create Student</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}
