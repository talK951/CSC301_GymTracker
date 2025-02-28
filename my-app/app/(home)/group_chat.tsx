import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useSearchParams } from 'expo-router/build/hooks';

const ChatScreen = () => {
  const [message, setMessage] = useState(""); // State for the text input
  const [posts, setPosts] = useState<string[]>([]); // State to store fetched posts

  const searchParams = useSearchParams();
  const chatName = searchParams.get('chatName');

  const sendPost = async (post: string) => {
    try {
      const groupPayload = {
        posts: post
      };
      console.log(groupPayload);
      // Replace with your actual endpoint
      const response = await axios.post(
        `http://localhost:8080/api/group/${chatName}/post`,
        groupPayload,
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0YWwiLCJ1c2VySWQiOjEsImlhdCI6MTc0MDcwODEzNywiZXhwIjoxNzQwNzk0NTM3fQ.RLiDlUiWdxLV2XgvuQhf-p50dUDyLbDreaxpHjmfaN0"
          }
        }
      );
      console.log('POST request successful:', response.data);
      // Clear the input field after successful post
      setMessage("");
    } catch (error) {
      console.error('Error posting group:', error);
    }
  };

  const fetchPosts = async (): Promise<string[]> => {
    try {
      const response = await fetch(`http://localhost:8080/api/group/${chatName}/posts`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0YWwiLCJ1c2VySWQiOjEsImlhdCI6MTc0MDcwODEzNywiZXhwIjoxNzQwNzk0NTM3fQ.RLiDlUiWdxLV2XgvuQhf-p50dUDyLbDreaxpHjmfaN0"
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: string[] = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      return [];
    }
  };

  const navigation = useNavigation();

  const getPosts = async () => {
    const fetchedPosts = await fetchPosts();
    setPosts(fetchedPosts);
  };

  useFocusEffect(
    useCallback(() => {
      // Fetch posts whenever this component comes into focus.
      getPosts();
    }, [chatName])
  );

  const onClickSend = async (post: string) => {
    await sendPost(post);
    await getPosts();
  };

  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>
        
        {/* Chat Messages */}
        <ScrollView style={styles.chatContainer}>
          {posts.map((post, index) => (
            <View key={index} style={styles.postBubble}>
              <Text style={styles.postText}>{post}</Text>
            </View>
          ))}
        </ScrollView>
        
        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#aaa"
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => onClickSend(message)}>
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
    // Optionally, add shadow for iOS and elevation for Android:
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  postText: {
    color: '#fff',
    fontSize: 16,
  },
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
