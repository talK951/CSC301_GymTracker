import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const users = [
  { id: '1', name: 'John Doe', avatar: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Jane Smith', avatar: 'https://via.placeholder.com/150' },
  // Add more users as needed
];

const DiscoverPage = () => {
  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Users</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
  },
});

export default DiscoverPage;