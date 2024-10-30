const express = require("express");
const CartController = require("../controllers/CartController");

const router = express.Router();

router.post("/create", CartController.createCart);
router.get("/get-cart/:userId", CartController.getCartByUserId);
router.put(
  "/update-cart/:userId/products/:productId",
  CartController.updateCart
);
router.delete(
  "/delete-product-cart/:userId/products/:productId",
  CartController.removeProductFromCart
);
router.delete("/delete-cart/:userId", CartController.deleteCart);

module.exports = router;
