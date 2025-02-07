import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function PersonalPage() {
  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <View style={styles.container}>
        <Title style={styles.title}>Personal Page</Title>
        <Section title="Daily Summary" />
        <Section title="Gym Progress" />
        <Section title="Consistency" />
      </View>
    </LinearGradient>
  );
}

const Section: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Card style={styles.section}>
      <Card.Title title={title} titleStyle={styles.sectionTitle} />
    </Card>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginBottom: 15,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});