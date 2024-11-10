const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const createOrder = async (
  userId,
  cartId,
  shippingAddress,
  productIds,
  name,
  phone,
  email
) => {
  try {
    // Kiểm tra giỏ hàng
    const cart = await Cart.findById(cartId).populate("products.productId");
    if (!cart) {
      throw { status: 404, message: "Không tìm thấy giỏ hàng" };
    }

    // Lọc ra các sản phẩm hợp lệ dựa trên productIds
    const selectedProducts = cart.products.filter((item) =>
      productIds.includes(String(item.productId._id))
    );

    // Kiểm tra nếu không có sản phẩm hợp lệ
    if (selectedProducts.length === 0) {
      throw { status: 400, message: "Không có sản phẩm hợp lệ để thanh toán" };
    }

    // Lấy thông tin sản phẩm và tính toán tổng giá trị
    const products = await Promise.all(
      selectedProducts.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw {
            status: 404,
            message: `Không tìm thấy sản phẩm với ID ${item.productId}`
          };
        }
        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.prices
        };
      })
    );

    // Tính tổng giá trị đơn hàng
    const totalPrice = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    // Tính toán phí vận chuyển (Ví dụ: miễn phí vận chuyển nếu đơn hàng trên 1000)
    const shippingFee = totalPrice > 50000000 ? 0 : 200000;
    const orderTotal = totalPrice + shippingFee;

    // Tạo đơn hàng mới
    const newOrder = new Order({
      name,
      phone,
      email,
      userId,
      cartId,
      products,
      shippingAddress,
      totalPrice,
      shippingFee,
      orderTotal,
      status: "Pending"
    });

    // Lưu đơn hàng
    await newOrder.save();

    return newOrder;
  } catch (error) {
    console.error("Lỗi trong createOrder service:", error);
    throw error;
  }
};
const getAllOrdersByUser = async (userId) => {
  try {
    // Tìm tất cả đơn hàng của người dùng
    const orders = await Order.find({ userId }).populate("products.productId");
    return orders;
  } catch (error) {
    console.error("Lỗi trong getAllOrdersByUser service:", error);
    throw error;
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params; // Lấy orderId từ params

  try {
    // Tìm đơn hàng theo orderId
    const order = await Order.findById(orderId).populate("products.productId");

    if (!order) {
      return res.status(404).json({
        status: "ERR",
        message: "Order not found"
      });
    }

    // Trả về thông tin đơn hàng nếu tìm thấy
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
const cancelOrder = async (orderId) => {
  try {
    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    // Nếu đơn hàng đã có trạng thái là 'Delivered' hoặc 'Cancelled', không thể hủy
    if (order.status === "Delivered" || order.status === "Cancelled") {
      throw { status: 400, message: "Order already delivered or cancelled" };
    }

    // Cập nhật trạng thái đơn hàng thành 'Cancelled'
    order.status = "Cancelled";

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.error("Error in cancelOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

const shipOrder = async (orderId) => {
  try {
    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    // Kiểm tra trạng thái hiện tại của đơn hàng
    if (order.status !== "Pending") {
      throw { status: 400, message: "Order is not in Pending status" };
    }

    // Cập nhật trạng thái đơn hàng thành 'Shipped'
    order.status = "Shipped";

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.error("Error in shipOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

const deliverOrder = async (orderId) => {
  try {
    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    // Kiểm tra trạng thái hiện tại của đơn hàng
    if (order.status !== "Shipped") {
      throw { status: 400, message: "Order is not in Shipped status" };
    }

    // Cập nhật trạng thái đơn hàng thành 'Delivered'
    order.status = "Delivered";

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.error("Error in deliverOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderById,
  cancelOrder,
  shipOrder,
  deliverOrder
};
