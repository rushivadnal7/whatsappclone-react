import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Conversation {
  _id: string;
  wa_id: string;
  contact_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_online: boolean;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

interface ConversationsState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConversationsState = {
  conversations: [],
  selectedConversation: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (filter: string = 'all') => {
    const response = await axios.get(`http://localhost:5000/api/messages/conversations?filter=${filter}`);
    return response.data.data;
  }
);

export const fetchConversation = createAsyncThunk(
  'conversations/fetchConversation',
  async (wa_id: string) => {
    const response = await axios.get(`http://localhost:5000/api/messages/conversations/${wa_id}`);
    return response.data.data;
  }
);

export const markConversationAsRead = createAsyncThunk(
  'conversations/markConversationAsRead',
  async (wa_id: string) => {
    await axios.put(`http://localhost:5000/api/messages/conversations/${wa_id}/read`);
    return wa_id;
  }
);

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setSelectedConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.selectedConversation = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      const existingIndex = state.conversations.findIndex(
        conv => conv.wa_id === action.payload.wa_id
      );
      if (existingIndex >= 0) {
        state.conversations[existingIndex] = action.payload;
      } else {
        state.conversations.unshift(action.payload);
      }
    },
    updateConversation: (state, action: PayloadAction<Partial<Conversation> & { wa_id: string }>) => {
      const index = state.conversations.findIndex(conv => conv.wa_id === action.payload.wa_id);
      if (index >= 0) {
        state.conversations[index] = { ...state.conversations[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.selectedConversation = action.payload;
      })
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const wa_id = action.payload;
        const conversation = state.conversations.find(conv => conv.wa_id === wa_id);
        if (conversation) {
          conversation.unread_count = 0;
        }
        if (state.selectedConversation?.wa_id === wa_id) {
          state.selectedConversation.unread_count = 0;
        }
      });
  },
});

export const { setSelectedConversation, addConversation, updateConversation } = conversationsSlice.actions;
export default conversationsSlice.reducer; 