import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
});
const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");

  const generateUserId = () => {
    // This is a simple example of generating a user ID.
    // In a real application, you would likely use a more secure method.
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setUserId(id);
  };

  const handleLogin = () => {
    // Implement login logic here
    Alert.alert("Login", `Logged in as ${name}`);
  };

  const handleRegistration = () => {
    // Implement registration logic here
    generateUserId();
    Alert.alert("Registration", `Registered with ID: ${userId}`);
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        onChangeText={setName}
        value={name}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={handleRegistration} />
    </View>
  );
};

export default Profile;
