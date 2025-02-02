import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Title } from "react-native-paper";
import CustomButton from "../../components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";

export default function SignInScreen() {
  const [utorid, setUtorid] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!utorid || !password) {
      alert("Please fill in all fields");
      return;
    }
    alert("Logged in successfully!");
  };

  return (
    <LinearGradient
      colors={["#1A1A1A", "#333333"]}
      style={styles.background}
    >
      <View style={styles.container}>
        <Title style={styles.title}>Login</Title>
        <TextInput
          label="UTORid"
          value={utorid}
          onChangeText={setUtorid}
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