import { useEffect, useState, useRef } from "react"
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import apiClient from "@/utils/apiClient"
import { useLocalSearchParams } from "expo-router"
import { ChatStompClient } from "@/utils/ChatStompClient"
import { getCurrentUser } from "@/utils/authHelpers"
import Constants from "expo-constants"
import * as ImagePicker from "expo-image-picker"
import type { Post, CurrentUser } from "@/types/api"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const MAX_IMAGE_WIDTH = SCREEN_WIDTH * 0.7

const GroupChat = () => {
  const [message, setMessage] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const { groupName } = useLocalSearchParams<{ groupName: string }>()
  const [user, setUser] = useState<CurrentUser | null>(null);
  const navigation = useNavigation()
  const scrollViewRef = useRef<ScrollView>(null)
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({})

  const stompRef = useRef<ChatStompClient | null>(null)
  const wsUrl = Constants.expoConfig?.extra?.WS_URL
  const bucket = Constants.expoConfig?.extra?.AWS_S3_BUCKET
  const bucketRegion = Constants.expoConfig?.extra?.AWS_REGION

  const handleIncomingMessage = (payload: any) => {
    if (payload) {
      const newPost: Post = {
        id: payload.id,
        content: payload.content,
        sender: payload.sender,
        timestamp: payload.timestamp,
        s3ObjectKey: payload.s3ObjectKey,
        isImage: payload.isImage,
      }
      setPosts((prevPosts) => [...prevPosts, newPost])

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }

  useEffect(() => {
    if (!groupName) return

    fetchPosts()

    const fetchCurrentUser = async () => {
      const user = await getCurrentUser()
      setUser(user);
    }

    fetchCurrentUser();

    // Build the STOMP client with the same URL you used in WebSocketConfig
    const client = new ChatStompClient(wsUrl, groupName)
    client.setMessageCallback(handleIncomingMessage)

    // Connect to STOMP
    client.connect()
    stompRef.current = client

    return () => {
      client.disconnect()
    }
  }, [groupName])

  useEffect(() => {
    if (posts.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false })
      }, 100)
    }
  }, [posts.length])

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get(`/posts/group/${groupName}`)
      const fetchedPosts: Post[] = response.data.data.map((p: any) => ({
        id: p.id,
        content: p.content,
        sender: p.senderUsername,
        timestamp: p.timestamp,
        s3ObjectKey: p.s3ObjectKey,
        isImage: p.isImage,
      }))
      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      Alert.alert("Error", "Failed to load posts.")
    }
  }

  const sendTextPost = () => {
    if (!stompRef.current || !message.trim()) return
    stompRef.current.sendMessage(message.trim(), false, "", String(user?.userId))
    setMessage("")
  }

  const sendImagePost = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.status !== "granted") {
      Alert.alert("Permission required", "Permission to access media library is required!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (result.canceled) return

    const localUri = result.assets[0].uri
    const fileName = result.assets[0].fileName
    const mimeType = result.assets[0].mimeType || "image/png"
    console.log(result.assets[0])

    try {
      const presignResponse = await apiClient.post("/s3/presign-upload", {
        fileName: fileName,
        contentType: mimeType,
      })

      const { presignedUrl, s3ObjectKey } = presignResponse.data.data

      const imageData = await fetch(localUri)
      const blob = await imageData.blob()

      // Upload the image directly to S3 using the presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": mimeType,
        },
      })

      if (!uploadResponse.ok) {
        Alert.alert("Upload failed", "Image upload to S3 failed.")
        return
      }

      // Send a STOMP message to notify all clients about the new image post.
      if (stompRef.current) {
        stompRef.current.sendMessage("", true, s3ObjectKey, String(user?.userId))
      }
    } catch (error) {
      console.error("Error sending image post:", error)
      Alert.alert("Error", "Failed to send image post.")
    }
  }

  const handleImageLoad = (s3ObjectKey: string) => {
    setLoadingImages((prev) => ({ ...prev, [s3ObjectKey]: false }))
  }

  const isOwnMessage = (sender: string) => {
    return sender === user?.username
  }

  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{groupName || "Group Chat"}</Text>
        </View>

        <ScrollView ref={scrollViewRef} style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
          {posts.map((post) => {
            const isOwn = isOwnMessage(post.sender)

            if (post.isImage && post.s3ObjectKey && loadingImages[post.s3ObjectKey] === undefined) {
              setLoadingImages((prev) => ({ ...prev, [post.s3ObjectKey!]: true }))
            }

            return (
              <View key={post.timestamp} style={[styles.postBubble, isOwn ? styles.ownMessage : styles.otherMessage]}>
                <Text style={styles.postHeader}>
                  {post.sender} •{" "}
                  {new Date(post.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
                {post.isImage && post.s3ObjectKey ? (
                  <View style={styles.imageContainer}>
                    {loadingImages[post.s3ObjectKey] && (
                      <ActivityIndicator size="small" color="#fff" style={styles.imageLoader} />
                    )}
                    <Image
                      source={{ uri: `https://${bucket}.s3.${bucketRegion}.amazonaws.com/${post.s3ObjectKey}` }}
                      style={styles.chatImage}
                      resizeMode="contain"
                      onLoad={() => handleImageLoad(post.s3ObjectKey!)}
                    />
                  </View>
                ) : (
                  <Text style={styles.postContent}>{post.content}</Text>
                )}
              </View>
            )
          })}
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={sendImagePost}>
              <Ionicons name="image" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={sendTextPost}
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 10,
  },
  postBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  ownMessage: {
    backgroundColor: "#0B93F6",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: "#444",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  postHeader: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  postContent: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  chatImage: {
    width: MAX_IMAGE_WIDTH,
    height: undefined,
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
  imageLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -10,
    marginTop: -10,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#444",
    backgroundColor: "#222",
    borderRadius: 24,
    marginTop: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: 8,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 42,
    height: 42,
  },
  sendButtonDisabled: {
    backgroundColor: "#555",
  },
  imageButton: {
    marginRight: 8,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 42,
    height: 42,
  },
})

export default GroupChat
