const express = require("express");
const CartController = require("../controllers/CartController");

const router = express.Router();

// Thêm sản phẩm vào giỏ
router.post("/create", CartController.createCart); // Tạo giỏ hàng
router.get("/get-cart/:userId", CartController.getCartByUserId); // Lấy giỏ hàng của người dùng
router.put(
  "/update-cart/:userId/products/:productId",
  CartController.updateCart
); // Cập nhật giỏ hàng
router.delete(
  "/delete-product-cart/:userId/products/:productId",
  CartController.removeProductFromCart
); // Xóa sản phẩm khỏi giỏ hàng
router.delete("/delete-cart/:userId", CartController.deleteCart); // Xóa giỏ hàng

module.exports = router;
