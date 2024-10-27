const express = require ("express");
const router = express.Router()
const orderController = require ('../controllers/OrderController');
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/create',orderController.createOrder)





module.exports = router