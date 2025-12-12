<div  align="center">
  <img src="./assets/icon_256x256.png"></img>
</div>

## 📥 Shabdiz Download Manager


A modern, cross-platform download manager built with Electron, React, and aria2c. This application provides a powerful and user-friendly interface for managing your downloads with advanced features powered by aria2c.

---

## 🎬 Demo


![demo](https://raw.githubusercontent.com/amiof/images/main/download-manager.gif)


---




## 🚀 Features

- **High-Speed Downloads**: Leverages aria2c for fast, multi-threaded downloading
- **Real-time Progress Tracking**: WebSocket integration with aria2c for live download statistics
- **Modern UI**: Built with React and Material-UI for a clean, responsive interface
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Download Management**: Pause, resume, and cancel downloads with ease
- **Persistent Storage**: SQLite database with TypeORM for storing download history
- **State Management**: Efficient state handling with Zustand
- **Multiple Downloads**: Handle multiple simultaneous downloads
- **Download Queue**: Organize and prioritize your downloads

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Component library
- **Vite** - Fast build tool and dev server
- **Zustand** - Lightweight state management
- **React Router** - Navigation
- **SCSS/Tailwind CSS** - Styling

### Backend (Electron)
- **Electron** - Cross-platform desktop framework
- **aria2c** - High-performance download engine
- **WebSocket (ws)** - Real-time communication with aria2c
- **TypeORM** - Database ORM
- **SQLite3** - Local database
- **electron-store** - Electron app configuration storage

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🐛 Known Issues

- aria2c binaries are included for Windows and macOS. Linux users need to install aria2c separately.

  
## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amiof/electron-project.git
   cd downloader
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install Electron dependencies**
   ```bash
   cd electron
   npm install
   cd ..
   ```

4. **Install React dependencies**
   ```bash
   cd react
   npm install
   cd ..
   ```

## 🚀 Development

### Run the application in development mode

```bash
npm start
```

This command will:
- Start the React development server (Vite)
- Start the Electron app in development mode
- Enable hot-reload for both frontend and backend

### Run React only
```bash
npm run start:react
```

### Run Electron only
```bash
npm run start:electron
```

## 🔨 Build

### Build for production

```bash
npm run build
```

This will build both the React app and Electron backend.

### Build React only
```bash
npm run build:react
```

### Build Electron only
```bash
npm run build:electron
```

## 📦 Package

Create distributable packages for different platforms:

### Package for all platforms
```bash
npm run package
```

### Package for Linux
```bash
npm run package:linux
```

### Package for Linux (RPM)
```bash
npm run package:linux:rpm
```

### Package for Windows
```bash
npm run package:win
```

The packaged applications will be in the `release` folder.

## 📁 Project Structure

```
downloader/
├── assets/                 # Application icons and images
├── build/                  # Build resources (icons)
├── electron/              # Electron main process
│   ├── src/
│   │   ├── aria2c.ts          # aria2c process management
│   │   ├── aria2Config.ts     # aria2c configuration
│   │   ├── main.ts            # Electron main entry point
│   │   ├── database/          # TypeORM database setup
│   │   │   └── entities/      # Database entities
│   │   ├── ipc/               # IPC handlers
│   │   │   ├── actions/       # Download actions
│   │   │   ├── download/      # Download management
│   │   │   ├── getData/       # Data retrieval
│   │   │   └── openPopup/     # Popup handling
│   │   ├── preload/           # Preload scripts
│   │   ├── release-aria2/     # aria2c binaries
│   │   │   └── bin/
│   │   │       ├── macOS/     # macOS aria2c binary
│   │   │       └── win/       # Windows aria2c binary
│   │   └── store/             # Electron store
│   └── package.json
├── react/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── addLinkPopup/
│   │   │   ├── buttonAction/
│   │   │   ├── header/
│   │   │   ├── main/
│   │   │   ├── sidebar/
│   │   │   ├── startDownload/
│   │   │   └── toolbar/
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Zustand stores
│   │   ├── assets/            # Images and icons
│   │   ├── App.tsx            # Main App component
│   │   └── main.tsx           # React entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔧 Configuration

### aria2c Configuration

The application uses aria2c for download management. Configuration can be found in:
- `electron/src/aria2Config.ts` - aria2c settings
- `electron/src/aria2c.ts` - aria2c process management

### Database

The application uses SQLite with TypeORM. Database entities are located in:
- `electron/src/database/entities/`

## 🌐 How It Works

1. **Electron Main Process**: Manages the application lifecycle and spawns the aria2c process
2. **aria2c**: Handles the actual downloading with support for multiple protocols (HTTP, HTTPS, FTP, etc.)
3. **WebSocket Connection**: Establishes a WebSocket connection to aria2c's JSON-RPC interface for real-time communication
4. **IPC Communication**: Electron's IPC handles communication between the main process and React renderer
5. **React Frontend**: Displays the UI and allows users to interact with downloads
6. **Database**: Stores download history and metadata persistently


## 🙏 Acknowledgments

- [aria2](https://aria2.github.io/) - The powerful download utility
- [Electron](https://www.electronjs.org/) - Build cross-platform desktop apps
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Material-UI](https://mui.com/) - React component library


## 📝 License

This project is licensed under the GPL v2 License.




