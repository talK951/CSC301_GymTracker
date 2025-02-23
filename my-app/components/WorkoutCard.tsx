import type React from "react"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { Card, Title, Text } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

interface WorkoutCardProps {
  workoutId: number
  startTime: string
  endTime: string
  onPress: () => void
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workoutId, startTime, endTime, onPress }) => {
  const startDate = new Date(startTime)
  const endDate = new Date(endTime)

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>Session {workoutId}</Title>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#6200EE" />
              <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={20} color="#6200EE" />
              <View style={styles.timeTextContainer}>
                <Text style={styles.timeLabel}>Start</Text>
                <Text style={styles.timeText}>
                  {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            </View>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={20} color="#6200EE" />
              <View style={styles.timeTextContainer}>
                <Text style={styles.timeLabel}>End</Text>
                <Text style={styles.timeText}>
                  {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeTextContainer: {
    marginLeft: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: "#666",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
})

export default WorkoutCard