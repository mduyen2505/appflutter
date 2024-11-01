const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    const { paymentMethod, itemsPrice, shippingPrice, totalPrice, user } =
      req.body;
    const { fullName, address, city, phone } = req.body.shippingAddress;

    console.log("paymentMethod:", paymentMethod);
    console.log("itemsPrice:", itemsPrice);
    console.log("shippingPrice:", shippingPrice);
    console.log("totalPrice:", totalPrice);
    console.log("fullName:", fullName);
    console.log("address:", address);
    console.log("city:", city);
    console.log("phone:", phone);
    console.log("user:", user);

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
