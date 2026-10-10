import { getModel } from "../config/llmModels.js"
import axios from "axios"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"
export const visionAgent=async (state) => {

    try {
        await checkAgentLimit(state.userId,"image")
         const llm=await getModel("image")
    const res=await llm.invoke(`
        You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:

- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}

        `)

const prompt=res.content.trim()

const imageUrl=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

const imageRes=await axios.get(imageUrl,{responseType:"arraybuffer"})
await deductCredits(state.userId,"vision")
const buffer=Buffer.from(imageRes.data)
const filename=`image-${Date.now()}.png`

await uploadToS3(filename,buffer,"image/png")
const downloadUrl=await getFromS3(filename,24*60)

// Auto-save to Library
try {
    await axios.post(`${process.env.CHAT_SERVICE}/library`, {
        userId: state.userId,
        name: `Generated-Image-${Date.now()}.png`,
        fileType: "image",
        mimeType: "image/png",
        fileUrl: downloadUrl,
        storageKey: filename,
        size: buffer.length,
        conversationId: state.conversationId,
        prompt: prompt || state.prompt
    })
} catch (libErr) {
    console.log("Error auto-saving image to library:", libErr.message)
}

return {
    ...state,
    images: [downloadUrl],
    aiResponse:`
![Generated Image](${downloadUrl})

**Prompt:** *${prompt}*

📥 [Download High-Res Image](${downloadUrl})

⏳ Link active for 24 hours.`
}
    } catch (error) {
       console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate image"
        }
    }
   


}