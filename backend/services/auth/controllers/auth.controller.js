import crypto from "crypto"
import mongoose from "mongoose"
import { getAuth } from "firebase-admin/auth"
import { app } from "../config/firebase.js"
import User from "../models/user.model.js"
import redis from "../../../shared/redis/redis.js"

export const login = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ message: "ID token is required" })
        }

        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
            firebaseUid: decoded.uid
        })

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name || decoded.email?.split("@")[0] || "User",
                email: decoded.email,
                avatar: decoded.picture
            })
        }

        const sessionId = crypto.randomUUID()
        await redis.set(`user-session-${user?._id}`,
            sessionId
            , "EX", 7 * 24 * 60 * 60)
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)

    } catch (error) {
        console.error("Login controller error:", error)
        return res.status(500).json({ message: `login error ${error.message || error}` })
    }
}


export const logOut = async (req, res) => {
    try {
        const sessionId = req.cookies?.session || req.headers.cookie?.match(/session=([^;]+)/)?.[1]
        if (sessionId) {
            await redis.del(`session-${sessionId}`)
        }

        res.clearCookie("session", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        return res.status(200).json({ message: "logout successfully" })
    } catch (error) {
        console.error("Logout controller error:", error)
        return res.status(500).json({ message: `logout error ${error.message || error}` })
    }
}


export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        user.plan = plan
        user.credits += credits
        user.totalCredits += credits
        user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        await user.save()

        const sessionId = await redis.get(`user-session-${user?._id}`)
        console.log("sessionId", sessionId)
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)

        return res.status(200).json({ success: true })

    } catch (error) {
        return res.status(500).json({ message: `update user payment error ${error}` })
    }
}


export const deductCredits = async (req, res) => {
    try {
        const { userId, agent } = req.body
        
        const COST = {

            chat: 1,

            search: 5,

            coding: 10,

            pdf: 10,

            ppt: 10,

            vision: 10

        };

        if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message:"Invalid user id"})
        }

        const user=await User.findById(userId)

        if(!user){
            return res.status(400).json({message:"user not found"})
        }

       const requiredCredits=COST[agent] || 1
        if(user.credits<requiredCredits){
         return res.status(400).json({message:"Not enough credits."})
        }
        user.credits-=requiredCredits
        await user.save()

       const sessionId = await redis.get(`user-session-${user?._id}`)
        console.log("sessionId", sessionId)
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)

        return res.status(200).json({ success: true ,credits:user.credits})
    } catch (error) {
 return res.status(500).json({ message: `deduct credits error ${error}` })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const sessionId = req.cookies?.session || req.headers.cookie?.match(/session=([^;]+)/)?.[1]
        let userId = req.headers["x-user-id"]
        if (!userId && sessionId) {
            const session = await redis.get(`session-${sessionId}`)
            if (session) {
                const parsed = JSON.parse(session)
                userId = parsed.userId
            }
        }
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { name, avatar } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (name && name.trim()) user.name = name.trim()
        if (avatar && avatar.trim()) user.avatar = avatar.trim()
        await user.save()

        const currentSessionId = (await redis.get(`user-session-${user._id}`)) || sessionId
        if (currentSessionId) {
            await redis.set(`session-${currentSessionId}`, JSON.stringify({
                userId: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt
            }), "EX", 7 * 24 * 60 * 60)
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `update profile error ${error.message || error}` })
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const sessionId = req.cookies?.session || req.headers.cookie?.match(/session=([^;]+)/)?.[1]
        let userId = req.headers["x-user-id"]
        if (!userId && sessionId) {
            const session = await redis.get(`session-${sessionId}`)
            if (session) {
                const parsed = JSON.parse(session)
                userId = parsed.userId
            }
        }
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        // Clean up chat data from chat service
        try {
            const chatServiceUrl = process.env.CHAT_SERVICE || "http://localhost:8002"
            await fetch(`${chatServiceUrl}/delete-user-data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            })
        } catch (chatErr) {
            console.error("Failed to wipe chat data during account deletion:", chatErr)
        }

        // Delete user record
        await User.findByIdAndDelete(userId)

        // Clear redis sessions
        const currentSessionId = await redis.get(`user-session-${userId}`)
        if (currentSessionId) {
            await redis.del(`session-${currentSessionId}`)
        }
        if (sessionId) {
            await redis.del(`session-${sessionId}`)
        }
        await redis.del(`user-session-${userId}`)

        res.clearCookie("session", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        return res.status(200).json({ success: true, message: "Account deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: `delete account error ${error.message || error}` })
    }
}