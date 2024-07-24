import { Order } from "../models/Order.model.js";
import ErrorHandler from "../utills/ErrorHandler.js";
import CatchAsynError from "../middleware/AsyncError.js";
import { Product } from "../models/Product.model.js";

// Create new order
const NewOrder = CatchAsynError(async (req, res, next) => {
    console.log("in");
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    console.log(req.body);
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });
    console.log("last\n", order, "");

    res.status(201).json({
        message: "Order is created",
        order,
    });
});

// Get Single order
const GetSingleOrder = CatchAsynError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if (!order)
        return next(new ErrorHandler(404, "Order not found with this id"));

    res.status(200).json({
        success: true,
        order,
    });
});

// Get logged in user order
const MyOrders = CatchAsynError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        orders,
    });
});

// Get all order --Admin
const GetAllOrder = CatchAsynError(async (req, res, next) => {
    console.log("in order");
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});
// update order status --Admin
const UpdateOrderStatus = CatchAsynError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) return next(new ErrorHandler(500, "order not found"));
    if (order.orderStatus === "Delivered") {
        return next(
            new ErrorHandler(404, "You have already delivered this order")
        );
    }
    if (req.body.status === "Shipped")
        order.orderItems.forEach(async (order) => {
            await UpdateStock(order.product, order.quantity);
        });

    const { status } = req.body;
    order.orderStatus = status;

    if (status === "Delivered") order.deliveredAt = Date.now();

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order,
    });
});

const UpdateStock = CatchAsynError(async (productId, quantity) => {
    const product = await Product.findById(productId);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
});

//Delete Order --admin
const DeleteOrder = CatchAsynError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order)
        return next(new ErrorHandler(500, "order not found with the given id"));

    await order.deleteOne();
    res.status(200).json({
        success: true,
        message: "order is deleted",
    });
});
export {
    NewOrder,
    GetSingleOrder,
    MyOrders,
    GetAllOrder,
    UpdateOrderStatus,
    DeleteOrder,
};
