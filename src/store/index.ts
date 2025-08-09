import { configureStore } from '@reduxjs/toolkit';
import conversationsReducer from './slices/conversationsSlice';
import messagesReducer from './slices/messagesSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    conversations: conversationsReducer,
    messages: messagesReducer,
    ui: uiReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 