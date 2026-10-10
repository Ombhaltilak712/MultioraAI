import api from "../../utils/axios";

export const shareConversation = async (conversationId, enable = true) => {
  try {
    const { data } = await api.post(`/api/chat/share/${conversationId}`, { enable });
    return data;
  } catch (error) {
    console.error("Share conversation error:", error);
    throw error;
  }
};

export const getSharedConversation = async (token) => {
  try {
    const { data } = await api.get(`/api/chat/public/share/${token}`);
    return data;
  } catch (error) {
    console.error("Get shared conversation error:", error);
    throw error;
  }
};
