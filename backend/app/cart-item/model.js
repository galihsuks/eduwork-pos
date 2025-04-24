const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
    name: {
        type: String,
        minlength: [5, "Panjang nama minimal 5 karakter"],
        required: [true, "Nama harus diisi"],
    },
    qty: {
        type: Number,
        required: [true, "Qty harus diisi"],
        minlength: [1, "Panjang qty minimal 1 karakter"],
    },
    price: {
        type: Number,
        default: 0,
    },
    image_url: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
});
module.exports = model("CartItem", cartItemSchema);
