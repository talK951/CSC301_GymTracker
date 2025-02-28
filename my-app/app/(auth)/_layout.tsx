import { Stack } from "expo-router";
import React from "react";
import ChatScreen from "../(home)/group_chat";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{headerShown: false }} />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="group_chat" options={{headerShown: false }}/>
    </Stack>
  );
};

export default AuthLayout;
