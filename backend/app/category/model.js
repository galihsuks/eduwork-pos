const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const categorySchema = Schema({
    name: {
        type: String,
        minlength: [3, "Panjang nama minimal 3 karakter"],
        maxlength: [20, "Panjang nama maksimal 29 karakter"],
        required: [true, "Nama kategori harus diisi"],
    },
});
module.exports = model("Category", categorySchema);
