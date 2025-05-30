const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

const userSchema = Schema(
    {
        full_name: {
            type: String,
            required: [true, "Nama harus diisi"],
            minlength: [3, "Panjang nama minimal 3 karakter"],
            maxlength: [255, "Panjang nama maksimal 255 karakter"],
        },
        customer_id: {
            type: Number,
        },
        email: {
            type: String,
            required: [true, "Email harus diisi"],
            maxlength: [255, "Panjang email maksimal 255 karakter"],
        },
        password: {
            type: String,
            required: [true, "Password harus diisi"],
            maxlength: [255, "Panjang password maksimal 255 karakter"],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        token: [String],
    },
    { timestamps: true }
);

userSchema.path("email").validate(
    function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    (attr) => `${attr.value} harus email yang valid!`
);

userSchema.path("email").validate(
    async function (value) {
        try {
            const count = await this.model("User").countDocuments({
                email: value,
            });
            return !count;
        } catch (err) {
            throw err;
        }
    },
    (attr) => `${attr.value} sudah terdaftar!`
);

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchema);
