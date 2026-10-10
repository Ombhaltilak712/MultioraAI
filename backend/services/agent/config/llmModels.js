import dotenv from "dotenv"
dotenv.config()
import { ChatGroq } from "@langchain/groq"

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY
})

export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return groq;
        case "search":    
            return groq;
        case "coding": 
            return groq; 
        case "pdf":
            return groq;
        case "ppt":
            return groq;
        case "intent":
            return groq;
        case "router":
            return groq;
        case "image":
            return groq;
        case "imageAnalyzer":
            return groq;
        default:
            return groq;
    }
}
