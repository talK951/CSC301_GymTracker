import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/utils/apiClient';
import { useLocalSearchParams } from 'expo-router';
import { ChatStompClient } from '@/utils/ChatStompClient';
import { getCurrentUserId } from '@/utils/authHelpers';
import Constants from 'expo-constants';
import { Post } from '@/types/api';

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const { groupName } = useLocalSearchParams<{ groupName: string }>();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const navigation = useNavigation();

  const stompRef = useRef<ChatStompClient | null>(null);
  const wsUrl = Constants.expoConfig?.extra?.WS_URL;

  const handleIncomingMessage = (payload: any) => {
    console.log("Received payload:", payload);
    if (payload) {
      const newPost: Post = {
        id: payload.id,
        content: payload.content,
        sender: payload.sender,
        timestamp: payload.timestamp,
      };
      setPosts((prevPosts) => [...prevPosts, newPost]);
    }
  };

  useEffect(() => {
    if (!groupName) return;

    fetchPosts();

    const fetchCurrentUserId = async () => {
      const id = await getCurrentUserId();
      setCurrentUserId(id);
    };

    fetchCurrentUserId();

    // Build the STOMP client with the same URL you used in WebSocketConfig
    const client = new ChatStompClient(wsUrl, groupName);
    client.setMessageCallback(handleIncomingMessage);

    // Connect to STOMP
    client.connect();
    stompRef.current = client;

    return () => {
      client.disconnect();
    };
  }, [groupName]);

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get(`/posts/group/${groupName}`);
      const fetchedPosts: Post[] = response.data.data.map((p: any) => ({
        id: p.id,
        content: p.content,
        sender: p.senderUsername,
        timestamp: p.timestamp,
      }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts.');
    }
  }

  const sendPost = () => {
    if (!stompRef.current || !message.trim()) return;
    stompRef.current.sendMessage(message.trim(), String(currentUserId));
    setMessage('');
  };

  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Group Chat</Text>
        </View>

        <ScrollView style={styles.chatContainer}>
          {posts.map((post) => (
            <View key={post.timestamp} style={styles.postBubble}>
              <Text style={styles.postHeader}>
                {post.sender}                {new Date(post.timestamp).toLocaleTimeString()}
              </Text>
              <Text style={styles.postContent}>{post.content}</Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#aaa"
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendPost()}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
    marginVertical: 10,
  },
  postBubble: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 4,
  },
  postContent: { color: '#fff', fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#444',
    backgroundColor: '#222',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
