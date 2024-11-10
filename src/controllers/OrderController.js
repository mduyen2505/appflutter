const OrderService = require("../services/OrderService");
const Order = require('../models/OrderModel');

const createOrderController = async (req, res) => {
  try {
    const { userId, cartId, shippingAddress, productIds } = req.body;

    // Đảm bảo productIds luôn là mảng
    const selectedProductIds = Array.isArray(productIds) ? productIds : [productIds];

    const newOrder = await OrderService.createOrder(userId, cartId, shippingAddress, selectedProductIds);

    res.status(200).json({ status: "OK", data: newOrder });
  } catch (error) {
    console.error("Lỗi trong createOrder controller:", error);
    res.status(error.status || 500).json({ status: "ERR", message: error.message || "Internal server error" });
  }
};

const getOrderByIdController = async (req, res) => {
  const { orderId } = req.params;  // Lấy orderId từ params

  try {
    // Tìm đơn hàng theo orderId và sử dụng populate để lấy thông tin sản phẩm
    const order = await Order.findById(orderId)
      .populate('products.productId');  // Populate các thông tin sản phẩm trong đơn hàng

    if (!order) {
      return res.status(404).json({
        status: 'ERR',
        message: 'Order not found'  // Trả về thông báo nếu không tìm thấy đơn hàng
      });
    }

    // Trả về thông tin đơn hàng nếu tìm thấy
    res.status(200).json({
      status: 'OK',
      data: order  // Trả về dữ liệu đơn hàng
    });
  } catch (error) {
    console.error("Error in getOrderById controller:", error);
    res.status(500).json({
      status: 'ERR',
      message: 'Internal server error'  // Trả về lỗi nếu có lỗi khi thực thi
    });
  }
};
const cancelOrderController = async (req, res) => {
  const { orderId } = req.body;

  try {
    const canceledOrder = await OrderService.cancelOrder(orderId);
    res.status(200).json({
      status: 'OK',
      message: 'Order canceled successfully',
      data: canceledOrder
    });
  } catch (error) {
    console.error("Error in cancelOrderController:", error);
    res.status(error.status || 500).json({
      status: 'ERR',
      message: error.message || 'Internal server error'
    });
  }
};

const shipOrderController = async (req, res) => {
  const { orderId } = req.body;

  try {
    const shippedOrder = await OrderService.shipOrder(orderId);
    res.status(200).json({
      status: 'OK',
      message: 'Order shipped successfully',
      data: shippedOrder
    });
  } catch (error) {
    console.error("Error in shipOrderController:", error);
    res.status(error.status || 500).json({
      status: 'ERR',
      message: error.message || 'Internal server error'
    });
  }
};

// Controller để người dùng xác nhận đã nhận hàng (chuyển từ Shipped sang Delivered)
const deliverOrderController = async (req, res) => {
  const { orderId } = req.body;

  try {
    const deliveredOrder = await OrderService.deliverOrder(orderId);
    res.status(200).json({
      status: 'OK',
      message: 'Order delivered successfully',
      data: deliveredOrder
    });
  } catch (error) {
    console.error("Error in deliverOrderController:", error);
    res.status(error.status || 500).json({
      status: 'ERR',
      message: error.message || 'Internal server error'
    });
  }
};

module.exports = {
  createOrderController,
  getOrderByIdController,
  cancelOrderController,
  shipOrderController,
  deliverOrderController
};
