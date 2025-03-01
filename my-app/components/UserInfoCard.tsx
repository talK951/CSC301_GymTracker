import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types/api';

interface UserInfoCardProps {
  user: User;
  onPlusPress: () => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user, onPlusPress }) => {
  // Hard-coded profile pictire for now
  const profilePic = user.profilePicture || 'https://i.pravatar.cc/150?img=${70}';

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Image source={{ uri: profilePic }} style={styles.avatar} />
        <View style={styles.info}>
          <Title style={styles.name}>{user.name}</Title>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <TouchableOpacity style={styles.plusButton} onPress={onPlusPress}>
          <Ionicons name="add-circle-outline" size={28} color="#6200EE" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  plusButton: {
    padding: 4,
  },
});

export default UserInfoCard;