const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const addOrUpdateProductInCart = async (userId, productId, quantity) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw { status: 404, message: "Product not found" };
    }

    const existingCart = await Cart.findOne({ userId });
    const cart = existingCart || new Cart({
      userId,
      products: [{ productId, quantity }]
    });

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId.toString()
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    // Tính toán `totalPrice` với `for...of`
    cart.totalPrice = await cart.products.reduce(async (totalPromise, productItem) => {
      const total = await totalPromise;
      const productInDB = await Product.findById(productItem.productId);
      const productPrice = productInDB ? productInDB.prices : 0;

      return total + (isNaN(productPrice) || productPrice < 0 ? 0 : productPrice * productItem.quantity);
    }, Promise.resolve(0));

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in addOrUpdateProductInCart service:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

const UpdateProductInCart = async (userId, productId, quantity) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw { status: 404, message: "Product not found" };
    }

    const existingCart = await Cart.findOne({ userId });
    const cart = existingCart || new Cart({
      userId,
      products: [{ productId, quantity: Math.max(quantity, 0) }]
    });

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId.toString()
    );

    if (productIndex > -1) {
      const newQuantity = cart.products[productIndex].quantity - quantity;
      if (newQuantity <= 0) {
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity = newQuantity;
      }
    } else if (quantity > 0) {
      cart.products.push({ productId, quantity });
    }

    // Tính toán `totalPrice`
    cart.totalPrice = await cart.products.reduce(async (totalPromise, productItem) => {
      const total = await totalPromise;
      const productInDB = await Product.findById(productItem.productId);
      const productPrice = productInDB ? productInDB.prices : 0;

      return total + (isNaN(productPrice) || productPrice < 0 ? 0 : productPrice * productItem.quantity);
    }, Promise.resolve(0));

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in addOrUpdateProductInCart service:", error);
    throw { status: 500, message: "Internal server error" };
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
  UpdateProductInCart,
  getCartByUserId,
  removeProductFromCart,
  deleteCart
};
