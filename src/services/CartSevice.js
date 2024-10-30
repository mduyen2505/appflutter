const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const createCart = async (newCart) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, products } = newCart;

      const existingCart = await Cart.findOne({ userId });
      if (existingCart) {
        return resolve({
          status: "ERR",
          message:
            "Cart already exists for this user. Please update the existing cart."
        });
      }

      // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng
      const newCartEntry = new Cart({
        userId,
        products,
        totalPrice: 0 // Có thể tính sau
      });

      // Tính tổng số tiền
      newCartEntry.totalPrice = products.reduce(
        (total, product) => total + product.quantity * product.prices,
        0
      );
      await newCartEntry.save();

      resolve({
        status: "OK",
        message: "Cart created successfully",
        data: newCartEntry
      });
    } catch (e) {
      console.error("Error creating cart:", e);
      reject({
        status: "ERR",
        message: "Error creating cart"
      });
    }
  });
};

const getCartByUserId = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "name prices"
    );
    if (!cart) {
      return {
        status: "ERR",
        message: "Cart not found"
      };
    }
    return {
      status: "OK",
      data: cart
    };
  } catch (e) {
    throw new Error("Error retrieving cart");
  }
};

const updateCart = async (userId, productId, quantity) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return resolve({
          status: "ERR",
          message: "Cart not found"
        });
      }

      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (productIndex > -1) {
        // Sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        cart.products[productIndex].quantity = quantity;
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        const productDetails = await Product.findById(productId);
        cart.products.push({
          productId,
          quantity,
          prices: productDetails.prices
        });
      }

      // Cập nhật tổng số tiền
      cart.totalPrice = cart.products.reduce(
        (total, product) => total + product.quantity * product.prices,
        0
      );

      await cart.save();
      resolve({
        status: "OK",
        message: "Cart updated successfully",
        data: cart
      });
    } catch (e) {
      console.error("Error updating cart:", e);
      reject({
        status: "ERR",
        message: "Error updating cart"
      });
    }
  });
};

const removeProductFromCart = async (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return resolve({
          status: "ERR",
          message: "Cart not found"
        });
      }

      cart.products = cart.products.filter(
        (p) => p.productId.toString() !== productId
      );

      // Cập nhật tổng số tiền
      cart.totalPrice = cart.products.reduce(
        (total, product) => total + product.quantity * product.prices,
        0
      );

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
        message: "Error removing product from cart"
      });
    }
  });
};

const deleteCart = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Cart.findOneAndDelete({ userId });
      resolve({
        status: "OK",
        message: "Cart deleted successfully"
      });
    } catch (e) {
      console.error("Error deleting cart:", e);
      reject({
        status: "ERR",
        message: "Error deleting cart"
      });
    }
  });
};

module.exports = {
  createCart,
  getCartByUserId,
  updateCart,
  removeProductFromCart,
  deleteCart
};
