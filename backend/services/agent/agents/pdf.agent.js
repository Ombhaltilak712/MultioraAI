import { getModel } from "../config/llmModels.js"
import { generatePdf } from "../utils/generatePdf.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"
import axios from "axios"
export const pdfAgent=async (state) => {
    try {
        const rate=await checkAgentLimit(state.userId,"pdf")
        
        
        const llm=await getModel("pdf")
        const prompt=`
        You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Structure:

{
"title":"",
"subtitle":"",
"sections":[
{
"heading":"",
"points":[]
}
]
}

Generate 4-8 sections.

Each section should have 3-6 concise bullet points.

Topic:

${state.prompt}
        `

        const res=await llm.invoke(prompt)
        let raw = res.content.trim()
        if (raw.startsWith("```json")) raw = raw.replace(/^```json/, "")
        if (raw.startsWith("```")) raw = raw.replace(/^```/, "")
        if (raw.endsWith("```")) raw = raw.replace(/```$/, "")
        const data=JSON.parse(raw.trim())
        await deductCredits(state.userId,"pdf")
        
        const pdfBuffer=await generatePdf(data)

        const filename=`pdf-${Date.now()}.pdf`
        await uploadToS3(filename,pdfBuffer,"application/pdf")

        const downloadUrl=await getFromS3(filename,24*60)

        // Auto-save to Library
        try {
            await axios.post(`${process.env.CHAT_SERVICE}/library`, {
                userId: state.userId,
                name: `${data.title || "Document"}.pdf`,
                fileType: "pdf",
                mimeType: "application/pdf",
                fileUrl: downloadUrl,
                storageKey: filename,
                size: pdfBuffer.length,
                conversationId: state.conversationId,
                prompt: state.prompt
            })
        } catch (libErr) {
            console.log("Error auto-saving PDF to library:", libErr.message)
        }

        return {
          ...state,
          aiResponse:`# PDF Generated

**${data.title}**

📥 [Download PDF](${downloadUrl})

_Link expires in 10 minutes._`
        }

    } catch (error) {
       console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate pdf"
        }
    }
}