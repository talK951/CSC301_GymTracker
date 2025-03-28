import React from "react";
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PersonalPage from "./personal-page";
import SettingsPage from "./settings-page";
import DiscoverPage from "./discover-page";
import WorkoutsPage from "./workouts-page";
import GroupsPage from "./groups-page";

const page = createBottomTabNavigator();

export default function navigateBar() {
    
  return (
    <page.Navigator>
      <page.Screen 
        name="Personal Page" 
        component={PersonalPage} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        headerShown: false
      }} />
      <page.Screen 
        name="Workouts Page" 
        component={WorkoutsPage} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
        headerShown: false
      }} />
      <page.Screen 
        name="Groups Page" 
        component={GroupsPage} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        headerShown: false
      }}/>
      <page.Screen 
      name="Discover Page" 
      component={DiscoverPage} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="search" size={size} color={color} />
        ),
        headerShown: false
      }}/>
      <page.Screen 
      name="Settings" 
      component={SettingsPage} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings" size={size} color={color} />
        ),
        headerShown: false
      }}/>
    </page.Navigator>
  );
};

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