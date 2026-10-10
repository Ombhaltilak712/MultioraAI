import api from "../../utils/axios"

export const getConversations=async () => {
    try {
        const {data}=await api.get("/api/chat/get-conversations")
        return data
    } catch (error) {
        if (error.response?.status !== 401 && error.response?.status !== 400) {
            console.error("getConversations error:", error)
        }
        return []
    }
}