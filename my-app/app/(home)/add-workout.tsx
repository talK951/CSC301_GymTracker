import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform, Alert, TouchableOpacity } from "react-native";
import { Button, Title, Text, TextInput } from "react-native-paper";
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

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
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
      if (!startDate || !endDate) {
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
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        exercises: cleanedExercises,
      }

      try {
        const response = await apiClient.post<ApiResponse<WorkoutResponseData>>("/workout", workout);
        showAlert("Success", "Workout created successfully.");
        router.push("/(home)/nav-bar");
      } catch (error) {
        console.error("Creation failed:", error);
        showAlert("Error", "Failed to create workout.");
      }
    };

    const formatDateForInput = (date: Date) => {
      return date.toISOString().split("T")[0];
    }
  
    const formatTimeForInput = (date: Date) => {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    }

    const handleDateChange = (isStart: boolean, value: string) => {
      if (!value) return;
      const defaultEnd = new Date(startDate.getTime() + 3600000);
      const baseDate = isStart ? startDate : (endDate ?? defaultEnd);
      const newDate = new Date(baseDate);
      const parts = value.split("-");
      newDate.setFullYear(Number(parts[0]));
      newDate.setMonth(Number(parts[1]) - 1);
      newDate.setDate(Number(parts[2]));
      isStart ? setStartDate(newDate) : setEndDate(newDate);
    }
    
    const handleTimeChange = (isStart: boolean, value: string) => {
      if (!value) return;
      const [hours, minutes] = value.split(":");
      if (!hours || !minutes) return;
      const defaultEnd = new Date(startDate.getTime() + 3600000);
      const baseDate = isStart ? startDate : (endDate ?? defaultEnd);
      const newDate = new Date(baseDate);
      newDate.setHours(Number.parseInt(hours));
      newDate.setMinutes(Number.parseInt(minutes));
      isStart ? setStartDate(newDate) : setEndDate(newDate);
    }

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#6200EE" />
            </TouchableOpacity>
            <Title style={styles.headerTitle}>Add Workout</Title>
        </View>

        {Platform.OS === "web" ? (
        <>
          <View style={styles.webDateTimeContainer}>
            <Text style={styles.dateTimeLabel}>Start Time:</Text>
            <View style={styles.dateTimeInputGroup}>
              <input
                type="date"
                value={formatDateForInput(startDate)}
                onChange={(e) => handleDateChange(true, e.target.value)}
                style={styles.webDateInput}
              />
              <input
                type="time"
                value={formatTimeForInput(startDate)}
                onChange={(e) => handleTimeChange(true, e.target.value)}
                style={styles.webTimeInput}
              />
            </View>
          </View>
          <View style={styles.webDateTimeContainer}>
            <Text style={styles.dateTimeLabel}>End Time:</Text>
            <View style={styles.dateTimeInputGroup}>
              <input
                type="date"
                value={endDate ? formatDateForInput(endDate) : ""}
                onChange={(e) => handleDateChange(false, e.target.value)}
                style={styles.webDateInput}
              />
              <input
                type="time"
                value={endDate ? formatTimeForInput(endDate) : ""}
                onChange={(e) => handleTimeChange(false, e.target.value)}
                style={styles.webTimeInput}
              />
            </View>
          </View>
        </>
      ) : (
        <>
          <TextInput
            label="Start Time"
            value={startDate.toLocaleString()}
            onFocus={() => showAlert("Info", "Implement a date picker here for mobile")}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="End Time"
            value={endDate ? endDate.toLocaleString() : ""}
            onFocus={() => showAlert("Info", "Implement a date picker here for mobile")}
            style={styles.input}
            mode="outlined"
          />
        </>
      )}
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
  webDateTimeContainer: {
    marginBottom: 12,
  },
  dateTimeLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  dateTimeInputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  webDateInput: {
    flex: 1,
    marginRight: 8,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#6200EE",
    fontSize: 16,
  },
  webTimeInput: {
    width: "40%",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#6200EE",
    fontSize: 16,
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