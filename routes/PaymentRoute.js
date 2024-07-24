import express from "express";
import { isAuthenticatedUser } from "../middleware/Auth.js";
import {
    ProcessPayment,
    SendStripeApiKey,
} from "../controllers/PaymentControler.js";

const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, ProcessPayment);
router.route("/stripeapikey").get(SendStripeApiKey);
export default router;
