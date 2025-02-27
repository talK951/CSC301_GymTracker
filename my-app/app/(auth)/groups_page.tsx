import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';

interface Group {
  id: string;
  name: string;
}

const mockFetchGroups = (page: number): Promise<Group[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newGroups: Group[] = Array.from({ length: 8 }, (_, index) => {
        const id = (page - 1) * 8 + index + 1;
        return {
          id: id.toString(),
          name: `Group Chat ${id}`,
        };
      });
      resolve(newGroups);
    }, 1000);
  });
};

const GroupsPage: React.FC = () => {
  const navigation = useNavigation();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    mockFetchGroups(page).then((newGroups: Group[]) => {
      setGroups((prevGroups) => [...prevGroups, ...newGroups]);
      setLoading(false);
    });
  }, [page]);

  const loadMoreGroups = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onClickGroup = () => {
    router.push("/(auth)/group_chat");
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
            <TouchableOpacity style={styles.groupCard} onPress={onClickGroup}>
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