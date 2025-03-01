import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, router } from 'expo-router';
import apiClient from "../../utils/apiClient";
import { getCurrentUserId } from '@/utils/authHelpers';
import type { ApiResponse } from "@/types/api";

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

const GroupsPage: React.FC = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() =>
        router.push(`/(home)/group_chat?groupName=${encodeURIComponent(item.name)}`)
      }
    >
      <Text style={styles.groupName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Group Chats</Text>
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