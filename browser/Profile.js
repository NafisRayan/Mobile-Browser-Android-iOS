import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const Profile = () => {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [userId, setUserId] = useState('');

 const generateUserId = () => {
    // This is a simple example of generating a user ID.
    // In a real application, you would likely use a more secure method.
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setUserId(id);
 };

 const handleLogin = () => {
    // Implement login logic here
    Alert.alert('Login', `Logged in as ${name}`);
 };

 const handleRegistration = () => {
    // Implement registration logic here
    generateUserId();
    Alert.alert('Registration', `Registered with ID: ${userId}`);
 };

 return (
    <View>
      <TextInput
        placeholder="Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={handleRegistration} />
    </View>
 );
};

export default Profile;