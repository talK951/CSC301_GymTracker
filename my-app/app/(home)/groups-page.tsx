import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, router } from 'expo-router';
import apiClient from "../../utils/apiClient";
import { getCurrentUserId } from '@/utils/authHelpers';
import type { ApiResponse } from "@/types/api";
import { Ionicons } from "@expo/vector-icons";

interface Group {
  id: string;
  name: string;
}

function showAlert(title: string, message: string) {
  if (typeof window !== "undefined" && window.alert) {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
}

function showConfirm(title: string, message: string): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  } else {
    return new Promise((resolve) => {
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: "Delete", onPress: () => resolve(true), style: "destructive" },
      ]);
    });
  }
}

const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch groups for the current user
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const userId = await getCurrentUserId();
      if (userId === null) {
        showAlert("Error", "User not authenticated");
        return;
      }
      setCurrentUserId(userId);

      const response = await apiClient.get<ApiResponse<Group[]>>(`/group/user/${userId}`);
      setGroups(response.data.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      showAlert("Error", "Failed to fetch groups.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteGroup = async (groupId: string) => {
    if (!currentUserId) return;
    const confirmed = await showConfirm("Leave Group", "Are you sure you want to leave this group?");
    if (!confirmed) return;
    try {
      await apiClient.delete<ApiResponse<Group[]>>(`/group/${groupId}/users/${currentUserId}`);
      setGroups((prevGroups) =>
        prevGroups.filter((group) => group.id !== groupId)
      );
      showAlert("Success", `User removed from group successfully.`);
    } catch (error) {
      console.error(`Failed to delete ${currentUserId} from group:`, error);
      showAlert("Error", "Failed to delete user from group.");
    }
  }

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() =>
        router.push(`/(home)/group-chat?groupName=${encodeURIComponent(item.name)}`)
      }
    > 
    <View style={styles.groupNameContainer}>
      <Text style={styles.groupName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleDeleteGroup(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#E53935" />
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>My Group Chats</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search group chats..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={filteredGroups}
            keyExtractor={(item: Group) => item.id}
            renderItem={renderGroupItem}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  groupCard: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  groupNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 5,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
});

export default GroupsPage;