import React, { useState } from "react";
import { Button, View, Alert, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // import an icon set

const page = createBottomTabNavigator();

export default function navigateBar() {
    
    return (
        <page.Navigator>
            <page.Screen 
              name="Personal Page" 
              component={testScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
            }} />
            <page.Screen 
              name="Groups Page" 
              component={testScreen} options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="people" size={size} color={color} />
                ),
            }}/>
            <page.Screen 
              name="Create Group" 
              component={testScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="add" size={size} color={color} />
                ),
            }}/>
            <page.Screen 
            name="Discover Page" 
            component={testScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="search" size={size} color={color} />
              ),
            }}/>
            <page.Screen 
            name="Settings" 
            component={testScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings" size={size} color={color} />
              ),
            }}/>
        </page.Navigator>
    );
};

function testScreen() {
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