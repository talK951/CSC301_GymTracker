import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Title } from "react-native-paper";
import CustomButton from "../../components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    username: "",
    utorid: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = () => {
    const { username, utorid, email, password } = formData;

    if (!username || !utorid || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (!email.includes("@mail.utoronto.ca")) {
      alert("Please enter a valid Uoft email address");
      return;
    }

    alert("Registered successfully!");
  };

  return (
    <LinearGradient
      colors={["#1A1A1A", "#333333"]}
      style={styles.background}
    >
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