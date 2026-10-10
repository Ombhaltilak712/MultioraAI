import api from "../../utils/axios";

export const togglePinConversation = async (conversationId) => {
  try {
    const { data } = await api.post(`/api/chat/pin-conversation/${conversationId}`);
    return data;
  } catch (error) {
    console.error("Toggle pin conversation error:", error);
    throw error;
  }
};
