import React from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const {width, height} = Dimensions.get("window");

export default function PersonalPage() {
  return (
    <LinearGradient colors={["#1A1A1A", "#333333"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Personal Page</Text>

          {/* Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Summary</Text>

            {/* Day */}
            <View style={styles.weekRow}>
              {["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                <View key={index} style={styles.dayColumn}>
                  <Text style={styles.dayText}>{day}</Text>
                </View>
              ))}
            </View>


            {/* week */}
            {Array.from({ length: 3 }).map((_, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <View key={dayIndex} style={styles.dayColumn}>
                    <View style={[styles.square, getBoxColor(weekIndex, dayIndex)]} />
                  </View>
                ))}
              </View>
            ))}
          </View>


          {/* Gym Progress Graph */}
          <View style={styles.graphSection}>
            <Text style={styles.sectionTitle}>🏋️‍♂️ Bench Press Progress</Text>
            <View style={styles.graphContainer}>
              <View style={styles.graphLine} />

              {/* Graph Data Points */}
              {graphData.map((data, index) => (
                <View
                  key={index}
                  style={[
                    styles.graphDot,
                    { left: `${data.x}%`, bottom: `${data.y}%` },
                  ]}
                >
                  <Text style={styles.graphLabel}>{data.weight}</Text>
                </View>
              ))}
            </View>
          </View>


          {/* Consistency */}
          <View style={styles.consistencySection}>
            <Text style={styles.sectionTitle}>📅 Consistency</Text>
            <Text style={styles.consistencyHeader}>This month you..</Text>
            {consistencyData.map((item, index) => (
              <Text key={index} style={styles.consistencyItem}>• {item}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// Sample Graph Data (X = Time Progression, Y = Weight Lifted)
const graphData = [
  { x: 10, y: 20, weight: "185" },
  { x: 30, y: 35, weight: "195" },
  { x: 50, y: 50, weight: "200" },
  { x: 70, y: 60, weight: "205" },
  { x: 90, y: 70, weight: "215" },
];

// Sample Consistency Data
const consistencyData = [
  "Went to the gym 10 times",
  "Hit 1 PR",
  "Tutored 3 times",
  "Completed 8 cardio sessions",
];

//  assign colors for daily summary
const getBoxColor = (weekIndex: number, dayIndex: number) => {
  const colors = [
    ["red", "red", "yellow", "red", "purple", "red", "white"],
    ["white", "red", "red", "yellow", "red", "red", "white"],
    ["red", "purple", "red", "white", "red", "yellow", "red"],
  ];
  return { backgroundColor: colors[weekIndex][dayIndex] };
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1, 
    alignItems: "center",
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center", 
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "80%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFF",
  },
  section: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  dayColumn: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  square: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#333",
    marginVertical: 2,
  },

  // Graph Section
  graphSection: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    height: 250,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  graphContainer: {
    position: "relative",
    width: "100%",
    height: "80%",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 10,
  },
  graphLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: "red",
  },
  graphDot: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: "purple",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  graphLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    position: "absolute",
    top: -15,
  },

  // Consistency Section
  consistencySection: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  consistencyHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  consistencyItem: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
});