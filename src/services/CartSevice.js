const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const addOrUpdateProductInCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    // console.log("User ID:", userId);
    // console.log("Product ID:", productId);
    // console.log("Quantity:", quantity);

    // console.log("Request Body:", req.body);

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

    cart.totalPrice = cart.products.reduce((total, product) => {
      const productInDB =
        product.productId.toString() === productId.toString() ? product : null;
      const productPrice = productInDB ? productInDB.prices : 0;

      if (isNaN(productPrice) || productPrice < 0) {
        console.error(
          `Invalid prices for product ID ${product.productId}:`,
          productPrice
        );
        return total;
      }

      return total + productPrice * product.quantity;
    }, 0);

    await cart.save();

    const response = cart.toObject();
    response.products = response.products.map((product) => {
      const { _id, ...rest } = product;
      return rest;
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in addOrUpdateProductInCart:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getCartByUserId = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "name prices "
    );
    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng");
    }
    return cart;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const removeProductFromCart = async (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({ userId }).populate(
        "products.productId",
        "name prices"
      );
      console.log(cart);
      if (!cart) {
        return resolve({
          status: "ERR",
          message: "Cart not found"
        });
      }

      console.log("Current Cart Products:", cart.products);

      const productExists = cart.products.some(
        (p) => p.productId._id.toString() === productId
      );
      if (!productExists) {
        return resolve({
          status: "ERR",
          message: "Product not found in cart"
        });
      }

      cart.products = cart.products.filter(
        (p) => p.productId._id.toString() !== productId
      );

      cart.totalPrice = cart.products.reduce((total, product) => {
        const prices = product.productId.prices || 0;
        return total + prices * product.quantity;
      }, 0);

      await cart.save();
      resolve({
        status: "OK",
        message: "Product removed from cart",
        data: cart
      });
    } catch (e) {
      console.error("Error removing product from cart:", e);
      reject({
        status: "ERR",
        message: "Error removing product from cart",
        error: e.message
      });
    }
  });
};

const deleteCart = async (userId) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId }).populate(
      "products.productId",
      "name prices"
    );
    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng để xóa");
    }
    return { message: "Giỏ hàng đã được xóa thành công" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  addOrUpdateProductInCart,
  getCartByUserId,
  removeProductFromCart,
  deleteCart
};
