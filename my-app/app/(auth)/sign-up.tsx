import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Title } from "react-native-paper";
import CustomButton from "../../components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axios from "axios";

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    utorid: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    const { username, name, utorid, email, password } = formData;

    if (!username || !name || !utorid || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (!email.includes("@mail.utoronto.ca")) {
      alert("Please enter a valid Uoft email address");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/user", {
        username: formData.username.toLowerCase(),
        name: formData.name.toLowerCase(),
        utorID: formData.utorid.toLowerCase(),
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      router.push("/(auth)/sign-in");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert("An account with this email already exists.");
        } else if (error.response?.status === 400) {
          Alert.alert("Invalid Data", error.response.data.message || "Check your details and try again.");
        } else {
          Alert.alert("Error", error.response?.data?.message || "Failed to register. Please try again.");
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <View style={styles.container}>
        <Title style={styles.title}>Sign Up</Title>
        <TextInput
          label="Username"
          value={formData.username}
          onChangeText={(value) => handleInputChange("username", value)}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#4CAF50", background: "#FFF" } }}
        />
        <TextInput
          label="Name"
          value={formData.name}
          onChangeText={(value) => handleInputChange("name", value)}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#4CAF50", background: "#FFF" } }}
        />
        <TextInput
          label="UTORid"
          value={formData.utorid}
          onChangeText={(value) => handleInputChange("utorid", value)}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#4CAF50", background: "#FFF" } }}
        />
        <TextInput
          label="UofT Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
          theme={{ colors: { primary: "#4CAF50", background: "#FFF" } }}
        />
        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#4CAF50", background: "#FFF" } }}
        />
        <CustomButton label="Sign Up" onPress={handleSignUp} color="#4CAF50" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
});