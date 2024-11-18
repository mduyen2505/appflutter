const crypto = require("crypto");
const Order = require("../models/OrderModel");
const config = require("../config/default.json");
require("dotenv").config();
const createVNPayPaymentUrl = async (orderId, returnUrl) => {
  const { VNP_TMN_CODE, VNP_HASH_SECRET, VNP_URL, VNP_RETURN_URL } =
    process.env;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Đơn hàng với ID ${orderId} không tồn tại`);
  }
  const amount = order.orderTotal;
  console.log("amout", amount);
  if (!VNP_HASH_SECRET) {
    throw new Error("VNP_HASH_SECRET không được định nghĩa");
  }
  const date = new Date();
  const vnp_CreateDate = `${date.getFullYear()}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}${String(
    date.getHours()
  ).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(
    date.getSeconds()
  ).padStart(2, "0")}`;

  console.log("Thông tin đơn hàng:", order);
  console.log("Giá trị đơn hàng (VND):", amount);

  let params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: VNP_TMN_CODE,
    vnp_Amount: amount * 1000,
    vnp_CreateDate: vnp_CreateDate,
    vnp_CurrCode: "VND",
    vnp_IpAddr: "127.0.0.1",
    vnp_Locale: "vn",
    vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: returnUrl || VNP_RETURN_URL,
    vnp_TxnRef: orderId
  };

  console.log("Các tham số trước khi sắp xếp:", params);

  const sortedParams = sortObject(params);
  const query = new URLSearchParams(sortedParams).toString();

  const secureHash = crypto
    .createHmac("sha512", VNP_HASH_SECRET)
    .update(query)
    .digest("hex");

  const paymentUrl = `${VNP_URL}?${query}&vnp_SecureHash=${secureHash}`;

  return paymentUrl;
};

function sortObject(obj) {
  const sortedKeys = Object.keys(obj).sort();
  return sortedKeys.reduce((result, key) => {
    result[key] = obj[key];
    return result;
  }, {});
}

module.exports = createVNPayPaymentUrl;
