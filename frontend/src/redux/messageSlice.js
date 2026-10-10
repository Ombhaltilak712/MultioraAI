import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    artifacts: [],
    isLoading: false
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setArtifacts: (state, action) => {
      state.artifacts = action.payload || [];
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    truncateMessagesFrom: (state, action) => {
      // payload: { index, newContent }
      const { index, newContent } = action.payload;
      if (index >= 0 && index < state.messages.length) {
        state.messages = state.messages.slice(0, index + 1);
        state.messages[index].content = newContent;
      }
    }
  }
});

export const { setMessages, addMessage, setArtifacts, setIsLoading, truncateMessagesFrom } = messageSlice.actions;
export default messageSlice.reducer;
