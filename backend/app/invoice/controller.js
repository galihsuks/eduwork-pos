const Invoice = require("./model");

const show = async (req, res, next) => {
    try {
        let { order_id } = req.params;
        let invoice = await Invoice.findOne({ order: order_id })
            .populate({
                path: "order",
                populate: "order_items",
            })
            .populate("user");

        if (invoice.user._id != req.user._id && req.user.role != "admin") {
            return res.json({
                error: 1,
                message: `You dont have access to this invoice`,
            });
        }

        return res.json(invoice);
    } catch (err) {
        next(err);
    }
};

module.exports = { show };
