import CatchAsynError from "../middleware/AsyncError.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import Stripe from "stripe";
const stripe = new Stripe(sk_test_51PdCqSEMWt45P6mpv1jfN4ygZOk3GifUFQlxSKjWHlGEzDXHmqSruzLeVoBzLvUdOHGdx2s0rlQbX33b1TZTwRLu00iYGuOTzK);

export const ProcessPayment = CatchAsynError(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        automatic_payment_methods: { enabled: true },
    });
    console.log(myPayment.client_secret);
    res.status(200).json({
        client_secret: myPayment.client_secret,
    });
});

export const SendStripeApiKey = CatchAsynError(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY,
    });
});
