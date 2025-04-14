const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema(
    {
        nama: {
            type: String,
            required: [true, "Nama alamat harus diisi"],
            maxlength: [255, "Panjang alamat maksimal 255 karakter"],
        },
        kelurahan: {
            type: String,
            required: [true, "Kelurahan harus diisi"],
            maxlength: [255, "Panjang kelurahan maksimal 255 karakter"],
        },
        kecamatan: {
            type: String,
            required: [true, "Kecamatan harus diisi"],
            maxlength: [255, "Panjang kecamatan maksimal 255 karakter"],
        },
        kabupaten: {
            type: String,
            required: [true, "Kabupaten harus diisi"],
            maxlength: [255, "Panjang kabupaten maksimal 255 karakter"],
        },
        provinsi: {
            type: String,
            required: [true, "Provinsi harus diisi"],
            maxlength: [255, "Panjang provinsi maksimal 255 karakter"],
        },
        detail: {
            type: String,
            required: [true, "Detail alamat harus diisi"],
            maxlength: [1000, "Panjang detail maksimal 1000 karakter"],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);
module.exports = model("DeliveryAddress", deliveryAddressSchema);
