import React, { useEffect } from "react";
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import Routes from "./Routes";
import store from './store';
import { getProfile } from './store/slices/authSlice';
import { setTheme } from './store/slices/uiSlice';
import io from 'socket.io-client';
import { updateAnalysisProgress } from './store/slices/analysisSlice';

// Socket.io connection for real-time updates
const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

// Theme provider component
const ThemeProvider = ({ children }) => {
  const { theme } = useSelector(state => state.ui);
  
  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Apply theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
  
  return children;
};

// App wrapper with Redux
const AppWrapper = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getProfile());
    }
    
    // Listen for analysis progress updates
    socket.on('analysis-progress', (data) => {
      dispatch(updateAnalysisProgress(data.progress));
    });
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const theme = localStorage.getItem('theme');
      if (theme === 'system') {
        dispatch(setTheme('system'));
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      socket.off('analysis-progress');
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);
  
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;
