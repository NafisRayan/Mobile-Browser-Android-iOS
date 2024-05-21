// MyPage.js
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const MyPage = () => {
  const [searchInput, setSearchInput] = useState("");

  const searchFunction = () => {
    if (searchInput) {
      // Implement your search logic here
      console.log(`Searching for: ${searchInput}`);
      // For example, to open a web page in a browser, you might use a WebView or Linking
      // This example just logs the search input
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={setSearchInput}
      />
      <Button
        title="Search"
        onPress={searchFunction}
        style={styles.searchButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181818",
    padding: 20,
  },
  searchInput: {
    width: "70%",
    padding: 20,
    fontSize: 24,
    borderRadius: 5,
    backgroundColor: "#333",
    color: "#e8e8e8",
    marginBottom: 10,
  },
  searchButton: {
    padding: 20,
    fontSize: 24,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    color: "white",
  },
});

export default MyPage;
