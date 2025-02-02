import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";

interface CustomButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, onPress, color = "#6200ee" }) => {
  return (
    <Button
      mode="contained"
      style={[styles.button, { backgroundColor: color }]}
      labelStyle={styles.buttonText}
      onPress={onPress}
    >
      {label}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default CustomButton;