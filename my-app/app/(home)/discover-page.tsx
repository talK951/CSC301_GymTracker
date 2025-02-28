import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

interface User {
  id: string;
  name: string;
  experience: string;
  workout: string;
  avatar: string;
  location: string;
  utorId: string;
  email: string;
  username: string
  password: string;
}

const mockFetchUsers = (page: number): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUsers: User[] = Array.from({ length: 8 }, (_, index) => {
        const id = (page - 1) * 8 + index + 1;
        return {
          id: id.toString(),
          name: `User${id}`,
          experience: ['Beginner', 'Intermediate', 'Advanced'][id % 3],
          workout: ['Cardio', 'Weightlifting', 'Yoga', 'CrossFit'][id % 4],
          avatar: `https://i.pravatar.cc/150?img=${(id % 70) + 1}`,
          location: ['Mississauga', 'Toronto'][id % 2],
          utorId: `User${id}-UtorId`,
          email: `User${id}@mail.utoronto.ca`,
          username: `User${id}`,
          password: "123",
        };
      });
      resolve(newUsers);
    }, 1000);
  });
};

const DiscoverPage: React.FC = () => {
  const navigation = useNavigation();
  
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    mockFetchUsers(page).then((newUsers: User[]) => {
      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setLoading(false);
    });
  }, [page]);

  const loadMoreUsers = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onClickCreateGroup = async (user: User) => {
    try {
      const groupPayload = {
        name: user.username,
        users: [
          {
            username: user.username,
            name: user.name,
            utorID: user.utorId,
            email: user.email,
            password: user.password
          },
        ]
      };
      console.log(groupPayload);
      // Replace with your actual endpoint
      const response = await axios.post(
        'http://localhost:8080/api/group',
        groupPayload,
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0YWwiLCJ1c2VySWQiOjEsImlhdCI6MTc0MDcwODEzNywiZXhwIjoxNzQwNzk0NTM3fQ.RLiDlUiWdxLV2XgvuQhf-p50dUDyLbDreaxpHjmfaN0"
          }
        });
      console.log('POST request successful:', response.data);
    } catch (error) {
      console.error('Error posting group:', error);
    }
  };
  

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userDetail}>Experience: {item.experience}</Text>
        <Text style={styles.userDetail}>Workout Type: {item.workout}</Text>
        <Text style={styles.userDetail}>Location: {item.location}</Text>
      </View>
      <TouchableOpacity style={styles.plusButton} onPress={() => onClickCreateGroup(item)}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Looking for a workout partner</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredUsers}
          keyExtractor={(item: User) => item.id}
          renderItem={renderUserItem}
          onEndReached={loadMoreUsers}
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
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetail: {
    fontSize: 14,
    color: '#555',
  },
  plusButton: {
    backgroundColor: '#333333', // Darker color for the button
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: '#FFFFFF', // Bright white for the plus
    fontSize: 20,
    lineHeight: 20,
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
});

export default DiscoverPage;
