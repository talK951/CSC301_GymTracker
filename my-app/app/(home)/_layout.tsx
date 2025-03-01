import React from 'react';
import { Stack } from 'expo-router';

const HomeLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="nav_bar" options={{ headerShown: false }} />
      <Stack.Screen name="groups_page" options={{ headerShown: false }} />
    </Stack>
  );
};

export default HomeLayout;
