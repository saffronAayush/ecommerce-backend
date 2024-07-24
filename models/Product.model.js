import mongoose from "mongoose";

const porductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter product name"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Enter product discription"],
        },
        price: {
            type: Number,
            required: [true, "Enter product price"],
        },
        ratings: {
            type: Number,
            default: 0,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        category: {
            type: String,
            required: [true, "Enter product category"],
        },
        stock: {
            type: Number,
            required: true,
            maxLength: 4,
            default: 1,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                createdBY: {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                },
            },
        ],
        createdBY: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", porductSchema);
