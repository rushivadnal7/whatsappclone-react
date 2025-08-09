import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  homeContent : 'chats' | 'account',
  loading: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  homeContent: 'chats',
  theme: 'light',
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleHomeContent: (state) => {
      state.homeContent = state.homeContent === 'chats' ? 'account' : 'chats';
    },
    setHomeContent : (state , action : PayloadAction<'chats' | 'account'>) => {
      state.homeContent = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { toggleSidebar, toggleHomeContent,setHomeContent, setSidebarOpen, toggleTheme, setTheme, setLoading } = uiSlice.actions;
export default uiSlice.reducer; 