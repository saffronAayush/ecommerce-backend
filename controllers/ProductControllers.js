import { Product } from "../models/Product.model.js";
import ErrorHandler from "../utills/ErrorHandler.js";
import CatchAsynError from "../middleware/AsyncError.js";
import ApiFeature from "../utills/ApiFeatures.js";
import cloudinary from "cloudinary";
import crypto from 'crypto';
// Admin only ---------------------
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: 142813777265362,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CreatProduct = CatchAsynError(async (req, res, next) => {
    
    try {
        console.log("Entering CreateProduct");

        // Log Cloudinary configuration for debugging
        console.log('Cloudinary Config:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key:142813777265362,
            api_secret: process.env.CLOUDINARY_API_SECRET ? 'exists' : 'not set',
        });

        // Parse images from request body
        let images = JSON.parse(req.body.images);
        console.log('Type of images:', typeof images);

        // Array to store image links
        const imageLinks = [];

        // Upload images to Cloudinary
        for (let image of images) {
            console.log('Uploading image:', image);

            const result = await cloudinary.v2.uploader.upload(image, {
                folder: 'products',
            });

            // Log the result of the upload for debugging
            console.log('Upload result:', result);

            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        // Update request body
        req.body.images = imageLinks;
        req.body.createdBY = req.user.id;

        console.log('Request body after processing:', req.body);

        // Create product in the database
        const product = await Product.create(req.body);

        // Send response
        res.status(201).json({ success: true, product });
    } catch (error) {
        console.error('Error creating product:', error);
        next(error);
    }
});
// get all products
const GetAllProducts = CatchAsynError(async (req, res, next) => {
    let productsCount = await Product.countDocuments();
    let resultPerPage = 8;
    let filteredProductsCount = 10;

    const apiFeature = new ApiFeature(Product.find(), req.query)
        .search()
        .filter();

    let products = await apiFeature.query;
    filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// get all products (ADMIN)
const GetAdminProducts = CatchAsynError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    });
});

// update products --- admin
const UpdateProduct = CatchAsynError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler(404, "product not found"));
    }
    let images = JSON.parse(req.body.images);
    console.log("old product ", product);

    //image
    if (images.length) {
        if (product.images && product.images.length > 0) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.uploader.destroy(product.images[i].public_id);
                console.log("delete image");
            }
        }

        const imageLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });
            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imageLinks;
    } else {
        req.body.images = product.images;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    console.log("new product ", product);
    res.status(200).json({
        success: true,
        message: "Product has been modified",
    });
});

//Deleting product -- admin
const DeleteProduct = CatchAsynError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler(500, "Product does not exist"));
    }
    //deleting images from cloudinary
    if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.uploader.destroy(product.images[i].public_id);
            console.log("delete image");
        }
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product has been deleted",
    });
});

// Get a product
const GetProduct = CatchAsynError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler(500, "Product does not exist"));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

//creating and updating rewive
const CreateReview = CatchAsynError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        createdBY: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.createdBY.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.createdBY.toString() === req.user._id.toString()) {
                (rev.rating = rating), (rev.comment = comment);
            }
        });
    } else {
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
    }

    let avg = product.reviews.reduce((acc, curr) => {
        return acc + curr.rating;
    }, 0);
    console.log(avg);
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Review submited",
        product,
    });
});

// Get all revies of a product
const GetReviews = CatchAsynError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete review
const DeleteReview = CatchAsynError(async (req, res, next) => {
    // Find the product by ID
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    // Filter out the review to be deleted
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    // Calculate the new average rating
    let avg = 0;
    reviews.forEach((rev) => (avg += rev.rating));

    let ratings = reviews.length === 0 ? 0 : avg / reviews.length;

    const numReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
        message: "Review has been deleted",
    });
});

// const SortProducts = CatchAsynError( async (req,res) => {
//   let products = await Product.find({}).sort({price: -1})
//   res.json(products);
// })

export {
    GetAllProducts,
    CreatProduct,
    UpdateProduct,
    DeleteProduct,
    GetProduct,
    CreateReview,
    GetReviews,
    DeleteReview,
    GetAdminProducts,
    // SortProducts,
};
