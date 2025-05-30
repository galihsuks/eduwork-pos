const User = require("../user/model");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils");

const register = async (req, res, next) => {
    try {
        const payload = req.body;
        const user = new User(payload);
        await user.save();
        return res.json(user);
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

const localStrategy = async (email, password, done) => {
    try {
        const user = await User.findOne({ email }).select(
            "-__v -createdAt -updatedAt -cart_items -token"
        );
        if (!user) return done();
        if (bcrypt.compareSync(password, user.password)) {
            const { password, ...userWithoutPassword } = user.toJSON();
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null);
    }
    done();
};

const login = (req, res, next) => {
    passport.authenticate("local", async function (err, user) {
        if (err) return next(err);
        if (!user)
            return res.json({
                error: 1,
                message: "Email or Password incorrect",
            });
        let signed = jwt.sign(user, config.secretKey);
        await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
        res.json({
            message: "Login successfully",
            user,
            token: signed,
        });
    })(req, res, next);
};

const logout = async (req, res, next) => {
    let token = getToken(req);
    let user = await User.findOneAndUpdate(
        { token: { $in: [token] } },
        { $pull: { token: token } },
        { useFindAndModify: false }
    );
    if (!token || !user) {
        return res.json({
            error: 1,
            message: "No user found!!",
        });
    }

    return res.json({
        error: 0,
        message: "Logout berhasil",
    });
};

const me = (req, res, next) => {
    if (!req.user) {
        return res.json({
            err: 1,
            message: `You're not login or token expired`,
        });
    }
    res.json(req.user);
};

module.exports = { register, login, localStrategy, logout, me };
