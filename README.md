# StruMind - Structural Analysis Web Application

StruMind is a web-based structural analysis application inspired by StaadPro. It provides a comprehensive set of tools for structural engineers to model, analyze, and design structures.

## 🚀 Features

- **Project Management**: Create, manage, and organize structural projects
- **3D Structural Modeling**: Create and edit structural models with nodes, beams, plates, and more
- **Analysis Setup**: Configure load cases, load combinations, and analysis parameters
- **Analysis Engine**: Perform static, modal, and other types of structural analysis
- **Results Visualization**: View and interpret analysis results with interactive visualizations
- **Design Code Verification**: Check structural elements against various design codes
- **Project Settings**: Configure units, materials, and other project-specific settings

## 🔧 Technology Stack

### Frontend
- **React 18** - Modern React with improved rendering and concurrent features
- **Redux Toolkit** - State management with simplified Redux setup
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **Socket.io** - Real-time updates for analysis progress
- **D3.js & Recharts** - Powerful data visualization
- **React Router v6** - Declarative routing for React applications
- **React Hook Form** - Efficient form handling
- **Framer Motion** - Smooth UI animations

### Backend
- **Node.js** - JavaScript runtime for the server
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database for storing project data
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for authentication
- **Socket.io** - Real-time bidirectional event-based communication

## 📋 Prerequisites

- Node.js (v18.x or higher)
- MongoDB (local or remote)
- npm or yarn

## 🛠️ Installation

1. Install dependencies for both frontend and backend:
   ```bash
   npm run install-all
   ```

2. Set up environment variables:
   - Frontend `.env` file is already configured
   - Backend `.env` file in the `backend` directory is already configured

3. Start the development servers:
   ```bash
   npm run dev
   ```

   This will start both the frontend and backend servers concurrently.
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
strumind/
├── backend/             # Backend code
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # API controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   └── server.js        # Entry point
├── public/              # Static files
├── src/                 # Frontend code
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # Redux store
│   │   └── slices/      # Redux slices
│   ├── styles/          # CSS styles
│   └── utils/           # Utility functions
├── .env                 # Environment variables
└── vite.config.js       # Vite configuration
```

## 📱 Responsive Design

The application is built with responsive design using Tailwind CSS breakpoints, ensuring a great user experience on devices of all sizes.

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

This will create optimized builds for both frontend and backend.

## 🙏 Acknowledgments

- StaadPro for inspiration
- Built with modern web technologies
- Powered by React, Node.js, and MongoDB
- Styled with Tailwind CSS

Built with ❤️ for structural engineers
