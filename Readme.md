# Mobile Browser Application

This project is a mobile browser application developed using React Native, designed to provide users with a customized browsing experience on their mobile devices. The application incorporates various features to enhance user interaction and customization.

## Main Functionalities

1. **Web Content Display**: The core functionality of the application is to display web content within the app. This is achieved using the `WebViewComponent`, which is a React Native component that renders web content.

2. **URL Navigation**: Users can enter a URL or a search query in the provided text input field. The application supports both direct URL entry and search queries, which are automatically converted into a search URL.

3. **Navigation Controls**: The application provides navigation controls such as back, forward, reload, and stop. These controls allow users to navigate through their browsing history or refresh the current page.

4. **Bookmarks**: Users can bookmark pages for easy access later. The application allows adding and removing bookmarks, which are stored in the state.

5. **Browsing History**: The application keeps track of the browsing history, allowing users to view their previously visited pages.

6. **Profile Customization**: Users can customize their profile through the `Profile` component. This feature is accessible through the menu.

7. **Font Size Adjustment**: Users can increase or decrease the font size of the web content displayed in the WebView. This is done by injecting JavaScript into the WebView to adjust the `fontSize` style of the `body` element.

8. **Zoom Control**: The application supports pinch-to-zoom functionality for the WebView content. This is implemented using the `PanResponder` from React Native to detect pinch gestures and adjust the scale of the WebView content accordingly.

## Technologies Used

- **React Native**: The primary framework used for building the mobile application.
- **Expo**: A set of tools and services built around React Native to help in the development process.
- **React Native Vector Icons**: Used for displaying icons in the application.
- **React Native WebView**: A component for displaying web content within the app.

## Codebase Organization

The project is organized into several components and files, each responsible for a specific functionality or part of the UI. Key components include:

- `App.js`: The main entry point of the application, managing the state and rendering the UI.
- `WebViewComponent.js`: Component for displaying web content using WebView.
- `HistoryModal.js`: Component for displaying browsing history.
- `BookmarkModal.js`: Component for managing bookmarks.
- `Profile.js`: Component for displaying user profile information.
- `styles.js`: File containing styles for components.

## Getting Started

To get started with the project, clone the repository, install the dependencies and start:

```bash
git clone <repository-url>
cd <project-directory>
npm i
npm start
```

To run the application on an Android or iOS device, use the following commands:

```bash
# For Android
expo start --android

# For iOS
expo start --ios
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.
