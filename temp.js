// App.js
import React, { useState, useRef } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { PanResponder } from "react-native";
import WebViewComponent from "./WebViewComponent";
import HistoryModal from "./HistoryModal";
import BookmarkModal from "./BookmarkModal";
import styles from "./styles";
import { AsyncStorage } from "react-native";
import MyPage from "./MyPage";

const App = () => {
  const [showMyPage, setShowMyPage] = useState(true);
  const [url, setUrl] = useState("https://google.com/"); // State for the WebView URL
  const [menuVisible, setMenuVisible] = useState(false);
  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(false);
  const [input, setInput] = useState("");
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [histShow, setHistShow] = useState(false);
  const [currscale, setCurrScale] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [bookmarkShow, setBookmarkShow] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  // Function to toggle between MyPage and WebView
  const togglePage = () => {
    setShowMyPage(!showMyPage);
  };

  // Updated addBookmark function
  const addBookmark = (url) => {
    setBookmarks((prevBookmarks) => [...prevBookmarks, url]);
  };

  const removeBookmark = (url) => {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.filter((bookmark) => bookmark !== url)
    );
  };

  const [tabs, setTabs] = useState([
    { id: 1, url: "https://google.com" }, // Initial tab
  ]);
  const [activeTab, setActiveTab] = useState(1);

  const addTab = () => {
    const newTabId = tabs.length + 1;
    const newTabs = [...tabs, { id: newTabId, url: "" }]; // Adding a new tab with an empty URL
    setTabs(newTabs);
    setActiveTab(newTabId); // Set the new tab as the active tab
  };

  const removeTab = (tabId) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(updatedTabs);

    if (activeTab === tabId) {
      // If the closed tab was active, switch to the last tab
      setActiveTab(updatedTabs[updatedTabs.length - 1].id);
    }
  };

  const switchTab = (tabId) => {
    setActiveTab(tabId);
  };

  const updateTabUrl = (tabId, newUrl) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, url: newUrl } : tab
    );
    setTabs(updatedTabs);
  };

  const openInActiveTab = () => {
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeTabUrl = tabs[activeTabIndex].url;
    if (activeTabUrl !== url) {
      updateTabUrl(activeTab, url);
    }
  };

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
    if (inputTrimmed === "") {
      return;
    }
    if (/^(https?|ftp):\/\//i.test(inputTrimmed)) {
      setUrl(inputTrimmed);
    } else {
      if (inputTrimmed.match(/^(www\.)?[a-z0-9-]+(\.[a-z]{2,})+/)) {
        setUrl(`https://${inputTrimmed}`);
      } else {
        const searchQuery = `https://www.google.com/search?method=index&q=${encodeURIComponent(
          inputTrimmed
        )}`;
        setUrl(searchQuery);
      }
    }
  };
  const histCleatFunction = () => {
    setHistory([]);
    Alert.alert("History Cleared", "Your browsing history has been cleared.");
  };
  const loadHistFunction = () => {
    setHistShow(true);
  };

  const loadBookmarkFunction = () => {
    setBookmarkShow(true); // This will show the bookmark modal when the "Bookmarks" button is tapped
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
				<Text style={styles.headerText}></Text>
			</View> */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.menuButton}
        >
          <Icon
            name={menuVisible ? "times" : "bars"}
            size={20}
            color="#1DA1F2"
          />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
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
            <TouchableOpacity
              onPress={loadBookmarkFunction}
              style={styles.profile}
            >
              <Icon name="user-circle-o" size={18} color="#1DA1F2" />
              <Text style={styles.iconText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={increaseFontSize}
              style={styles.fontButton}
            >
              <Icon name="font" size={18} color="#1DA1F2" />
              <Text style={styles.iconText}>+ Font</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={decreaseFontSize}
              style={styles.fontButton}
            >
              <Icon name="font" size={18} color="#1DA1F2" />
              <Text style={styles.iconText}>-Font</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={histCleatFunction}
              style={styles.clearButton}
            >
              <Icon name="trash" size={18} color="#1DA1F2" />
              <Text style={styles.iconText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={loadHistFunction}
              style={styles.historyButton}
            >
              <Icon name="history" size={18} color="#1DA1F2" />
              <Text style={styles.iconText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={loadBookmarkFunction}
              style={styles.bookmarks}
            >
              <Icon name="bookmark" size={18} color="#1DA1F2" />
              <Text style={styles.iconText}>Bookmarks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => addBookmark(url)}
              style={styles.bookmarks}
            >
              <Icon name="tag" size={18} color="#1DA1F2" />
              <Text style={styles.iconText}>Add Bookmark</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={stopFunction} style={styles.stopButton}>
              <Icon name="stop" size={18} color="#1DA1F2" />
              <Text style={styles.iconText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={{ flex: 1 }}>
        {showMyPage ? (
          <MyPage />
        ) : (
          <WebViewComponent url={url} /> // Assuming WebViewComponent accepts a url prop
        )}
        {/* Add a button or some UI element to toggle between MyPage and WebView */}
        <Button title="Toggle Page" onPress={togglePage} />
      </View>

      <WebViewComponent
        url={url}
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
        currscale={currscale}
      />
      <HistoryModal
        history={history}
        histShow={histShow}
        setHistShow={setHistShow}
        setUrl={setUrl}
      />
      <BookmarkModal
        bookmarks={bookmarks}
        bookmarkShow={bookmarkShow}
        setBookmarkShow={setBookmarkShow}
        setUrl={setUrl}
        removeBookmark={removeBookmark} // Make sure to pass the removeBookmark function as a prop
      />

      {/* <View>
{tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => switchTab(tab.id)}
            style={tab.id === activeTab ? styles.newTab : styles.newTab}>
            <Text>{tab.url || 'New Tab'}</Text>
            <Icon
              name="close"
              size={18}
              color="#1DA1F2"
              onPress={() => removeTab(tab.id)}
            />
          </TouchableOpacity>
        ))}
</View> */}

      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={prevFunction}
          disabled={!prev}
          style={styles.navigationButton}
        >
          <Icon name="arrow-left" size={18} color="#1DA1F2" />
          <Text style={styles.iconText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUrl("https://google.com")}
          style={styles.home}
        >
          <Icon name="home" size={18} color="#1DA1F2" />
          <Text style={styles.iconText}>Home</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={addTab} 
								style={styles.newTab}>
					<Icon name="window-restore" size={18} color="#1DA1F2" />
					<Text style={styles.iconText}>New Tab</Text>
				</TouchableOpacity> */}

        {/* <TouchableOpacity onPress={stopFunction} 
								style={styles.closeTab}>
					<Icon name="close" size={18} color="#1DA1F2" />
					<Text style={styles.iconText}>Close Tab</Text>
				</TouchableOpacity> */}

        <TouchableOpacity onPress={reloadFunction} style={styles.reloadButton}>
          <Icon name="refresh" size={18} color="#1DA1F2" />
          <Text style={styles.iconText}>Reload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextFunction}
          disabled={!next}
          style={styles.navigationButton}
        >
          <Icon name="arrow-right" size={18} color="#1DA1F2" />
          <Text style={styles.iconText}>Forward</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default App;
