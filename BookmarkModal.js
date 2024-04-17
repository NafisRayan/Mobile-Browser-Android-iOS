import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import styles from './styles';

const BookmarkModal = ({ bookmarks, bookmarkShow, setBookmarkShow, setUrl, removeBookmark }) => {
  return (
    <Modal animationType="slide" transparent={false} visible={bookmarkShow}>
      <View style={styles.modalContainer}>
        {bookmarks.length === 0 ? (
          <Text style={styles.noHistoryText}>No Bookmarks Yet</Text>
        ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setUrl(item)} style={styles.historyItem}>
                <Text>{item}</Text>
                <TouchableOpacity onPress={() => removeBookmark(item)} style={styles.removeBookmarkButton}>
                  <Text style={styles.removeBookmarkText}>Remove</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
        <TouchableOpacity onPress={() => setBookmarkShow(false)} style={styles.closeModalButton}>
          <Text style={styles.closeModalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default BookmarkModal;
