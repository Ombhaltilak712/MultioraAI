import { getModel } from "../config/llmModels.js"
import { generatePpt } from "../utils/generatePpt.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"
import axios from "axios"
export const pptAgent=async (state) => {
    try {
        await checkAgentLimit(state.userId,"ppt")
        const llm=await getModel("ppt")
        const prompt=`You are a professional presentation designer.

Return ONLY valid JSON.

Format:

{
"title":"",
"subtitle":"",
"slides":[
{
"title":"",
"points":[
"",
"",
"",
""
]
}
]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:

${state.prompt}`

const res=await llm.invoke(prompt)
let raw = res.content.trim()
if (raw.startsWith("```json")) raw = raw.replace(/^```json/, "")
if (raw.startsWith("```")) raw = raw.replace(/^```/, "")
if (raw.endsWith("```")) raw = raw.replace(/```$/, "")
const data=JSON.parse(raw.trim())
await deductCredits(state.userId,"ppt")
const ppt=await generatePpt(data)
const buffer=await ppt.write({
    outputType:"nodebuffer"
})

const filename=`ppt-${Date.now()}.pptx`

await uploadToS3(filename,buffer,"application/vnd.openxmlformats-officedocument.presentationml.presentation")
const downloadUrl=await getFromS3(filename,24*60*60)

// Auto-save to Library
try {
    await axios.post(`${process.env.CHAT_SERVICE}/library`, {
        userId: state.userId,
        name: `${data.title || "Presentation"}.pptx`,
        fileType: "ppt",
        mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        fileUrl: downloadUrl,
        storageKey: filename,
        size: buffer.length,
        conversationId: state.conversationId,
        prompt: state.prompt
    })
} catch (libErr) {
    console.log("Error auto-saving PPT to library:", libErr.message)
}

return {
    ...state,
    aiResponse:`# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 10 minutes._`
}

    } catch (error) {
        console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate ppt"
        }
       

       
    }
}