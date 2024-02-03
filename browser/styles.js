import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1E1E1E',
		padding: 10,
	},
	header: {
		marginTop: height * 0.04,
		alignItems: 'center',
	},
	headerText: {
		fontSize: width * 0.07,
		color: '#FFFFFF',
	},
	subHeaderText: {
		fontSize: width * 0.04,
		color: '#A6A6A6',
		textAlign: 'center',
		marginBottom: 10,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	textInput: {
		flex: 1,
		height: height * 0.04,
		borderColor: '#505050',
		borderWidth: 1,
		marginRight: 10,
		paddingLeft: 10,
		color: '#FFFFFF',
	},
	goButton: {
		backgroundColor: '#007BFF',
		padding: width * 0.025,
		borderRadius: 5,
		alignItems: 'center',
		width: width * 0.12,
	},
	goButtonText: {
		color: '#FFFFFF',
	},
	toolbar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'rgba(43, 43, 43, 0.7)',
		padding: 1,
	},
	navigationButton: {
		backgroundColor: 'transparent',
		padding: width * 0.025,
		borderRadius: 5,
	},
	clearButton: {
		backgroundColor: 'transparent',
		padding: width * 0.025,
		borderRadius: 5,
	},
	historyButton: {
		backgroundColor: 'transparent',
		padding: width * 0.025,
		borderRadius: 5,
	},
	webviewContainer: {
		flex: 1,
		position: 'relative',
	},
	loadingOverlay: {
		...StyleSheet.absoluteFill,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		padding: width * 0.05,
		backgroundColor: '#1E1E1E',
	},
	historyItem: {
		padding: width * 0.025,
		borderBottomWidth: 1,
		borderBottomColor: '#505050',
	},
	closeModalButton: {
		backgroundColor: '#FF3B30',
		padding: width * 0.025,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
	},
	closeModalButtonText: {
		color: '#FFFFFF',
	},
	iconText: {
		color: '#FFFFFF',
		textAlign: 'center',
		fontSize: width * 0.035,
	},
	noHistoryText: {
		fontSize: width * 0.05,
		color: '#FFFFFF',
		textAlign: 'center',
		marginVertical: height * 0.03,
	},
	reloadButton: {
		backgroundColor: 'transparent',
		padding: width * 0.025,
		borderRadius: 5,
	},
	stopButton: {
		backgroundColor: 'transparent',
		padding: width * 0.025,
		borderRadius: 5,
	},
	fontButton: {
		backgroundColor: 'transparent',
		padding: width * 0.025,
		borderRadius: 5,
	},
});

export default styles;