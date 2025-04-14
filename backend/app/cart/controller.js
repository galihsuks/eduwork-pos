const Product = require("../product/model");
const CartItem = require("../cart-item/model");

const update = async (req, res, next) => {
    try {
        const { items } = req.body;
        const productsIds = items.map((i) => i.product._id);
        const products = await Product.find({ _id: { $in: productsIds } });
        let cartItems = items.map((i) => {
            let relatedProduct = products.find(
                (p) => p._id.toString() === i.product._id
            );
            return {
                product: relatedProduct._id,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,
                name: relatedProduct.name,
                user: req.user._id,
                qty: i.qty,
            };
        });

        await CartItem.deleteMany({ user: req.user._id });
        await CartItem.bulkWrite(
            cartItems.map((i) => ({
                updateOne: {
                    filter: {
                        user: req.user._id,
                        product: i.product,
                    },
                    update: i,
                    upsert: true,
                },
            }))
        );
        return res.json(cartItems);
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
        const items = await CartItem.find({ user: req.user._id }).populate(
            "product"
        );
        return res.json(items);
    } catch (err) {
        next(err);
    }
};

module.exports = { update, index };
