import { useEffect, useState } from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SlPicture } from "react-icons/sl";
import { MdOutlineChangeCircle, MdSaveAlt } from "react-icons/md";
import useMessageStore from "../../store/messageStore";
import useUserStore from "../../store/userStore";

const tagsItems = [
    "Pedas",
    "Manis",
    "Vegan",
    "Favorit",
    "Spesial",
    "Rekomendasi Chef",
    "Best Seller",
    "Sehat",
    "Dingin",
    "Hangat",
];

const categoriesItem = [
    "Makanan Berat",
    "Minuman",
    "Camilan",
    "Dessert",
    "Makanan Sehat",
];

const AdminProductDetail = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        description: "",
        category: categoriesItem[0],
        tags: [`${tagsItems[0]}`],
    });
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const navigator = useNavigate();
    const { setMessage } = useMessageStore();
    const { userToken } = useUserStore();
    const { product_id } = useParams();

    useEffect(() => {
        if (product_id) {
            (async () => {
                const fetchProduct = await fetch(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/product/${product_id}`
                );
                const productsJson = await fetchProduct.json();
                console.log(productsJson);
                if (fetchProduct.status == 200) {
                    setFormData({
                        name: productsJson.product.name,
                        price: productsJson.product.price,
                        description: productsJson.product.description,
                        category: productsJson.product.category.name,
                        tags: productsJson.product.tags.map((e) => {
                            return e.name;
                        }),
                    });
                    setImage(
                        `${import.meta.env.VITE_BACKEND_URL}/image/${
                            productsJson.product.image_url
                        }`
                    );
                }
            })();
        }
    }, []);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        for (const key in formData) {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((item) => {
                    form.append(`${key}[]`, item);
                });
            } else {
                form.append(key, formData[key]);
            }
        }
        if (imageFile) {
            form.append("image", imageFile);
        }

        (async () => {
            const responseFetch = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/product${
                    product_id ? `/${product_id}` : ""
                }`,
                {
                    method: product_id ? "put" : "post",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: form,
                }
            );
            const productJson = await responseFetch.json();
            console.log(productJson);
            if (productJson.error) {
                return setError(productJson.message);
            }
            setMessage(
                `Produk ${productJson.name} berhasil di${
                    product_id ? "update" : "tambahkan"
                }`
            );
            navigator("/admin/product");
        })();
    };

    return (
        <>
            <div className="flex justify-between gap-3 items-center">
                <div>
                    <h3 className="text-biru">Add New Product</h3>
                    <p className="text-gray-500">Complete this form</p>
                </div>
            </div>
            <hr className="my-4" />
            <div style={{ flex: 1, position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        overflowY: "auto",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 text-sm text-red-700 py-3 px-5 rounded-lg mb-3">
                                {error}
                            </div>
                        )}
                        <div className="flex gap-5">
                            <div style={{ flex: 1 }}>
                                <div className="formulir mb-4">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="formulir mb-4">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        required
                                        value={Number(formData.price)}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                price: Number(
                                                    parseInt(e.target.value)
                                                ),
                                            });
                                        }}
                                    />
                                </div>
                                <div className="formulir mb-4">
                                    <label>Description</label>
                                    <textarea
                                        required
                                        rows={1}
                                        value={formData.description}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            });
                                        }}
                                    ></textarea>
                                </div>
                                <div className="formulir mb-4">
                                    <label>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                category: e.target.value,
                                            });
                                        }}
                                    >
                                        {categoriesItem.map((c, ind_c) => (
                                            <option key={ind_c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p
                                    className="text-ungu mb-2"
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 500,
                                    }}
                                >
                                    Tags
                                </p>
                                <div className="container-tags-admin">
                                    {formData.tags.map((t, ind_t) => (
                                        <label className="item" key={ind_t}>
                                            <select
                                                value={t}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        tags: formData.tags.map(
                                                            (tag, ind_tag) => {
                                                                if (
                                                                    ind_tag ==
                                                                    ind_t
                                                                ) {
                                                                    return e
                                                                        .target
                                                                        .value;
                                                                } else
                                                                    return tag;
                                                            }
                                                        ),
                                                    });
                                                }}
                                            >
                                                {tagsItems.map((c, ind_c) => (
                                                    <option
                                                        key={ind_c}
                                                        value={c}
                                                    >
                                                        {c}
                                                    </option>
                                                ))}
                                            </select>
                                            {ind_t > 0 && (
                                                <span
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            tags: formData.tags.filter(
                                                                (
                                                                    tag,
                                                                    ind_tag
                                                                ) =>
                                                                    ind_tag !=
                                                                    ind_t
                                                            ),
                                                        });
                                                    }}
                                                >
                                                    <IoClose />
                                                </span>
                                            )}
                                        </label>
                                    ))}
                                    <div
                                        className="btn-tambah"
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                tags: [
                                                    ...formData.tags,
                                                    tagsItems[0],
                                                ],
                                            });
                                        }}
                                    >
                                        <FaPlus />
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: "250px" }}>
                                <p
                                    className="text-ungu mb-2"
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 500,
                                    }}
                                >
                                    Image
                                </p>
                                <label className="input-gambar-admin">
                                    <input
                                        style={{
                                            width: "100%",
                                            display: "none",
                                        }}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                    {image ? (
                                        <>
                                            <div className="hover-img">
                                                <MdOutlineChangeCircle
                                                    size={50}
                                                />
                                                <p>Change picture</p>
                                            </div>
                                            <img src={image} alt="Preview" />
                                        </>
                                    ) : (
                                        <>
                                            <SlPicture size={50} />
                                            <p>
                                                Click here to
                                                <br />
                                                choose photo
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <button
                                type="submit"
                                className="btn-coklat mt-5"
                                style={{ width: "300px" }}
                            >
                                <p>Save</p>
                                <MdSaveAlt />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminProductDetail;
