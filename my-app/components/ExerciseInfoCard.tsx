import { Exercise } from "@/types/api";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface ExerciseInfoCardProps {
  exercise: Exercise;
  index: number;
  onUpdate: (exerciseId: number, field: keyof Exercise, value: string | number) => void;
  showDelete?: boolean; // if true, show the delete button.
  onDelete?: (exerciseId: number) => void;
}

const ExerciseInfoCard: React.FC<ExerciseInfoCardProps> = ({ exercise, index, onUpdate, showDelete = false, onDelete}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.exerciseTitle}>Exercise {index + 1}</Title>
          {showDelete && onDelete && (
            <TouchableOpacity onPress={() => onDelete(exercise.id)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#E53935" />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          label="Exercise Name"
          value={exercise.exercise}
          onChangeText={(text) => onUpdate(exercise.id, "exercise", text)}
          style={styles.input}
          mode="outlined"
        />
        <View style={styles.exerciseStats}>
          <TextInput
            label="Sets"
            value={String(exercise.sets)}
            keyboardType="numeric"
            onChangeText={(text) => {
              const parsedValue = Number.parseInt(text);
              onUpdate(
                exercise.id,
                "sets",
                text === "" || isNaN(parsedValue) ? 0 : parsedValue
              );
            }}
            style={[styles.input, styles.statInput]}
            mode="outlined"
          />
          <TextInput
            label="Reps"
            value={String(exercise.reps)}
            keyboardType="numeric"
            onChangeText={(text) => {
              const parsedValue = Number.parseInt(text);
              onUpdate(
                exercise.id,
                "reps",
                text === "" || isNaN(parsedValue) ? 0 : parsedValue
              );
            }}
            style={[styles.input, styles.statInput]}
            mode="outlined"
          />
          <TextInput
            label="Weight"
            value={String(exercise.weight)}
            keyboardType="numeric"
            onChangeText={(text) => {
              const parsedValue = Number.parseFloat(text);
              onUpdate(
                exercise.id,
                "weight",
                text === "" || isNaN(parsedValue) ? 0 : parsedValue
              );
            }}
            style={[styles.input, styles.statInput]}
            mode="outlined"
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200EE",
    marginBottom: 12,
  },
  deleteText: {
    color: "#E53935",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
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
  deleteButton: {
    marginBottom: 14
  }
});

export default ExerciseInfoCard;