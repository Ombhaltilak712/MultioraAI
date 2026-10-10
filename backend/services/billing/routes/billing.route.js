import express from "express"
import { createOrder, verifyPayment, getBillingHistory } from "../controllers/billing.controller.js"
const router=express.Router()
router.post("/create",createOrder)
router.post("/verify",verifyPayment)
router.get("/history",getBillingHistory)

export default router