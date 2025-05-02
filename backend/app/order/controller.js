const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const Order = require("./model");
const { Types } = require("mongoose");
const OrderItem = require("../order-item/model");

const store = async (req, res, next) => {
    try {
        let { delivery_fee, delivery_address } = req.body; //delivery_address = id delivery adddress
        let items = await CartItem.find({ user: req.user._id }).populate(
            "product_id"
        );
        if (!items) {
            return res.json({
                error: 1,
                message: `You can't create order because you have not items in cart`,
            });
        }
        let address = await DeliveryAddress.findById(delivery_address);
        let order = new Order({
            _id: new Types.ObjectId(),
            status: "waiting_payment",
            delivery_fee,
            delivery_address: {
                provinsi: address.provinsi,
                kabupaten: address.kabupaten,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail,
            },
            user: req.user._id,
        });
        let orderItems = await OrderItem.insertMany(
            items.map((item) => ({
                // ...item,
                name: item.product_id.name,
                qty: parseInt(item.qty),
                price: parseInt(item.product_id.price),
                order: order._id,
                product: item.product_id._id,
            }))
        );
        orderItems.forEach((item) => {
            order.order_items.push(item);
        });
        await order.save();
        await CartItem.deleteMany({ user: req.user._id });
        return res.json(order);
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
};
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        let orderNew = await Order.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        return res.json(orderNew);
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
};
const index = async (req, res, next) => {
    try {
        let { skip = 0, limit = 10 } = req.query;
        let count, orders;
        if (req.user.role == "admin") {
            count = await Order.find().countDocuments();
            orders = await Order.find()
                .skip(parseInt(skip))
                .limit(parseInt(limit))
                .populate("order_items")
                .populate("user")
                .sort("-createdAt");
        } else {
            count = await Order.find({ user: req.user._id }).countDocuments();
            orders = await Order.find({ user: req.user._id })
                .skip(parseInt(skip))
                .limit(parseInt(limit))
                .populate("order_items")
                .sort("-createdAt");
        }
        return res.json({
            data: orders.map((order) => order.toJSON({ virtuals: true })),
            count,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { store, index, update };
