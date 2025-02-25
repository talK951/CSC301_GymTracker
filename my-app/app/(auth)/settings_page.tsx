import React from "react";
import { View, FlatList, StyleSheet, Text, StatusBar, SafeAreaView } from "react-native";
import { Title, Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { deleteToken } from "../../utils/authStorage";
import { SafeAreaProvider } from "react-native-safe-area-context";

const settingsOptions = [
  { label: "Account Name", value: "Tal Kleiman" },
  { label: "UtorID", value: "kleima12" },
  { label: "Email", value: "tal.kleiman@mail.utoronto.ca" },
];

const SettingsPage = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await deleteToken();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed, Please try again.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Title style={styles.title}>Settings</Title>
        <View style={styles.separator} />
        <FlatList
          data={settingsOptions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </Card.Content>
            </Card>
          )}
        />
        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.logoutLabel}
          >
            Logout
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: StatusBar.currentHeight || 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  separator: {
    height: 2,
    backgroundColor: "#6200EE",
    marginVertical: 10,
  },
  card: {
    marginBottom: 10,
    backgroundColor: "#FFF",
    elevation: 2, // Shadow effect for Android
    shadowColor: "#000", // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6200EE",
  },
  value: {
    fontSize: 18,
    color: "#333",
    marginTop: 4,
  },
  logoutContainer: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 2
  },
  logoutButton: {
    backgroundColor: "#E53935",
    width: "105%",
  },
  logoutLabel: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default SettingsPage;
