const Product = require("../product/model");
const CartItem = require("../cart-item/model");
const { populate } = require("dotenv");

const update = async (req, res, next) => {
    try {
        const { items } = req.body;
        console.log(items);
        // items = [
        //     {
        //         product_id: 'qwd',
        //         qty: 2
        //     }
        // ]
        const productsIds = items.map((i) => i.product_id);
        const products = await Product.find({
            _id: { $in: productsIds },
        }).populate("category");
        let cartItems = items.map((i) => {
            let relatedProduct = products.find(
                (p) => p._id.toString() === i.product_id.toString()
            );
            return {
                product_id: relatedProduct._id,
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
                        product_id: i.product_id,
                    },
                    update: i,
                    upsert: true,
                },
            }))
        );
        return res.json(
            items.map((i) => {
                let relatedProduct = products.find(
                    (p) => p._id.toString() === i.product_id.toString()
                );
                return {
                    product_category: relatedProduct.category.name,
                    product_id: relatedProduct._id,
                    price: relatedProduct.price,
                    image_url: relatedProduct.image_url,
                    name: relatedProduct.name,
                    qty: i.qty,
                };
            })
        );
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
        const items = await CartItem.find({ user: req.user._id }).populate({
            path: "product_id",
            populate: "category",
        });
        console.log(items);
        return res.json(
            items.map((i) => {
                return {
                    product_category: i.product_id.category.name,
                    product_id: i.product_id._id,
                    price: i.price,
                    image_url: i.image_url,
                    name: i.name,
                    qty: i.qty,
                };
            })
        );
    } catch (err) {
        next(err);
    }
};

module.exports = { update, index };
