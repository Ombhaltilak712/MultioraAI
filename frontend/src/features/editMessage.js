import api from "../../utils/axios";

export const editMessage = async (messageId, newContent) => {
  try {
    const { data } = await api.post("/api/chat/edit-message", {
      messageId,
      newContent
    });
    return data;
  } catch (error) {
    console.error("Edit message error:", error);
    throw error;
  }
};
