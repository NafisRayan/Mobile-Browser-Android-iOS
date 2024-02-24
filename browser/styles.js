import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', // Dark background
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    marginTop: height * 0.04,
    alignItems: 'center',
  },
  headerText: {
    fontSize: width * 0.08,
    color: 'black', // React Blue for the header
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: width * 0.05,
    color: '#CCCCCC', // Light grey for subheaders
    textAlign: 'center',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30,
  },
  textInput: {
    flex: 1,
    height: height * 0.06,
    borderColor: '#1DA1F2', // Darker border color
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 16,
    color: '#FFFFFF', // White text color
    fontSize: width * 0.04,
    backgroundColor: '#333333', // Dark background for text input
  },
  goButton: {
    backgroundColor: 'black', // React Blue for the Go button
    padding: width * 0.03,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  goButtonText: {
    color: '#1DA1F2',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333', // Dark background for toolbar
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  navigationButton: {
    backgroundColor: 'black', // React Blue for navigation button  black
    padding: width * 0.03,
    borderRadius: 10,
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
    backgroundColor: 'white',
    borderRadius: 15,
  },
  historyItem: {
    padding: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#505050',
  },

  closeModalButton: {
    backgroundColor: '#FF3B30',
    padding: width * 0.03,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  iconText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: width * 0.04,
  },
  noHistoryText: {
    fontSize: width * 0.06,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: height * 0.03,
  },

  home: {
    backgroundColor: 'black', // React Blue for reload button
    padding: width * 0.03,
    borderRadius: 10,
  },

  newTab: {
    backgroundColor: 'black', // React Blue for reload button
    padding: width * 0.03,
    borderRadius: 10,
  },
  closeTab: {
    backgroundColor: '#FF3B30',
    padding: width * 0.03,
    borderRadius: 10,
  },

  menu: {
    flexDirection: 'column', // Change from 'row' to 'column'
    justifyContent: 'flex-start', // Align from the top
    alignItems: 'flex-start', // Align from the left
    backgroundColor: 'black', // React Blue for menu background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuButton: {
    backgroundColor: 'black', // React Blue for the Go button
    padding: width * 0.03,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 10,
  },
  
fontButton: {
  backgroundColor: 'black',
  padding: width * 0.03,
  borderRadius: 100,
  height: 50,
  width: '100%',
  marginTop: 5,
},

clearButton: {
  backgroundColor: 'black',
  padding: width * 0.03,
  borderRadius: 100,
  height: 50,
  width: '100%',
  marginTop: 5,

},

historyButton: {
  backgroundColor: 'black',
  padding: width * 0.03,
  borderRadius: 100,
  height: 50,
  width: '100%',
  marginTop: 5,
  
},

bookmarks: {
  backgroundColor: 'black',
  padding: width * 0.03,
  borderRadius: 100,
  height: 50,
  width: '100%',
  marginTop: 5,
},

addbookmark: {
  backgroundColor: 'black',
  padding: width * 0.03,
  borderRadius: 100,
  height: 50,
  width: '100%',
  marginTop: 5,
},


reloadButton: {
  backgroundColor: 'black',
  padding: width * 0.03,
  borderRadius: 100,
  height: 50,
  width: '100%',
  marginTop: 5,
},

profile: {
  backgroundColor: 'black',
  padding: width * 0.03,
  borderRadius: 100,
  height: 50,
  width: '100%',
  marginTop: 5,
},

stopButton: {
  backgroundColor: 'black',
  padding: width * 0.03,
  borderRadius: 100,
  height: 50,
  width: '100%',
  marginTop: 5,
  marginBottom: 10
},
  iconText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: width * 0.04,
  },
});

export default styles;
