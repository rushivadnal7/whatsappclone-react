import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Message {
  _id: string;
  wa_id: string;
  meta_msg_id: string;
  message_id: string;
  from: string;
  to: string;
  text: string;
  type: string;
  status: "sent" | "delivered" | "read";
  timestamp: string;
  conversation_id: string;
  contact_name: string;
  is_outgoing: boolean;
  created_at: string;
  updated_at: string;
}

interface Conversation {
  wa_id: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface MessagesState {
  messages: { [wa_id: string]: Message[] };
  loading: boolean;
  conversations: { [wa_id: string]: Conversation };
  error: string | null;
  hasMore: { [wa_id: string]: boolean };
}

const initialState: MessagesState = {
  messages: {},
  conversations: {},
  loading: false,
  error: null,
  hasMore: {},
};

// Async thunks
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ wa_id, page = 1 }: { wa_id: string; page?: number }) => {
    const response = await axios.get(
      `http://localhost:5000/api/messages/conversations/${wa_id}/messages`,
      {
        params: { page, limit: 50 },
      }
    );
    return {
      wa_id,
      messages: response.data.data,
      pagination: response.data.pagination,
    };
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({
    wa_id,
    text,
    contact_name,
  }: {
    wa_id: string;
    text: string;
    contact_name: string;
  }) => {
    const response = await axios.post(
      "http://localhost:5000/api/messages/send",
      {
        wa_id,
        text,
        contact_name,
      }
    );
    return response.data.data;
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const { wa_id } = action.payload;
      if (!state.messages[wa_id]) {
        state.messages[wa_id] = [];
      }
      state.messages[wa_id].push(action.payload);
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{
        meta_msg_id: string;
        status: string;
        wa_id: string;
      }>
    ) => {
      const { meta_msg_id, status, wa_id } = action.payload;
      if (state.messages[wa_id]) {
        const messageIndex = state.messages[wa_id].findIndex(
          (msg) => msg.meta_msg_id === meta_msg_id
        );
        if (messageIndex >= 0) {
          state.messages[wa_id][messageIndex].status = status as
            | "sent"
            | "delivered"
            | "read";
        }
      }
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
      delete state.hasMore[action.payload];
    },
    updateConversation: (
      state,
      action: PayloadAction<{
        wa_id: string;
        last_message: string;
        last_message_time: string;
        unread_count: number;
      }>
    ) => {
      const { wa_id, last_message, last_message_time, unread_count } =
        action.payload;
      state.conversations[wa_id] = {
        wa_id,
        last_message,
        last_message_time,
        unread_count,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { wa_id, messages, pagination } = action.payload;

        if (!state.messages[wa_id]) {
          state.messages[wa_id] = [];
        }

        if (pagination.current === 1) {
          state.messages[wa_id] = messages;
        } else {
          state.messages[wa_id] = [...messages, ...state.messages[wa_id]];
        }

        state.hasMore[wa_id] = pagination.hasMore;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch messages";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        const wa_id = message.wa_id;

        if (!state.messages[wa_id]) {
          state.messages[wa_id] = [];
        }

        state.messages[wa_id].push(message);
      });
  },
});

export const { addMessage, updateConversation, updateMessageStatus, clearMessages } =
  messagesSlice.actions;
export default messagesSlice.reducer;
