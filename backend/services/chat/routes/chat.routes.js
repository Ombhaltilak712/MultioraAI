import express from "express"
import {
  createConversation,
  getConversations,
  getMessages,
  saveMessage,
  updateConversation,
  deleteConversation,
  togglePinConversation,
  shareConversation,
  getSharedConversation,
  editMessage,
  getLibraryFiles,
  createLibraryFile,
  renameLibraryFile,
  deleteLibraryFile,
  deleteUserAllChatData
} from "../controllers/chat.controller.js"

const router = express.Router()

// Conversation routes
router.get("/create-conversation", createConversation)
router.get("/get-conversations", getConversations)
router.post("/update-conversation", updateConversation)
router.delete("/delete-conversation/:id", deleteConversation)
router.post("/pin-conversation/:id", togglePinConversation)

// Sharing routes
router.post("/share/:id", shareConversation)
router.get("/share/:token", getSharedConversation)

// Message routes
router.post("/save-message", saveMessage)
router.get("/get-messages/:conversationId", getMessages)
router.post("/edit-message", editMessage)

// Library routes
router.get("/library", getLibraryFiles)
router.post("/library", createLibraryFile)
router.patch("/library/:id", renameLibraryFile)
router.delete("/library/:id", deleteLibraryFile)

// Internal / user data cleanup
router.post("/delete-user-data", deleteUserAllChatData)

export default router