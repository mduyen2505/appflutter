const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", orderController.createOrderController);
router.get("/get/:orderId", orderController.getOrderByIdController);
router.get("/getAll/:userId", orderController.getAllOrdersByUserController);
router.get("/getAll", orderController.getAllOrders);

router.put("/cancel", orderController.cancelOrderController);

// Route để admin xác nhận đơn hàng (chuyển từ Pending sang Shipped)
router.put("/ship", orderController.shipOrderController);
// Route để người dùng xác nhận đã nhận hàng (chuyển từ Shipped sang Delivered)
router.put("/deliver", orderController.deliverOrderController);

module.exports = router;
