const Tag = require("./model");

const store = async (req, res, next) => {
    try {
        const payload = req.body;
        const tag = new Tag(payload);
        await tag.save();
        return res.json(tag);
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
        console.log(`Idnya : ${id}`);
        const tag = await Tag.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
        return res.json(tag);
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
        const tag = await Tag.findByIdAndDelete(req.params.id);
        return res.json(tag);
    } catch (err) {
        next(err);
    }
};
const index = async (req, res, next) => {
    try {
        const tags = await Tag.find();
        return res.json(tags);
    } catch (err) {
        next(err);
    }
};

module.exports = { store, update, destroy, index };
