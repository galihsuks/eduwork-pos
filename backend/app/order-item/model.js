const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
    name: {
        type: String,
        minlength: [5, "Panjang nama minimal 5 karakter"],
        required: [true, "Nama harus diisi"],
    },
    price: {
        type: Number,
        required: [true, "Price harus diisi"],
    },
    qty: {
        type: Number,
        required: [true, "Qty harus diisi"],
        minlength: [1, "Panjang qty minimal 1 karakter"],
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
    },
});
module.exports = model("OrderItem", orderItemSchema);
