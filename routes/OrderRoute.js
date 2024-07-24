import express from "express";
import {
    DeleteOrder,
    GetAllOrder,
    GetSingleOrder,
    MyOrders,
    NewOrder,
    UpdateOrderStatus,
} from "../controllers/OrderControler.js";
import { AuthorizeRoles, isAuthenticatedUser } from "../middleware/Auth.js";

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, NewOrder);
router.route("/order/me").get(isAuthenticatedUser, MyOrders);
router.route("/order/:id").get(isAuthenticatedUser, GetSingleOrder);

router
    .route("/admin/orders")
    .get(isAuthenticatedUser, AuthorizeRoles("admin"), GetAllOrder);

router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, AuthorizeRoles("admin"), UpdateOrderStatus)
    .delete(isAuthenticatedUser, AuthorizeRoles("admin"), DeleteOrder);

export default router;
