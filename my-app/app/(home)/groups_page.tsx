import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from 'expo-router';
import { getCurrentUserId } from '@/utils/authHelpers';
import { getToken } from '@/utils/authStorage';
import Constants from 'expo-constants';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';


interface Group {
  id: string;
  name: string;
  users: User[];
}

interface User {
  username: string,
  name: string,
  utorID: string,
  email: string,
}

const fetchGroups = async (): Promise<Group[]> => {
  try {
    const response = await fetch(`http://192.168.87.48:8080/api/group`, {
      method: 'GET',
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0YWwiLCJ1c2VySWQiOjEsImlhdCI6MTc0MDcwODEzNywiZXhwIjoxNzQwNzk0NTM3fQ.RLiDlUiWdxLV2XgvuQhf-p50dUDyLbDreaxpHjmfaN0"
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Group[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    return [];
  }
};


const GroupsPage: React.FC = () => {
  const navigation = useNavigation();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const lastFetchedRef = useRef<number>(0);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchGroups()
        .then((newGroups: Group[]) => {
          // Optionally, you could replace existing groups or append.
          // Here, we replace the groups on each focus.
          setGroups(newGroups);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }, [])
  );

  const loadMoreGroups = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onClickGroup = (chatName: string) => {
    router.push(`/(home)/group_chat?chatName=${encodeURIComponent(chatName)}`);
  };

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
        <FlatList
          data={filteredGroups}
          keyExtractor={(item: Group) => item.id}
          renderItem={({ item }: { item: Group }) => (
            <TouchableOpacity style={styles.groupCard} onPress={() => onClickGroup(item.name)}>
              <Text style={styles.groupName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          onEndReached={loadMoreGroups}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
          }
        />
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