const DeliveryAddress = require("./model");
const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils");

const store = async (req, res, next) => {
    try {
        let payload = req.body;
        let user = req.user;
        let address = await DeliveryAddress({ ...payload, user: user._id });
        await address.save();
        return res.json(address);
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
        // body = {
        //     nama, kelurahan, kecamatan, kabupaten, provinsi, detail
        // }
        let { id } = req.params;
        let address = await DeliveryAddress.findById(id);
        let subjectAddress = subject("DeliveryAddress", {
            ...address,
            user_id: address.user,
        });
        let policy = policyFor(req.user);
        if (!policy.can("update", subjectAddress)) {
            return res.json({
                error: 1,
                message: `You're not allowed to modify this resource`,
            });
        }
        address = await DeliveryAddress.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        return res.json(address);
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
        console.log("ini destroy deliv addarsae");
        const { id } = req.params;
        let address = await DeliveryAddress.findById(id);
        console.log(address);
        let subjectAddress = subject("DeliveryAddress", {
            ...address,
            user_id: address.user,
        });
        let policy = policyFor(req.user);
        if (!policy.can("delete", subjectAddress)) {
            return res.json({
                error: 1,
                message: `You're not allowed to modify this resource`,
            });
        }
        address = await DeliveryAddress.findByIdAndDelete(req.params.id);
        return res.json(address);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
const index = async (req, res, next) => {
    try {
        let user = req.user;
        let { skip = 0, limit = 10 } = req.query;
        let count = await DeliveryAddress.find({
            user: user._id,
        }).countDocuments();
        const addresses = await DeliveryAddress.find({ user: user._id })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .sort("-createdAt");
        return res.json({ data: addresses, count });
    } catch (err) {
        next(err);
    }
};

module.exports = { store, update, index, destroy };
