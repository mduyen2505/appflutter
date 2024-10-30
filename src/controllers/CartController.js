const CartService = require("../services/CartSevice");

const createCart = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { userId, products } = req.body;

    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "userId and products are required"
      });
    }

    const response = await CartService.createCart(req.body);
    return res.status(201).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred"
    });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "userId is required"
      });
    }

    const response = await CartService.getCartByUserId(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred"
    });
  }
};

const updateCart = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;
  try {
    const response = await CartService.updateCart(userId, productId, quantity);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred"
    });
  }
};

const removeProductFromCart = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const response = await CartService.removeProductFromCart(userId, productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred"
    });
  }
};

const deleteCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await CartService.deleteCart(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred"
    });
  }
};

module.exports = {
  createCart,
  getCartByUserId,
  updateCart,
  removeProductFromCart,
  deleteCart
};
