import express from "express";
import {
    GetAllProducts,
    CreatProduct,
    UpdateProduct,
    DeleteProduct,
    GetProduct,
    CreateReview,
    GetReviews,
    DeleteReview,
    GetAdminProducts,
} from "../controllers/ProductControllers.js";

import { isAuthenticatedUser, AuthorizeRoles } from "../middleware/Auth.js";
const router = express.Router();

router.route("/products").get(GetAllProducts);
// router.route('/products/sort').get(SortProducts)
router
    .route("/admin/products")
    .get(isAuthenticatedUser, AuthorizeRoles("admin"), GetAdminProducts);
router
    .route("/admin/products/new")
    .post(isAuthenticatedUser, AuthorizeRoles("admin"), CreatProduct);
router
    .route("/admin/products/:id")
    .put(isAuthenticatedUser, AuthorizeRoles("admin"), UpdateProduct)
    .delete(isAuthenticatedUser, AuthorizeRoles("admin"), DeleteProduct);

router.route("/product/:id").get(GetProduct);
router.route("/review").put(isAuthenticatedUser, CreateReview);
router
    .route("/reviews")
    .get(GetReviews)
    .delete(isAuthenticatedUser, DeleteReview);

export default router;
