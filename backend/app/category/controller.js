const Category = require("./model");

const store = async (req, res, next) => {
    try {
        const payload = req.body;
        const category = new Category(payload);
        await category.save();
        return res.json(category);
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
        const payload = req.body;
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
        return res.json(category);
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
const destroy = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        return res.json(category);
    } catch (err) {
        next(err);
    }
};
const index = async (req, res, next) => {
    try {
        const categories = await Category.find();
        return res.json(categories);
    } catch (err) {
        next(err);
    }
};

module.exports = { store, update, destroy, index };
