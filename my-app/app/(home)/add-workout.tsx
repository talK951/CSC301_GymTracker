import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform, Alert, TouchableOpacity } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import apiClient from "@/utils/apiClient";
import type { ApiResponse, CreateExerciseDTO, WorkoutDTO, Exercise, WorkoutResponseData } from "@/types/api";
import ExerciseInfoCard from "@/components/ExerciseInfoCard";

// Helper functions for cross-platform alerts
function showAlert(title: string, message: string) {

    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
}

export default function AddWorkout() {
    const router = useRouter();
    const navigation = useNavigation();
    
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const addExercise = () => {
      setExercises((prev) => [
        ...prev,
        {
          id: Date.now(), // Temporary id for rendering
          exercise: "",
          sets: 0,
          reps: 0,
          weight: 0,
          createdAt: new Date().toISOString(),
        },
      ]);
    };

    const updateExerciseField = (
      exerciseId: number,
      field: keyof Exercise,
      value: string | number
    ) => {
      setExercises((prevExercises) =>
        prevExercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, [field]: value } : ex
        )
      );
    };

    const handleDeleteExercise = (exerciseId: number) => {
        setExercises((prevExercises) =>
          prevExercises.filter((ex) => ex.id !== exerciseId)
        );
    };

    const handleAddWorkout = async () => {
      if (!startTime || !endTime) {
        showAlert("Error", "Please fill in both start time and end time.");
        return;
      }

      if (exercises.length === 0) {
        showAlert("Error", "Please add at least one exercise.");
        return;
      }

      for (const exercise of exercises) {
        if (!exercise.exercise.trim()) {
          showAlert("Error", "Every exercise must have a valid name.");
          return;
        }
        if (exercise.sets < 1 || exercise.reps < 1 || exercise.weight < 1) {
          showAlert("Error", "Sets, reps, and weight for each exercise must be at least 1.");
          return;
        }
      }

      // Remove 'id' and 'createdAt' from each exercise
      const cleanedExercises = exercises.map(({ id, createdAt, ...rest }) => rest) as CreateExerciseDTO[];

      const workout: WorkoutDTO = {
        startTime,
        endTime,
        exercises: cleanedExercises,
      };

      try {
        const response = await apiClient.post<ApiResponse<WorkoutResponseData>>("/workout", workout);
        showAlert("Success", "Workout created successfully.");
        router.push("/(home)/nav_bar");
      } catch (error) {
        console.error("Creation failed:", error);
        showAlert("Error", "Failed to create workout.");
      }
    };

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#6200EE" />
            </TouchableOpacity>
            <Title style={styles.headerTitle}>Add Workout</Title>
        </View>

        <TextInput
          label="Start Time"
          value={startTime}
          onChangeText={setStartTime}
          style={styles.input}
          mode="outlined"
          placeholder="2023-06-10T07:30:00"
        />
        <TextInput
          label="End Time"
          value={endTime}
          onChangeText={setEndTime}
          style={styles.input}
          mode="outlined"
          placeholder="2023-06-10T08:30:00"
        />

        <Title style={styles.subTitle}>Exercises</Title>
        {exercises.map((exercise, index) => (
          <ExerciseInfoCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              onUpdate={updateExerciseField}
              showDelete={true}
              onDelete={handleDeleteExercise}
          />
        ))}

        <Button mode="outlined" onPress={addExercise} style={styles.addExerciseButton}>
          Add Exercise
        </Button>

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleAddWorkout} style={styles.submitButton}>
            Create Workout
          </Button>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  card: {
    marginBottom: 15,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 8,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200EE",
    marginBottom: 8,
  },
  exerciseStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  addExerciseButton: {
    marginVertical: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  submitButton: {
    borderRadius: 8,
  },
});