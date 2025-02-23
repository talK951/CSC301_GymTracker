import type React from "react"
import { useState, useEffect } from "react"
import { View, FlatList, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from "react-native"
import { Button, Card, Title, Paragraph, Divider } from "react-native-paper"
import { useRouter } from "expo-router"
import apiClient from "../../utils/apiClient"
import type { ApiResponse, WorkoutsResponseData, Workout } from "@/types/api"
import { getCurrentUserId } from "@/utils/authHelpers"
import { Ionicons } from "@expo/vector-icons"
import WorkoutCard from "@/components/WorkoutCard"

const WorkoutsPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    setLoading(true)
    try {
      const userId = await getCurrentUserId()
      if (userId === null) {
        Alert.alert("Error", "User not authenticated")
        return
      }
      const response = await apiClient.get<ApiResponse<WorkoutsResponseData>>(`/workout/user/${userId}`)
      setWorkouts(response.data.data.workouts);
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Failed to fetch workouts.")
    } finally {
      setLoading(false)
    }
  }

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <WorkoutCard
      workoutId={item.id}
      startTime={item.startTime}
      endTime={item.endTime}
      onPress={() => console.log('go to workout info page')}
    />
  )

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
        // onPress={() => router.push("/(auth)/add-workout")}
        style={styles.addButton}
        icon="plus"
      >
        Add Workout
      </Button>
    </SafeAreaView>
  )
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
  },
  listContainer: {
    padding: 16,
  },
  workoutCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 4,
    color: "#666",
  },
  divider: {
    marginVertical: 12,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  exerciseIcon: {
    marginRight: 8,
  },
  exerciseText: {
    flex: 1,
    color: "#666",
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
})

export default WorkoutsPage

