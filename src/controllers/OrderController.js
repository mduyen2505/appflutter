const OrderService = require("../services/OrderService");
const Order = require("../models/OrderModel");

const createOrderController = async (req, res) => {
  try {
    const { userId, cartId, shippingAddress, productIds, name, phone, email } =
      req.body;
    const selectedProductIds = Array.isArray(productIds)
      ? productIds
      : [productIds];

    const newOrder = await OrderService.createOrder(
      userId,
      cartId,
      shippingAddress,
      selectedProductIds,
      name,
      phone,
      email
    );

    res.status(200).json({ status: "OK", data: newOrder });
  } catch (error) {
    console.error("Lỗi trong createOrder controller:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal server error"
    });
  }
};
const getAllOrdersByUserController = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId }).populate("products.productId");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "ERR",
        message: "Không có đơn hàng nào được tìm thấy cho người dùng này"
      });
    }

    res.status(200).json({
      status: "OK",
      data: orders
    });
  } catch (error) {
    console.error("Lỗi trong getAllOrdersByUserController:", error);
    res.status(500).json({
      status: "ERR",
      message: "Lỗi máy chủ nội bộ"
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "ERR",
        message: "Không có đơn hàng nào được tìm thấy cho người dùng này"
      });
    }

    res.status(200).json({
      status: "OK",
      data: orders
    });
  } catch (error) {
    console.error("Lỗi trong getAllOrdersByUserController:", error);
    res.status(500).json({
      status: "ERR",
      message: "Lỗi máy chủ nội bộ"
    });
  }
};

const getOrderByIdController = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("products.productId");

    if (!order) {
      return res.status(404).json({
        status: "ERR",
        message: "Order not found"
      });
    }

    res.status(200).json({
      status: "OK",
      data: order
    });
  } catch (error) {
    console.error("Error in getOrderById controller:", error);
    res.status(500).json({
      status: "ERR",
      message: "Internal server error"
    });
  }
};
const cancelOrderController = async (req, res) => {
  const { orderId } = req.body;

  try {
    const canceledOrder = await OrderService.cancelOrder(orderId);
    res.status(200).json({
      status: "OK",
      message: "Order canceled successfully",
      data: canceledOrder
    });
  } catch (error) {
    console.error("Error in cancelOrderController:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal server error"
    });
  }
};

const shipOrderController = async (req, res) => {
  const { orderId } = req.body;
  console.log(orderId);
  try {
    const shippedOrder = await OrderService.shipOrder(orderId);
    res.status(200).json({
      status: "OK",
      message: "Order shipped successfully",
      data: shippedOrder
    });
  } catch (error) {
    console.error("Error in shipOrderController:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal server error"
    });
  }
};

const deliverOrderController = async (req, res) => {
  const { orderId } = req.body;

  try {
    const deliveredOrder = await OrderService.deliverOrder(orderId);
    res.status(200).json({
      status: "OK",
      message: "Order delivered successfully",
      data: deliveredOrder
    });
  } catch (error) {
    console.error("Error in deliverOrderController:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal server error"
    });
  }
};

module.exports = {
  getAllOrdersByUserController,
  getAllOrders,
  createOrderController,
  getOrderByIdController,
  cancelOrderController,
  shipOrderController,
  deliverOrderController
};
