import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="tabs" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="bookmarks" />
      <Stack.Screen name="history" />
      <Stack.Screen name="downloads" />
      <Stack.Screen name="help" />
    </Stack>
  );
}