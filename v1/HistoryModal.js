// HistoryModal.js
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } 
	from 'react-native';
import styles from './styles';
const HistoryModal = ({ history, histShow, setHistShow, setUrl }) => {
	return (
		<Modal animationType="slide"
			transparent={false} 
			visible={histShow}>
			<View style={styles.modalContainer}>
				{history.length === 0 ? (
					<Text style={styles.noHistoryText}>No History Present</Text>
				) : (
					<FlatList data={history}
							keyExtractor={(i, index) => index.toString()}
							renderItem={({ item }) => (
						<TouchableOpacity onPress={() => 
								setUrl(item)} style={styles.historyItem}>
								<Text>{item}</Text>
							</TouchableOpacity>)}/>)}
				<TouchableOpacity onPress={() => setHistShow(false)} style={styles.closeModalButton}>
					<Text style={styles.closeModalButtonText}>Close</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};
export default HistoryModal;
