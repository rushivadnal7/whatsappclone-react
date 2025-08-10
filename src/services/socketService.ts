import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { addMessage, updateConversation } from '../store/slices/messagesSlice';
import { addConversation } from '../store/slices/conversationsSlice';
import { SOCKET_URL } from '../constants';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token: string) {
    if (this.socket && this.isConnected) {
      return;
    }

    const socketUrl = SOCKET_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
      
      this.socket?.emit('authenticate', token);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('auth-error', (error: string) => {
      console.error('Socket authentication error:', error);
    });

    this.socket.on('new-message', (messageData: any) => {
      console.log('New message received:', messageData);
      store.dispatch(addMessage(messageData));
      
      store.dispatch(updateConversation({
        wa_id: messageData.wa_id,
        last_message: messageData.text,
        last_message_time: messageData.timestamp,
        unread_count: 1,
      }));
    });

    this.socket.on('message-received', (messageData: any) => {
      console.log('Message received notification:', messageData);
    });

    this.socket.on('user-online', (userData: any) => {
      console.log('User online:', userData);
    });

    this.socket.on('user-offline', (userData: any) => {
      console.log('User offline:', userData);
    });

    this.socket.on('user-typing', (typingData: any) => {
      console.log('User typing:', typingData);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinConversation(wa_id: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-conversation', wa_id);
    }
  }

  leaveConversation(wa_id: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-conversation', wa_id);
    }
  }

  sendMessage(messageData: {
    wa_id: string;
    to: string;
    text: string;
    contact_name: string;
  }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', messageData);
    }
  }

  startTyping(wa_id: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-start', wa_id);
    }
  }

  stopTyping(wa_id: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-stop', wa_id);
    }
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
export default socketService;
