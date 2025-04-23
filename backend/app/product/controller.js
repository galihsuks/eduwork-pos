const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");
const Category = require("../category/model");
const Tag = require("../tag/model");

const store = async (req, res, next) => {
    try {
        let payload = req.body;
        if (payload.category) {
            const category = await Category.findOne({
                name: { $regex: payload.category, $options: "i" },
            });
            if (category) payload = { ...payload, category: category._id };
            else delete payload.category;
        }

        if (payload.tags && payload.tags.length > 0) {
            const tags = await Tag.find({
                name: { $in: payload.tags },
            });
            if (tags.length > 0)
                payload = { ...payload, tags: tags.map((t) => t._id) };
            else delete payload.tags;
        }

        if (req.file) {
            const tmp_path = req.file.path;
            const originalExt =
                req.file.originalname.split(".")[
                    req.file.originalname.split(".").length - 1
                ];
            const filename = `${req.file.filename}.${originalExt}`;
            const target_path = path.resolve(
                config.rootPath,
                `public/images/products/${filename}`
            );

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on("end", async () => {
                try {
                    const product = new Product({
                        ...payload,
                        image_url: filename,
                    });
                    await product.save();
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(target_path);
                    if (err && err.name === "ValidationError") {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors,
                        });
                    }
                    next(err);
                }
            });
            src.on("error", async () => {
                next(err);
            });
        } else {
            const product = new Product(payload);
            await product.save();
            return res.json(product);
        }
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
        const {
            skip = 0,
            limit = 10,
            q = "",
            category = "",
            tags = [],
        } = req.query;

        let criteria = {};

        if (q.length) {
            criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };
        }
        if (category.length) {
            const categoryResult = await Category.findOne({
                name: { $regex: category, $options: "i" },
            });
            if (categoryResult)
                criteria = { ...criteria, category: categoryResult._id };
        }
        if (tags.length) {
            const tagsResult = await Tag.find({
                name: { $in: tags },
            });
            if (tagsResult.length > 0)
                criteria = {
                    ...criteria,
                    tags: { $in: tagsResult.map((t) => t._id) },
                };
        }

        const count = await Product.find(criteria).countDocuments();
        const products = await Product.find(criteria)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate("category")
            .populate("tags");
        return res.json({
            data: products,
            count,
        });
    } catch (err) {
        next(err);
    }
};
const indexDetail = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category")
            .populate("tags");
        const products = await Product.find({
            category: product.category._id,
            _id: { $ne: product._id },
        }).limit(5);
        return res.json({
            product,
            products,
        });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        let payload = req.body;
        const { id } = req.params;

        if (payload.category) {
            const category = await Category.findOne({
                name: { $regex: payload.category, $options: "i" },
            });
            if (category) payload = { ...payload, category: category._id };
            else delete payload.category;
        }

        if (payload.tags && payload.tags.length > 0) {
            const tags = await Tag.find({
                name: { $in: payload.tags },
            });
            if (tags.length > 0)
                payload = { ...payload, tags: tags.map((t) => t._id) };
            else delete payload.tags;
        }

        if (req.file) {
            const tmp_path = req.file.path;
            const originalExt =
                req.file.originalname.split(".")[
                    req.file.originalname.split(".").length - 1
                ];
            const filename = `${req.file.filename}.${originalExt}`;
            const target_path = path.resolve(
                config.rootPath,
                `public/images/products/${filename}`
            );

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on("end", async () => {
                try {
                    let product = await Product.findById(id);
                    let currectImage = `${config.rootPath}/public/images/products/${product.image_url}`;
                    if (fs.existsSync(currectImage)) {
                        fs.unlinkSync(currectImage);
                    }
                    product = await Product.findByIdAndUpdate(
                        id,
                        { ...payload, image_url: filename },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(target_path);
                    if (err && err.name === "ValidationError") {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors,
                        });
                    }
                    next(err);
                }
            });
            src.on("error", async () => {
                next(err);
            });
        } else {
            const product = await Product.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true,
            });
            return res.json(product);
        }
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
        const product = await Product.findByIdAndDelete(req.params.id);
        let currectImage = `${config.rootPath}/public/images/products/${product.image_url}`;
        if (fs.existsSync(currectImage)) {
            fs.unlinkSync(currectImage);
        }
        return res.json(product);
    } catch (err) {
        next(err);
    }
};

module.exports = { store, index, update, destroy, indexDetail };
