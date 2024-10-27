const Order = require('../models/OrderProduct');

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        console.log('newOrder', newOrder);
        const { oderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, user } = newOrder;
        const { fullName, address, city, phone } = newOrder.shippingAddress;

        try {
            const createdOrder = await Order.create({
                oderItems, // Đảm bảo sử dụng đúng tên trường
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    phone
                },
                paymentMethod,
                itemsPrice, // Đảm bảo sửa từ "itesmPrice" thành "itemsPrice"
                shippingPrice,
                totalPrice,
                user, // Trường user phải có giá trị
            });

            if (createdOrder) {
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: createdOrder
                });
            }
        } catch (e) {
            console.error('Error creating order:', e); // Log lỗi để dễ dàng kiểm tra
            reject(e);
        }
    });
};

module.exports = {
    createOrder,
};
