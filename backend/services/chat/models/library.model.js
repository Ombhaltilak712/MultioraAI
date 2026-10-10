import mongoose from "mongoose";

const libraryFileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    fileType: {
        type: String,
        enum: ["pdf", "ppt", "image", "document", "code"],
        default: "document"
    },
    mimeType: {
        type: String,
        default: "application/octet-stream"
    },
    fileUrl: {
        type: String,
        required: true
    },
    storageKey: {
        type: String,
        default: ""
    },
    size: {
        type: Number,
        default: 0
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    prompt: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const LibraryFile = mongoose.model("LibraryFile", libraryFileSchema);
export default LibraryFile;
