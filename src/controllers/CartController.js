const CartService = require("../services/CartSevice");
const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");

const addOrUpdateProductInCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId.toString()
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    } else {
      cart = new Cart({
        userId,
        products: [{ productId, quantity }]
      });
    }

    cart.totalPrice = await calculateTotalPrice(cart.products);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addOrUpdateProductInCart:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const calculateTotalPrice = async (products) => {
  let total = 0;
  for (const product of products) {
    const productInDB = await Product.findById(product.productId);
    if (!productInDB) {
      console.error(`Product not found in DB for ID: ${product.productId}`);
      continue;
    }
    const productPrice = productInDB.prices;
    if (isNaN(productPrice) || productPrice < 0) {
      console.error(
        `Invalid price for product ID ${product.productId}:`,
        productPrice
      );
      continue;
    }

    total += productPrice * product.quantity;
  }
  return total;
};

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "Yêu cầu userId"
      });
    }

    const response = await CartService.getCartByUserId(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Đã xảy ra lỗi"
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
      message: e.message || "Đã xảy ra lỗi"
    });
  }
};

const deleteCart = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const response = await CartService.deleteCart(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Đã xảy ra lỗi"
    });
  }
};

module.exports = {
  addOrUpdateProductInCart,
  getCartByUserId,
  removeProductFromCart,
  deleteCart
};
