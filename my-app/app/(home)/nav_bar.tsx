import React, { useState } from "react";
import { Button, View, Alert, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // import an icon set
import PersonalPage from "./personal_page";
import SettingsPage from "./settings_page";
import DiscoverPage from "./discover-page";
import WorkoutsPage from "./workouts-page";
import GroupsPage from "./groups_page";

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
        name="Create Group" 
        component={TestScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={size} color={color} />
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

function TestScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="This screen is what the navigation bar is currently switched to" onPress={() => Alert.alert('Button Pressed!')} />
    </View>
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