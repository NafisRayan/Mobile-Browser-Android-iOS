# React Native Browser

A simple mobile browser application built using React Native and Expo, featuring core browsing functionalities, privacy controls, and theme support.

## Features

*   **Web Browsing:** Core web browsing powered by `react-native-webview`.
*   **Tab Management:** Basic support for multiple tabs (conceptually managed, UI in `app/(tabs)/tabs.tsx`).
*   **Bookmarks:** Save and manage bookmarks (`app/(tabs)/bookmarks.tsx`).
*   **History:** View and clear browsing history (`app/(tabs)/history.tsx`).
*   **Downloads:** View downloaded files (management logic assumed, UI in `app/(tabs)/downloads.tsx`).
*   **Privacy Controls:**
    *   Incognito Mode
    *   Ad & Tracker Blocking (basic implementation)
    *   Cookie Control (basic implementation)
    *   HTTPS-Only Mode
    *   Script Blocking (basic implementation)
    *   Fingerprint Protection (basic implementation)
    *   Clear Browsing Data
*   **Theming:** Supports dynamic switching between Light and Dark themes. Toggle available in Privacy settings.

## Project Structure

```
.
├── app/                  # Expo Router file-based routing (screens)
│   ├── (tabs)/           # Screens within the main tab layout
│   │   ├── _layout.tsx   # Stack layout for tab screens
│   │   ├── index.tsx     # Main browser screen
│   │   ├── bookmarks.tsx # Bookmarks screen
│   │   ├── downloads.tsx # Downloads screen
│   │   ├── help.tsx      # Help & Feedback screen
│   │   ├── history.tsx   # History screen
│   │   ├── privacy.tsx   # Privacy & Settings screen (includes theme toggle)
│   │   └── tabs.tsx      # Tab overview screen
│   ├── _layout.tsx       # Root layout (providers, fonts, splash screen)
│   └── +not-found.tsx    # Not found screen
├── assets/               # Static assets (fonts, images)
├── components/           # Reusable UI components
│   └── browser/          # Browser-specific components
│       ├── ChromeAddressBar.tsx
│       ├── ChromeBottomBar.tsx
│       ├── ChromeMenu.tsx
│       ├── HomeScreen.tsx
│       ├── BrowserView.tsx   # WebView wrapper
│       ├── BookmarkItem.tsx
│       ├── ChromeTabPreview.tsx
│       └── TabPreview.tsx
├── context/              # React Context API providers
│   ├── BrowserContext.tsx  # Manages browser state (tabs, history, bookmarks, etc.)
│   ├── PrivacyContext.tsx  # Manages privacy settings
│   └── ThemeContext.tsx    # Manages light/dark theme state
├── hooks/                # Custom React hooks
│   ├── useFrameworkReady.ts
│   ├── useResponsiveSize.ts
│   └── useSafeArea.ts
├── styles/               # Styling and theme configuration
│   └── theme.ts          # Theme definitions (colors, typography, spacing) and common styles
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
    └── helpers.ts
```

## Key Components

*   **`BrowserView`**: Wraps `react-native-webview` and injects basic privacy scripts. Handles navigation state.
*   **`ChromeAddressBar`**: Displays the URL/search input field, loading indicator, security icon, and menu button.
*   **`ChromeBottomBar`**: Provides navigation controls (Home, Bookmarks, Search, Tabs, Refresh).
*   **`ChromeMenu`**: Modal menu providing access to various actions (New Tab, Incognito, History, Downloads, Settings, etc.).
*   **`HomeScreen`**: Displayed when no URL is active, showing a search bar and shortcuts.
*   **`ChromeTabPreview` / `TabPreview`**: Components for displaying tab previews in the tab switcher screen.
*   **`BookmarkItem`**: Renders a single bookmark entry.

## Contexts

*   **`BrowserContext`**: Centralizes state management for browser features like tabs, active tab, history, bookmarks, downloads, and navigation actions.
*   **`PrivacyContext`**: Manages the state of various privacy settings (Incognito, Ad Blocking, etc.) and provides functions to toggle them.
*   **`ThemeContext`**: Manages the current theme ('light' or 'dark'), persists the selection using AsyncStorage, and provides the `useTheme` hook for components to access theme state and styles.

## Styling

The application uses a custom theme system defined in `styles/theme.ts`. This file exports:
*   A `theme` object containing static definitions for colors (primary, neutral, semantic), typography, spacing, radius, and shadows.
*   Separate `light` and `dark` theme color palettes.
*   A `commonStyles` function that takes the current theme mode (`isDarkMode`) and returns dynamically generated styles (backgrounds, text colors, icon colors, button styles, input styles) based on the active theme.

Components use the `useTheme` hook from `context/ThemeContext.tsx` to get the current theme mode (`isDarkMode`) and apply styles from `commonStyles(isDarkMode)` accordingly.

## Setup and Running

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Application:**
    ```bash
    npx expo start
    ```
    Follow the instructions in the terminal to open the app on a simulator/emulator or scan the QR code with the Expo Go app on your device.

## Key Dependencies

*   Expo & Expo Router
*   React Native
*   React Native WebView
*   Lucide React Native (Icons)
*   @react-native-async-storage/async-storage (Theme persistence)
*   @expo-google-fonts/inter (Font)
