import api from "../../utils/axios";

export const getLibraryFiles = async (params = {}) => {
  try {
    const { data } = await api.get("/api/chat/library", { params });
    return data;
  } catch (error) {
    console.error("Get library files error:", error);
    throw error;
  }
};

export const renameLibraryFile = async (id, name) => {
  try {
    const { data } = await api.patch(`/api/chat/library/${id}`, { name });
    return data;
  } catch (error) {
    console.error("Rename library file error:", error);
    throw error;
  }
};

export const deleteLibraryFile = async (id) => {
  try {
    const { data } = await api.delete(`/api/chat/library/${id}`);
    return data;
  } catch (error) {
    console.error("Delete library file error:", error);
    throw error;
  }
};
