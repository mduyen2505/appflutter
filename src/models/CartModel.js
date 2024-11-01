const mongoose = require("mongoose");
const Product = require("./ProductModel");

// Cart Schema
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, required: true, min: 1 },

      }
    ],
    totalPrice: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Middleware to calculate total price before saving
cartSchema.pre("save", async function (next) {
  try {
    // Retrieve product prices for each product in the cart
    const productsWithPrices = await Promise.all(
      this.products.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          quantity: item.quantity,
          price: product ? product.prices : 0
        };
      })
    );

    // Calculate total price based on the quantity and price of each product
    this.totalPrice = productsWithPrices.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    next();
  } catch (error) {
    next(error);
  }
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
