import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Title } from "react-native-paper";
import CustomButton from "../../components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { saveToken } from "../../utils/authStorage";
import Constants from 'expo-constants';
import axios from "axios";
import { AxiosResponse } from "axios";
import { ApiResponse, JwtResponseType } from "@/types/api";

export default function SignInScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/user/auth`, {
        username,
        password,
      });
      
      const jwtToken = unwrapApiResponse<JwtResponseType>(response).token;
      await saveToken(jwtToken);
      router.push("/(home)/nav_bar");

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 404) {
          alert("Invalid credentials, please try again.");
        } else {
          console.log(status);
          alert("Login failed. Please try again.");
        }
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  function unwrapApiResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    return response.data.data;
  }

  return (
    <LinearGradient
      colors={["#1A1A1A", "#333333"]}
      style={styles.background}
    >
      <View style={styles.container}>
        <Title style={styles.title}>Login</Title>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#FFA500", background: "#FFF" } }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#FFA500", background: "#FFF" } }}
        />
        <CustomButton label="Login" onPress={handleLogin} color="#FFA500" />
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
