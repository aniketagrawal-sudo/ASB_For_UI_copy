# DeepThought React Keycloak Template

## Overview

DeepThought is a React-based frontend template designed for applications that require user authentication, app management, and AI-driven chat interactions. It features seamless Keycloak authentication and an intuitive UI for managing conversations and files.

## Features

- **Keycloak Authentication** – Seamless integration for secure user authentication and session management.
- **App Launcher** – Browse and access available products efficiently.
- **User Profile Menu** – Includes options for settings and logout functionality.
- **Navigation Bar** – Enables smooth movement between the Home and Conversation screens.
- **Previous Queries** – Displays the last four interactions on the Home Screen, with suggested questions before the conversation loads.
- **Smart Chat Input** – Allows users to enter queries and upload supported file types for context-aware responses.
- **Collapsible Sidebar** – Categorizes conversation history into Today, Yesterday, and Last 30 Days for easy access.
- **Conversation Item Menu** – Provides options to delete or manage individual conversations.
- **New Chat Button** – Quickly initiate a fresh conversation.
- **Conversation Screen** – Showcases both user and AI responses, including file attachments for a seamless chat experience.
- **File Management** – Enables users to upload, download, and access AI-generated files directly from the chat.
- **Conversation Selection** – Load conversations from the sidebar into the Conversation Screen.
- **WebSocket Integration** - Seamless WebSocket support added for real-time messaging, with secure connection, reconnection logic, and graceful cleanup on logout or unmount.
- **Business Content Panel** - Introduced a right-side panel to view PDFs and message related information directly within the app; non-PDF files are downloaded automatically.
- **ai agent Loading Feedback** - Added a loading spinner to chat items while awaiting ai agent responses, which persists even when switching conversations.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v22.12.0)

### Installation

1. Clone the repository:

   - Follow the setup instructions in this document:  
     👉 [Setup Guide](https://docs.google.com/document/d/1Mx8IhjOOxBp00PiaFinsNwwZ0Lyty37FvGGB6_h6YuM/edit?tab=t.0)

   - Review the initial release documentation:  
     👉 [Release Notes v1.0.0](https://docs.google.com/document/d/1o66KNJSI4JULriwRKW0fJ87mrevI8XFp/)

   - Review the second release documentation:  
     👉 [Release Notes v1.1.0](https://docs.google.com/document/d/1l1WtMsy-RFX8A8gXDWKvlzPCJZE3YWAuOjSlhATYj0E/edit?tab=t.0)

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory and configure the varaibles that works for both development and production

     | Environment Variable | Description               | Example Value                                         |
     | -------------------- | ------------------------- | ----------------------------------------------------- |
     | VITE_BASE_PATH       | Base URL for API requests | `/deepthought  (path should not have trailing slash)` |

   - Create a `.env.development` file in the root directory and configure dev Keycloak settings and also the actual end points

     | Environment Variable         | Description                                               | Example Value                                |
     | ---------------------------- | --------------------------------------------------------- | -------------------------------------------- |
     | REACT_APP_KEYCLOAK_REALM     | Keycloak realm name                                       | `your-realm`                                 |
     | REACT_APP_KEYCLOAK_URL       | Keycloak server URL                                       | `https://your-keycloak-server/auth`          |
     | REACT_APP_KEYCLOAK_CLIENT_ID | Keycloak client ID                                        | `your-client-id`                             |
     | VITE_API_BASE_URL            | Base URL for API requests                                 | `https://api.yourapp.com`                    |
     | VITE_ALLOWED_HOSTS           | Hosts to be allowed by vite(comma seperated domain names) | `ui.com,localhost`                           |
     | VITE_PLATFORM_API_BASE_URL   | Platform base url                                         | `https://deepthought-dev.tigeranalytics.com` |
     | VITE_WS_BASE_URL             | Websocket base url                                        | `https://api.yourapp.com`                    |

   - Create a `.env.development.local` file in the root directory and override the local api endpoints

     | Environment Variable | Description                         | Example Value           |
     | -------------------- | ----------------------------------- | ----------------------- |
     | VITE_API_BASE_URL    | Base URL for API requests           | `http://localhost:5000` |
     | VITE_WS_BASE_URL     | Base URL for WS connection requests | `http://localhost:5000` |

### Running the Application

Start the development server:

```sh
npm run dev
```

The app will be available at `http://localhost:3000/VITE_BASE_PATH`.

## Folder Structure

```my-app/
├── src/
│ ├── api/ # Global API configurations
│ │ ├── api.js # Base API setup
│ │ ├── authApi.js # Authentication API
│ │ ├── conversationApi.js # Conversation-related API
│ ├── assets/ # Static assets like images, icons, etc.
│ ├── components/ # Reusable UI components
│ │ ├── AppLauncher/
│ │ ├── ChatInput/
│ │ ├── ChatItem/
│ │ ├── ConversationScreen/
│ │ ├── Dialog/
│ │ ├── LoadingBubble/
│ │ ├── MessageBubble/
│ │ ├── PreviousQueries/
│ │ ├── RenderFiles/
│ │ ├── Sidebar/
│ │ ├── ErrorFallback.jsx
│ │ ├── ErrorMessage.jsx
│ │ ├── LinearLoader.jsx
│ │ ├── ProtectedRoute.jsx
│ ├── features/ # Feature-based organization
│ │ ├── auth/
│ │ │ ├── components/
│ │ │ │ ├── AuthProvider.jsx
│ │ │ │ ├── LoginPage.jsx
│ │ │ │ ├── LoginPage.module.scss
│ │ │ ├── hooks/ # Custom authentication hooks
│ │ │ ├── authSlice.js # Redux slice for auth state
│ ├── layouts/ # Layout components
│ │ ├── components/
│ │ │ ├── Appbar.jsx
│ │ │ ├── Appbar.module.scss
│ │ │ ├── AppLayout.jsx
│ │ │ ├── AppLayout.module.scss
│ ├── pages/ # Page-level components
│ │ ├── conversation/ # Conversation Page
│ │ │ ├── ConversationPage.jsx
│ │ ├── home/ # Home Page
│ │ │ ├── HomePage.jsx
│ ├── redux/ # Global state management
│ │ ├── slices/ # Redux slices
│ │ │ ├── authSlice.js
│ │ │ ├── conversationSlice.js # Redux slice for conversation
│ │ ├── store.js # Redux store configuration
│ ├── styles/ # Global styles
│ ├── utils/ # Helper functions and constants
│ │ ├── Socket/
│ │ │ ├── index.js         # Initializes and manages the socket connection
│ │ │ ├── SocketEvents.js  # Registers socket event listeners
│ │ │ ├── SocketActions.js # Contains functions to emit socket events
│ │ ├── config.js
│ │ ├── constants.js
│ │ ├── keycloak.js # Keycloak authentication config
│ │ ├── fileUtils.js # handle file related operations
│ ├── App.js
│ ├── main.jsx
│ ├── routes.jsx # Application routes
├── public/
├── nginx/ # Nginx configuration (if applicable)
├── .dockerignore
├── .env
├── .env.development
├── .env.development.local
├── .env.example
├── .gitignore
├── .prettierrc.json
├── .prettierignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js

```

**Note:** Customize the constants file according to your needs to ensure proper configuration.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve this template.

## Contact

For any inquiries, reach out via [Bhagavan Marpadaga](mailto:marpadaga.bhagav@tigeranalytics.com).

```

```
#   d e e p  
 