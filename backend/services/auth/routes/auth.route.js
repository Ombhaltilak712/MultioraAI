import express from "express"
import { deductCredits, login, logOut, updateUserPayment, updateProfile, deleteAccount } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/login", login)
router.get("/logout", logOut)
router.post("/update-plan", updateUserPayment)
router.post("/deduct-credits", deductCredits)
router.post("/update-profile", updateProfile)
router.post("/delete-account", deleteAccount)

export default router