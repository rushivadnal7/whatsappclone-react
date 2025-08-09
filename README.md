# WhatsApp Clone Frontend

A React TypeScript frontend for the WhatsApp Web clone application.

## Features

- WhatsApp Web-like interface
- Real-time messaging with Socket.IO
- Responsive design for mobile and desktop
- Dark mode support
- Redux state management
- Framer Motion animations
- Message status indicators (sent, delivered, read)
- Conversation list with search
- Message input with auto-resize

## Tech Stack

- React 19
- TypeScript
- Redux Toolkit
- React Router DOM
- Framer Motion
- Tailwind CSS
- Lucide React Icons
- Socket.IO Client
- Axios
- Date-fns

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── Sidebar.tsx     # Conversation list sidebar
│   ├── ChatHeader.tsx  # Chat header with user info
│   ├── MessageBubble.tsx # Individual message component
│   ├── MessageInput.tsx # Message input with send button
│   └── ConversationItem.tsx # Conversation list item
├── pages/              # Page components
│   ├── HomePage.tsx    # Welcome page
│   └── ChatPage.tsx    # Chat interface
├── store/              # Redux store configuration
│   ├── index.ts        # Store setup
│   └── slices/         # Redux slices
│       ├── conversationsSlice.ts
│       ├── messagesSlice.ts
│       └── uiSlice.ts
└── lib/                # Utility functions
    └── utils.ts        # Common utilities
```

## Components

### Layout
The main layout component that wraps the entire application with the sidebar and main content area.

### Sidebar
Displays the list of conversations with search functionality and responsive behavior.

### ChatHeader
Shows the current conversation's contact information and action buttons.

### MessageBubble
Individual message component with proper styling for incoming/outgoing messages and status indicators.

### MessageInput
Input component for sending new messages with auto-resize and keyboard shortcuts.

## State Management

The application uses Redux Toolkit for state management with three main slices:

- **conversationsSlice**: Manages conversation list and selected conversation
- **messagesSlice**: Handles messages for each conversation
- **uiSlice**: Controls UI state like sidebar visibility and theme

## Routing

The application uses React Router with the following routes:

- `/`: Home page with welcome message
- `/chat/:wa_id`: Chat page for a specific conversation

## Styling

The application uses Tailwind CSS for styling with custom CSS for animations and scrollbars. The design closely mimics WhatsApp Web with:

- Green color scheme (#25d366)
- Proper message bubble styling
- Status indicators
- Responsive design
- Dark mode support

## Real-time Features

The frontend is prepared for real-time features using Socket.IO:

- Real-time message updates
- Status updates
- Online/offline indicators
- Typing indicators (can be implemented)

## Responsive Design

The application is fully responsive and works on:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

The sidebar automatically hides on mobile devices and can be toggled with a menu button.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

To start development:

1. Ensure the backend server is running on `http://localhost:5000`
2. Run `npm run dev` to start the frontend
3. Open `http://localhost:3000` in your browser

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.
