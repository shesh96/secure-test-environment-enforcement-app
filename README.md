# Secure Test Environment Enforcement App

[ Live Demo](https://secure-test-environment-enforcement-seven.vercel.app/)

A robust, secure online examination platform designed to ensure assessment integrity through automated proctoring features. This application enforces fullscreen mode, detects tab switching, and logs all user activity to a backend server.

## Features

- **Fullscreen Enforcement**: The exam must be taken in fullscreen mode. Exiting fullscreen triggers a violation.
- **Violation Monitoring**: Detects and logs:
  - Tab switching (visibility change)
  - Window blur (focus loss)
  - Context menu attempts (right-click)
  - Copy/paste actions
- **Real-time Logging**: All events are captured locally and synced to the backend database.
- **Premium UI**: A clean, distraction-free interface built with Tailwind CSS.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **State Management**: React Hooks (useState, useEffect, useReducer)

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### Quick Start (Recommended)
You can run both client and server with a single command from the root directory.

1. Install dependencies for both:
   ```bash
   npm install
   npm run install-all
   ```
2. Start the app:
   ```bash
   npm start
   ```
   
   *Note: Ensure you have created the `.env` file in the `server` directory first (see below).*

### Manual Setup
If you prefer to run them separately:

### 1. Backend Setup
Navigate to the `server` directory:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/secure-exam
```

Start the server:
```bash
npm start
```

### 2. Frontend Setup
Navigate to the `client` directory:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```

## Usage
1. Open the frontend URL (default: `http://localhost:5173`).
2. Click **Start Exam** to enter the secure environment.
3. The application will request fullscreen access.
4. Attempting to switch tabs or exit fullscreen will increment the violation counter.
5. Upon completion, submit the exam to save the session logs.


