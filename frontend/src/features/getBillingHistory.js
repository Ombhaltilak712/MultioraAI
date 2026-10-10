import api from "../../utils/axios";

export const getBillingHistory = async () => {
  try {
    const { data } = await api.get("/api/billing/history");
    return data;
  } catch (error) {
    console.error("Get billing history error:", error);
    throw error;
  }
};
