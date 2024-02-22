// App.js
import React, { useState, useRef } from 'react';
import 
	{ View, Text, TextInput, TouchableOpacity, ActivityIndicator, Modal, Alert }
		from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PanResponder } from 'react-native';
import WebViewComponent from './WebViewComponent';
import HistoryModal from './HistoryModal';
import styles from './styles';

const App = () => {
	const [url, setUrl] = useState(
'https://ecosia.org/');
	const [menuVisible, setMenuVisible] = useState(false);
	const [prev, setPrev] = useState(false);
	const [next, setNext] = useState(false);
	const [input, setInput] = useState('');
	const webviewRef = useRef(null);
	const [loading, setLoading] = useState(true);
	const [history, setHistory] = useState([]);
	const [histShow, setHistShow] = useState(false);
	const [currscale, setCurrScale] = useState(1);
	const [zoom, setZoom] = useState(false);
	const panResponder = PanResponder.create({
		onMoveShouldSetPanResponder: (evt, gestureState) => {
			return gestureState.numberActiveTouches === 2;
		},
		onPanResponderGrant: () => {
			setZoom(true);
		},
		onPanResponderMove: (evt, gestureState) => {
			if (gestureState.numberActiveTouches === 2) {
				const distance = Math.sqrt(
					Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)
				);
				const newScale = (currscale + (distance - 20) / 1000).toFixed(2);
				if (newScale >= 1) {
					setCurrScale(newScale);
				}
			}
		},
		zoomFunction: () => {
			setZoom(false);
		},
	});
	const navStateFunction = (navState) => {
		setPrev(navState.canGoBack);
		setNext(navState.canGoForward);
		setHistory((prevHistory) => [navState.url, ...prevHistory]);
	};
	const prevFunction = () => {
		if (prev) {
			webviewRef.current.goBack();
		}
	};

	const nextFunction = () => {
		if (next) {
			webviewRef.current.goForward();
		}
	};

	const reloadFunction = () => {
		webviewRef.current.reload();
	};

	const stopFunction = () => {
		webviewRef.current.stopLoading();
	};

	const increaseFontSize = () => {
		webviewRef.current.injectJavaScript(`
	var style = document.body.style;
	style.fontSize = (parseFloat(style.fontSize) || 16) + 2 + 'px';
	`);
	};
	const decreaseFontSize = () => {
		webviewRef.current.injectJavaScript(`
	var style = document.body.style;
	style.fontSize = (parseFloat(style.fontSize) || 16) - 2 + 'px';
	`);
	};
	const urlVisitFunction = () => {
		const inputTrimmed = input.trim();
		if (inputTrimmed === '') {
			return;
		}
		if (/^(https?|ftp):\/\//i.test(inputTrimmed)) {
			setUrl(inputTrimmed);
		} else {
			if (inputTrimmed.match(/^(www\.)?[a-z0-9-]+(\.[a-z]{2,})+/)) {
				setUrl(`https://${inputTrimmed}`);
			} else {
				const searchQuery = 
`https://www.ecosia.org/search?method=index&q=${encodeURIComponent(inputTrimmed)}`;
				setUrl(searchQuery);
			}
		}
	};
	const histCleatFunction = () => {
		setHistory([]);
		Alert.alert('History Cleared', 'Your browsing history has been cleared.');
	};
	const loadHistFunction = () => {
		setHistShow(true);
	};
	return (
		<View style={styles.container}>
			{/* <View style={styles.header}>
				<Text style={styles.headerText}></Text>
			</View> */}
			<View style={styles.searchContainer}>
  <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
    <Icon name={menuVisible ? "times" : "bars"} size={20} color="black" />
  </TouchableOpacity>
  <TextInput style={styles.textInput}
    placeholder="Enter a URL or search query"
    onChangeText={(text) => setInput(text)}
  />
  <TouchableOpacity onPress={urlVisitFunction} style={styles.goButton}>
    <Text style={styles.goButtonText}>Go</Text>
  </TouchableOpacity>
			</View>

<View style={styles.menue}>

  {menuVisible && (
    <>
		<TouchableOpacity onPress={increaseFontSize} style={styles.fontButton}>
			<Icon name="font" size={18} color="black" />
			<Text style={styles.iconText}>+ Font</Text>
		</TouchableOpacity>
		<TouchableOpacity onPress={decreaseFontSize} style={styles.fontButton}>
			<Icon name="font" size={18} color="black" />
			<Text style={styles.iconText}>-Font</Text>
		</TouchableOpacity>
      <TouchableOpacity onPress={histCleatFunction} style={styles.clearButton}>
        <Icon name="trash" size={18} color="black" />
        <Text style={styles.iconText}>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={loadHistFunction} style={styles.historyButton}>
        <Icon name="history" size={18} color="black" />
        <Text style={styles.iconText}>History</Text>
      </TouchableOpacity>
	  
	  <TouchableOpacity onPress={reloadFunction} 
								style={styles.reloadButton}>
					<Icon name="refresh" size={18} color="black" />
					<Text style={styles.iconText}>Reload</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={stopFunction} 
								style={styles.stopButton}>
					<Icon name="stop" size={18} color="black" />
					<Text style={styles.iconText}>Stop</Text>
				</TouchableOpacity>
	  
    </>
  )}
  {/* <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
    <Icon name={menuVisible ? "times" : "bars"} size={20} color="black" />
    <Text style={styles.iconText}>{menuVisible ? "Close" : "Menu"}</Text>
  </TouchableOpacity> */}
</View>


			<WebViewComponent url={url}
							prev={prev}
							next={next}
							loading={loading}
							setLoading={setLoading}
							webviewRef={webviewRef}
							navStateFunction={navStateFunction}
							reloadFunction={reloadFunction}
							stopFunction={stopFunction}
							increaseFontSize={increaseFontSize}
							decreaseFontSize={decreaseFontSize}
							zoom={zoom}
							panResponder={panResponder}
							currscale={currscale}/>
			<HistoryModal history={history}
						histShow={histShow}
						setHistShow={setHistShow}
						setUrl={setUrl}/>

			<View style={styles.toolbar}>
				<TouchableOpacity onPress={prevFunction} 
								disabled={!prev} 
								style={styles.navigationButton}>
					<Icon name="arrow-left" size={18} color="black" />
					<Text style={styles.iconText}>Back</Text>
				</TouchableOpacity>
				
				<TouchableOpacity onPress={stopFunction} 
								style={styles.newTab}>
					<Icon name="plus" size={18} color="black" />
					<Text style={styles.iconText}>New Tab</Text>
				</TouchableOpacity>
		<TouchableOpacity onPress={stopFunction} 
						style={styles.closeTab}>
			<Icon name="close" size={18} color="black" />
			<Text style={styles.iconText}>Close Tab</Text>
		</TouchableOpacity>

				<TouchableOpacity onPress={nextFunction} 
								disabled={!next} 
								style={styles.navigationButton}>
					<Icon name="arrow-right" size={18} color="black" />
					<Text style={styles.iconText}>Forward</Text>
				</TouchableOpacity>
			</View>

		</View>
	);
};
export default App;
