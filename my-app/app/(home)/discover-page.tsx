import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { TextInput, Title } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '@/utils/apiClient';
import { useRouter } from "expo-router";
import type { ApiResponse, User } from '@/types/api';
import UserInfoCard from '@/components/UserInfoCard';
import { getCurrentUserId } from '@/utils/authHelpers';

const DiscoverPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const id = await getCurrentUserId();
      setCurrentUserId(id);
    };
    fetchCurrentUserId();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<User[]>>('/user/all');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) && user.id !== currentUserId
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <UserInfoCard
      user={item}
      onPlusPress={() => {
        router.push(`/(home)/create-group?email=${encodeURIComponent(item.email)}`);
      }}
    />
  );

  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <View style={styles.container}>
        <Title style={styles.header}>Discover Users</Title>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item: User) => item.id.toString()}
            renderItem={renderUserItem}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default DiscoverPage;