import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import { Button, Title } from "react-native-paper";
import { useRouter } from "expo-router";
import apiClient from "../../utils/apiClient";
import type { ApiResponse, WorkoutsResponseData, Workout } from "@/types/api";
import { getCurrentUserId } from "@/utils/authHelpers";
import WorkoutCard from "@/components/WorkoutCard";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const userId = await getCurrentUserId();
      if (userId === null) {
        showAlert("Error", "User not authenticated");
        return;
      }
      const response = await apiClient.get<ApiResponse<WorkoutsResponseData>>(`/workout/workouts/${userId}`);
      setWorkouts(response.data.data.workouts);
    } catch (error) {
      console.error(error);
      showAlert("Error", "Failed to fetch workouts.");
    } finally {
      setLoading(false);
    }
  };

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <WorkoutCard
      workoutId={item.id}
      startTime={item.startTime}
      endTime={item.endTime}
      onPress={() => router.push(`/workout-info/${item.id}`)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.pageTitle}>My Workouts</Title>
      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderWorkoutItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <Button
        mode="contained"
        style={styles.addButton}
        icon="plus"
        onPress={() => router.push("/add-workout")}
      >
        Add Workout
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 16,
    marginHorizontal: 16,
    color: "#333",
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
  },
  addButton: {
    margin: 16,
    borderRadius: 8,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Helper to show alerts that work on both web and mobile
function showAlert(title: string, message: string) {
  if (typeof window !== "undefined" && window.alert) {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
}