import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface PostProps {
    profileImage: string;
    username: string;
    content: string;
    postImage: string;
}

export default function GroupsPage() {
  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Groups Page</Text>
        </View>

        <View style={styles.postContainer}>
            <View style={styles.postContainer}>
                <Post
                    profileImage=""
                    username="John"
                    postImage = ""
                    content="This is my first day at the gym. Can't wait to bench 225."
                ></Post>

                <Post
                    profileImage=""
                    username="Mark"
                    postImage=""
                    content="Had a great day at the RAWC today. Met lots of very nice people!"
                ></Post>
                    </View>
        </View>


      </ScrollView>
    </LinearGradient>
  );
}

const Post: React.FC<PostProps> = ({profileImage, username, content}) => {
    return (
        <View style={styles.postContainer}>
            <View style={styles.postHeader}>
                {/* <Image source={{uri: profileImage}} style={styles.profileImage}/> */}
                <Text style={styles.username}>{username}</Text>
            </View>
            {/* <Image source={{uri:postImage}} style={styles.postContent}/> */}
            <Text style={styles.postContent}>{content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1, 
    alignItems: "center",
    paddingBottom: 50,
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    width:1000,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFF",
  },
  section: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  postContainer: {
    flex: 1,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
},
username: {
    fontSize: 24,
    fontWeight: "Bold",
},

postHeader: {
    backgroundColor: "#DDDDDD",
    height: 50,
    padding: 10,
    borderBottomWidth: 3,
    borderBlockColor: "#222222",
},
  postContent: {
    padding: 10,
    fontSize: 18
  }
});