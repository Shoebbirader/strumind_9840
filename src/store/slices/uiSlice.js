import { createSlice } from '@reduxjs/toolkit';

// UI slice for managing UI state
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem('theme') || 'system',
    sidebarOpen: true,
    rightPanelOpen: true,
    activeTab: 'properties',
    notifications: [],
    modalOpen: null,
    modalData: null,
    viewMode: 'grid',
    gridVisible: true,
    snapEnabled: true,
    viewportSettings: {
      showUndeformed: true,
      showDeformed: true,
      deformationScale: 10,
      showLabels: true,
      showAxes: true,
      transparency: 0
    }
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setRightPanelOpen: (state, action) => {
      state.rightPanelOpen = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.modalOpen = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.modalOpen = null;
      state.modalData = null;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    toggleGridVisibility: (state) => {
      state.gridVisible = !state.gridVisible;
    },
    setGridVisibility: (state, action) => {
      state.gridVisible = action.payload;
    },
    toggleSnapEnabled: (state) => {
      state.snapEnabled = !state.snapEnabled;
    },
    setSnapEnabled: (state, action) => {
      state.snapEnabled = action.payload;
    },
    updateViewportSettings: (state, action) => {
      state.viewportSettings = {
        ...state.viewportSettings,
        ...action.payload
      };
    },
    resetViewportSettings: (state) => {
      state.viewportSettings = {
        showUndeformed: true,
        showDeformed: true,
        deformationScale: 10,
        showLabels: true,
        showAxes: true,
        transparency: 0
      };
    }
  }
});

export const { 
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleRightPanel,
  setRightPanelOpen,
  setActiveTab,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setViewMode,
  toggleGridVisibility,
  setGridVisibility,
  toggleSnapEnabled,
  setSnapEnabled,
  updateViewportSettings,
  resetViewportSettings
} = uiSlice.actions;

export default uiSlice.reducer;