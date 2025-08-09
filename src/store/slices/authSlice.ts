import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  _id: string;
  username: string;
  email: string;
  profile: {
    name: string;
    avatar: string;
    status: string;
  };
  isOnline: boolean;
  lastSeen: string;
  wa_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
    const { user, token } = response.data.data;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    // Set default auth header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { user, token };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; email: string; password: string; name: string; wa_id: string }) => {
    const response = await axios.post('http://localhost:5000/api/auth/register', userData);
    const { user, token } = response.data.data;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    // Set default auth header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { user, token };
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async () => {
    const response = await axios.get('http://localhost:5000/api/auth/profile');
    return response.data.data;
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: { name?: string; status?: string; avatar?: string }) => {
    const response = await axios.put('http://localhost:5000/api/auth/profile', profileData);
    return response.data.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload}`;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get profile';
        // If profile fetch fails, user might be logged out
        if (action.error.message?.includes('401')) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError, setToken, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
