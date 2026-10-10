import api from "../../utils/axios";

export const deleteConversation = async (conversationId) => {
  try {
    const { data } = await api.delete(`/api/chat/delete-conversation/${conversationId}`);
    return data;
  } catch (error) {
    console.error("Delete conversation error:", error);
    throw error;
  }
};
