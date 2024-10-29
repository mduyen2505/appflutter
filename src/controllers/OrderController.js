// const json = require("body-parser/lib/types/json")
// const { status } = require("express/lib/response")
const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    // Lấy shippingAddress từ req.body
    const { paymentMethod, itemsPrice, shippingPrice, totalPrice, user } =
      req.body;
    const { fullName, address, city, phone } = req.body.shippingAddress;

    // Log để kiểm tra từng trường
    console.log("paymentMethod:", paymentMethod);
    console.log("itemsPrice:", itemsPrice);
    console.log("shippingPrice:", shippingPrice);
    console.log("totalPrice:", totalPrice);
    console.log("fullName:", fullName);
    console.log("address:", address);
    console.log("city:", city);
    console.log("phone:", phone);
    console.log("user:", user);

    // Kiểm tra các trường cần thiết
    if (
      !paymentMethod ||
      !itemsPrice ||
      !shippingPrice ||
      !totalPrice ||
      !fullName ||
      !address ||
      !city ||
      !phone ||
      !user
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required"
      });
    }

    // Gọi service để tạo order
    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message || "An error occurred"
    });
  }
};

module.exports = {
  createOrder
};
