import api from "../../utils/axios";

export const updateProfile = async (payload) => {
  try {
    const { data } = await api.post("/api/auth/update-profile", payload);
    return data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const { data } = await api.post("/api/auth/delete-account");
    return data;
  } catch (error) {
    console.error("Delete account error:", error);
    throw error;
  }
};
