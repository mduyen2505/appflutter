const mongoose = require("mongoose");
const Product = require("./ProductModel");

// Cart Schema
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }, // ID của người dùng
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        }, // ID của sản phẩm
        quantity: { type: Number, required: true, min: 1 }, // Số lượng sản phẩm trong giỏ hàng
        prices: { type: Number, required: true } // Giá của sản phẩm
      }
    ],
    totalPrice: { type: Number, default: 0 } // Tính tổng tiền của giỏ hàng
  },
  { timestamps: true }
);

// Middleware để tính tổng tiền trước khi lưu
cartSchema.pre("save", function (next) {
  // Tính tổng tiền
  this.totalPrice = this.products.reduce((total, product) => {
    return total + product.prices * product.quantity;
  }, 0);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
