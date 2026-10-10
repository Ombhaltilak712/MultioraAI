import crypto from "crypto"
import mongoose from "mongoose"
import Conversation from "../models/coversation.model.js"
import Message from "../models/message.model.js"
import LibraryFile from "../models/library.model.js"

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    if (!userId) {
      return res.status(401).json({ message: "User ID required" })
    }
    const conversation = await Conversation.create({
      userId: userId,
      title: "New Chat",
      isPinned: false
    })

    return res.status(200).json(conversation)
  } catch (error) {
    return res.status(500).json({ message: `create conversation error ${error}` })
  }
}

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    if (!userId) {
      return res.status(401).json({ message: "User ID required" })
    }
    const conversations = await Conversation.find({
      userId: userId
    }).sort({ isPinned: -1, updatedAt: -1 })

    return res.status(200).json(conversations)
  } catch (error) {
    return res.status(500).json({ message: `get conversation error ${error}` })
  }
}

export const updateConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    const { id, title } = req.body

    if (!id || !title || !title.trim()) {
      return res.status(400).json({ message: "Valid ID and title required" })
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId },
      { title: title.trim() },
      { new: true }
    )

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" })
    }

    return res.status(200).json(conversation)
  } catch (error) {
    return res.status(500).json({ message: `update conversation error ${error}` })
  }
}

export const deleteConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    const { id } = req.params

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid conversation ID" })
    }

    const conversation = await Conversation.findOne({ _id: id, userId })
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found or unauthorized" })
    }

    await Message.deleteMany({ conversationId: id })
    await Conversation.findByIdAndDelete(id)

    return res.status(200).json({ success: true, message: "Conversation deleted successfully", id })
  } catch (error) {
    return res.status(500).json({ message: `delete conversation error ${error}` })
  }
}

export const togglePinConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    const { id } = req.params

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid conversation ID" })
    }

    const conversation = await Conversation.findOne({ _id: id, userId })
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found or unauthorized" })
    }

    conversation.isPinned = !conversation.isPinned
    await conversation.save()

    return res.status(200).json(conversation)
  } catch (error) {
    return res.status(500).json({ message: `toggle pin error ${error}` })
  }
}

export const shareConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    const { id } = req.params
    const { enable } = req.body

    const conversation = await Conversation.findOne({ _id: id, userId })
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" })
    }

    if (enable) {
      if (!conversation.shareToken) {
        conversation.shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 16)
      }
      conversation.isShared = true
    } else {
      conversation.isShared = false
      conversation.shareToken = null
    }

    await conversation.save()
    return res.status(200).json({
      isShared: conversation.isShared,
      shareToken: conversation.shareToken
    })
  } catch (error) {
    return res.status(500).json({ message: `share conversation error ${error}` })
  }
}

export const getSharedConversation = async (req, res) => {
  try {
    const { token } = req.params
    if (!token) {
      return res.status(400).json({ message: "Share token required" })
    }

    const conversation = await Conversation.findOne({ shareToken: token, isShared: true })
    if (!conversation) {
      return res.status(404).json({ message: "Shared conversation not found or access disabled" })
    }

    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 })

    // Return sanitized data only (no user IDs or sensitive metadata)
    return res.status(200).json({
      title: conversation.title,
      createdAt: conversation.createdAt,
      messages: messages.map(m => ({
        _id: m._id,
        role: m.role,
        content: m.content,
        images: m.images || [],
        artifacts: m.artifacts || [],
        createdAt: m.createdAt
      }))
    })
  } catch (error) {
    return res.status(500).json({ message: `get shared conversation error ${error}` })
  }
}

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content, images, artifacts } = req.body
    const message = await Message.create({
      conversationId,
      content,
      role,
      images,
      artifacts
    })

    // Also update conversation's updatedAt
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() })

    return res.status(200).json(message)
  } catch (error) {
    return res.status(500).json({ message: `save message error ${error}` })
  }
}

export const getMessages = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.conversationId)) {
      return res.status(200).json([])
    }
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).sort({ createdAt: 1 })

    return res.status(200).json(messages)
  } catch (error) {
    return res.status(500).json({ message: `get messages error ${error}` })
  }
}

export const editMessage = async (req, res) => {
  try {
    const { messageId, newContent } = req.body
    if (!messageId || !newContent?.trim()) {
      return res.status(400).json({ message: "messageId and newContent required" })
    }

    const targetMessage = await Message.findById(messageId)
    if (!targetMessage) {
      return res.status(404).json({ message: "Message not found" })
    }

    // Delete all downstream messages in the same conversation created after this message
    await Message.deleteMany({
      conversationId: targetMessage.conversationId,
      createdAt: { $gt: targetMessage.createdAt }
    })

    // Update target message
    targetMessage.content = newContent.trim()
    await targetMessage.save()

    const remainingMessages = await Message.find({
      conversationId: targetMessage.conversationId
    }).sort({ createdAt: 1 })

    return res.status(200).json({
      success: true,
      updatedMessage: targetMessage,
      remainingMessages
    })
  } catch (error) {
    return res.status(500).json({ message: `edit message error ${error}` })
  }
}

// ==================== LIBRARY CONTROLLERS ====================

export const getLibraryFiles = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    if (!userId) {
      return res.status(401).json({ message: "User ID required" })
    }

    const { type, search } = req.query
    const query = { userId }

    if (type && type !== "all") {
      query.fileType = type
    }

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" }
    }

    const files = await LibraryFile.find(query).sort({ createdAt: -1 })
    return res.status(200).json(files)
  } catch (error) {
    return res.status(500).json({ message: `get library files error ${error}` })
  }
}

export const createLibraryFile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId
    if (!userId) {
      return res.status(401).json({ message: "User ID required" })
    }

    const { name, fileType, mimeType, fileUrl, storageKey, size, conversationId, prompt } = req.body
    const file = await LibraryFile.create({
      userId,
      name,
      fileType: fileType || "document",
      mimeType: mimeType || "application/octet-stream",
      fileUrl,
      storageKey: storageKey || "",
      size: size || 0,
      conversationId: conversationId || null,
      prompt: prompt || ""
    })

    return res.status(200).json(file)
  } catch (error) {
    return res.status(500).json({ message: `create library file error ${error}` })
  }
}

export const renameLibraryFile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    const { id } = req.params
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "New name required" })
    }

    const file = await LibraryFile.findOneAndUpdate(
      { _id: id, userId },
      { name: name.trim() },
      { new: true }
    )

    if (!file) {
      return res.status(404).json({ message: "Library file not found" })
    }

    return res.status(200).json(file)
  } catch (error) {
    return res.status(500).json({ message: `rename library file error ${error}` })
  }
}

export const deleteLibraryFile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"]
    const { id } = req.params

    const file = await LibraryFile.findOneAndDelete({ _id: id, userId })
    if (!file) {
      return res.status(404).json({ message: "Library file not found or unauthorized" })
    }

    return res.status(200).json({ success: true, message: "File removed from library", id })
  } catch (error) {
    return res.status(500).json({ message: `delete library file error ${error}` })
  }
}

export const deleteUserAllChatData = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId
    if (!userId) {
      return res.status(400).json({ message: "User ID required" })
    }

    const convos = await Conversation.find({ userId })
    const convoIds = convos.map(c => c._id)

    await Message.deleteMany({ conversationId: { $in: convoIds } })
    await Conversation.deleteMany({ userId })
    await LibraryFile.deleteMany({ userId })

    return res.status(200).json({ success: true, message: "All user chat data deleted" })
  } catch (error) {
    return res.status(500).json({ message: `delete user data error ${error}` })
  }
}
