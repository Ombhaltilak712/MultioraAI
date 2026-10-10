import { createSlice } from "@reduxjs/toolkit";

const sortConversations = (list) => {
  return [...list].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation: null
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = sortConversations(action.payload || []);
    },
    addConversation: (state, action) => {
      state.conversations = sortConversations([action.payload, ...state.conversations]);
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setConvTitle: (state, action) => {
      const { title, conversationId } = action.payload;
      state.conversations = state.conversations.map((conv) => (
        conv._id === conversationId ? { ...conv, title } : conv
      ));

      if (state.selectedConversation?._id === conversationId) {
        state.selectedConversation = { ...state.selectedConversation, title };
      }
    },
    removeConversation: (state, action) => {
      const id = action.payload;
      state.conversations = state.conversations.filter(c => c._id !== id);
      if (state.selectedConversation?._id === id) {
        state.selectedConversation = state.conversations[0] || null;
      }
    },
    togglePinState: (state, action) => {
      const id = action.payload;
      state.conversations = state.conversations.map(c => {
        if (c._id === id) {
          return { ...c, isPinned: !c.isPinned };
        }
        return c;
      });
      state.conversations = sortConversations(state.conversations);

      if (state.selectedConversation?._id === id) {
        state.selectedConversation = {
          ...state.selectedConversation,
          isPinned: !state.selectedConversation.isPinned
        };
      }
    }
  }
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  setConvTitle,
  removeConversation,
  togglePinState
} = conversationSlice.actions;

export default conversationSlice.reducer;
