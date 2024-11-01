const express = require('express');
const CartController = require('../controllers/CartController');

const router = express.Router();

// Thêm hoặc cập nhật sản phẩm vào giỏ hàng
router.post("/add-update", CartController.addOrUpdateProductInCart); // Tạo hoặc cập nhật giỏ hàng
// Lấy giỏ hàng của người dùng
router.get("/get-cart/:userId", CartController.getCartByUserId); // Lấy giỏ hàng của người dùng
// Xóa sản phẩm cụ thể khỏi giỏ hàng của người dùng
router.delete("/delete-product-cart/:userId/product/:productId", CartController.removeProductFromCart); // Xóa sản phẩm khỏi giỏ hàng
// Xóa toàn bộ giỏ hàng của người dùng
router.delete("/delete-cart/:userId", CartController.deleteCart); // Xóa giỏ hàng

module.exports = router;