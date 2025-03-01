import React, { useState, useEffect } from "react";
import { Text, StyleSheet, ScrollView, Platform, Alert, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput, Title, Card, ActivityIndicator } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import apiClient from "@/utils/apiClient";
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUserId } from "@/utils/authHelpers";
import axios from "axios";
import type { ApiResponse, Group, GroupSummary} from "@/types/api";

function showAlert(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
}

const CreateGroup: React.FC = () => {
  const router = useRouter();
  const { email: targetEmail } = useLocalSearchParams<{ email: string }>();
  const [targetUser, setTargetUser] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [existingGroups, setExistingGroups] = useState<GroupSummary[]>([]);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCurrentUser();
    fetchTargetUser();
    fetchExistingGroups();
  }, [currentUserId]);

  const fetchCurrentUser = async () => {
    const userId = await getCurrentUserId();
    setCurrentUserId(userId);
  };

  const fetchTargetUser = async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/user?email=${encodeURIComponent(targetEmail)}`);
      setTargetUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch target user:", error);
      showAlert("Error", "Failed to load target user.");
    }
  };

  const fetchExistingGroups = async () => {
    try {
      if (!currentUserId) return;
      const response = await apiClient.get<ApiResponse<Group[]>>(`/group/user/${currentUserId}`);
      setExistingGroups(response.data.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      showAlert("Error", "Failed to load your groups.");
    }
  };

  const addToExistingGroup = async (groupName: string) => {
    try {
        const payload = { userIds: [targetUser.id] };
        const response = await apiClient.post<ApiResponse<any>>(`/group/${groupName}/users`, payload);
        showAlert("Success", `User added to group ${groupName} successfully.`);
        router.push("/(home)/nav-bar");
    } catch (error: unknown) {
        console.error("Error adding user to group:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            showAlert("Error", `User already exists in ${groupName}`);
          } else {
            showAlert("Error", "Failed to add user to group.");
          }
        } else {
          showAlert("Error", "Failed to add user to group.");
        }
      }
  };

  const createNewGroup = async () => {
    if (!newGroupName.trim()) {
      showAlert("Error", "Please enter a valid group name.");
      return;
    }
    try {
        const groupPayload = {
          name: newGroupName,
          userIds: [currentUserId, targetUser.id],
        };
        const response = await apiClient.post<ApiResponse<any>>("/group", groupPayload);
        showAlert("Success", "Group created successfully.");
        router.push("/(home)/nav-bar");
    } catch (error) {
        console.error("Error creating new group:", error);
        showAlert("Error", "Failed to create new group.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.arrowContainer} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#6200EE" />
            </TouchableOpacity>
            <Title style={styles.headerTitle}>Create Group</Title>
      </View>
      {targetUser && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Add {targetUser.name}</Title>
            <Text>Email: {targetUser.email}</Text>
          </Card.Content>
        </Card>
      )}
      <Title style={styles.subTitle}>Add to an Existing Group</Title>
      {existingGroups.length > 0 ? (
        existingGroups.map((group) => (
          <TouchableOpacity key={group.id} style={styles.groupItem} onPress={() => addToExistingGroup(group.name)}>
            <Text style={styles.groupName}>{group.name}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.infoText}>You are not a member of any groups yet.</Text>
      )}
      <Title style={styles.subTitle}>Or Create a New Group</Title>
      <TextInput
        label="New Group Name"
        value={newGroupName}
        onChangeText={setNewGroupName}
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={createNewGroup} style={styles.button}>
        Create Group
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      position: "relative",
    },
    arrowContainer: {
      position: "absolute",
      left: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
    },
    card: {
      marginBottom: 16,
      padding: 16,
      elevation: 2,
      borderRadius: 8,
    },
    cardTitle: {
      fontSize: 20,
      marginBottom: 8,
    },
    subTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
    },
    groupItem: {
      padding: 12,
      backgroundColor: "#f0f0f0",
      marginBottom: 8,
      borderRadius: 8,
    },
    groupName: {
      fontSize: 18,
    },
    infoText: {
      fontSize: 16,
      color: "#666",
      marginBottom: 8,
    },
    input: {
      backgroundColor: "#fff",
      marginBottom: 16,
    },
    button: {
      marginTop: 8,
      borderRadius: 8,
    },
});

export default CreateGroup;