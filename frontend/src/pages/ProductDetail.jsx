import { useEffect, useState } from "react";
import { FaArrowRightLong, FaCheck, FaMinus, FaPlus } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useUserStore from "../../store/userStore";

const ProductDetail = () => {
    const { id: id_product } = useParams();
    const [product, setProduct] = useState();
    const [products, setProducts] = useState([]);
    const { cart, setCart } = useCartStore();
    const { userToken } = useUserStore();
    const [itemCart, setItemCart] = useState({});
    const [error, setError] = useState("");
    const navigator = useNavigate();

    useEffect(() => {
        (async () => {
            const fetchProduct = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/${id_product}`
            );
            const productsJson = await fetchProduct.json();
            console.log(productsJson);
            if (fetchProduct.status == 200) {
                setProduct(productsJson.product);
                setProducts(productsJson.products);
            }
        })();
    }, [id_product]);

    const limitingProducts = () => {
        const widhtWindow = window.innerWidth;
        if (widhtWindow <= 500) {
            console.log(`limit : 4`);
            return 4;
        }
        if (widhtWindow <= 700) {
            console.log(`limit : 3`);
            return 3;
        }
        if (widhtWindow <= 850) {
            console.log(`limit : 4`);
            return 4;
        }
        console.log(`limit : 5`);
        return 5;
    };

    const fetchCart = async (body) => {
        console.log();
        if (!userToken) return navigator("/login");
        const responseFetch = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
                method: "put",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    items: body,
                }),
            }
        );
        const cartJson = await responseFetch.json();
        if (cartJson.error) {
            return setError(cartJson.message);
        }
        setCart(cartJson);
    };

    const handleAddCart = (product_id) => {
        const productSelected = cart.find((c) => c.product_id == product_id);
        if (productSelected) {
            fetchCart(
                cart.map((c) => {
                    if (c.product_id == product_id) {
                        return {
                            ...c,
                            qty: c.qty + 1,
                        };
                    } else return c;
                })
            );
        } else {
            fetchCart([
                ...cart,
                {
                    product_id,
                    qty: 1,
                },
            ]);
        }
    };
    const handleReduceCart = (product_id) => {
        const productSelected = cart.find((c) => c.product_id == product_id);
        if (productSelected.qty - 1 > 0) {
            fetchCart(
                cart.map((c) => {
                    if (c.product_id == product_id) {
                        return {
                            ...c,
                            qty: c.qty - 1,
                        };
                    } else return c;
                })
            );
        } else {
            fetchCart(cart.filter((c) => c.product_id != product_id));
        }
    };

    useEffect(() => {
        if (product) setItemCart(cart.find((c) => c.product_id == product._id));
    }, [cart, product]);

    return (
        <>
            {product && (
                <>
                    <div className="page-header">
                        <div className="content">
                            <div>
                                <p className="text-white font-bold">Restoqu</p>
                                <h1 className="text-white">
                                    {product.category.name}
                                </h1>
                            </div>
                        </div>
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/image/${
                                product.image_url
                            }`}
                            alt=""
                        />
                    </div>
                    <div className="container mx-auto">
                        <div
                            className={`container-detail-product ${
                                window.innerWidth < 700
                                    ? "p-7 gap-5"
                                    : "p-10 gap-8"
                            }`}
                        >
                            <div className="gambar">
                                <img
                                    src={`${
                                        import.meta.env.VITE_BACKEND_URL
                                    }/image/${product.image_url}`}
                                    alt=""
                                />
                            </div>
                            <div className="detail">
                                <h1 className="nama mb-1">{product.name}</h1>
                                <p
                                    className="text-gray-500 mb-2"
                                    style={{ fontSize: "12px" }}
                                >
                                    Product code : {product._id}
                                </p>
                                <span
                                    className="flex gap-2 mb-5 bg-ungu text-white py-1 px-4 items-center"
                                    style={{
                                        width: "fit-content",
                                        borderRadius: "3em",
                                        fontSize: "small",
                                    }}
                                >
                                    <FaCheck />
                                    <p style={{ textWrap: "nowrap" }}>
                                        In stock
                                    </p>
                                </span>
                                <p className="desc">{product.description}</p>
                                <div
                                    style={{ flex: 1 }}
                                    className="flex items-center"
                                ></div>
                                <hr className="w-50 mt-5" />
                                <h2 className="harga my-3">
                                    Rp {product.price.toLocaleString("id-ID")}
                                </h2>

                                {error && (
                                    <div className="message mb-5">{error}</div>
                                )}
                                {itemCart ? (
                                    <div className="quantity">
                                        <span
                                            className="btn"
                                            onClick={() => {
                                                handleReduceCart(product._id);
                                            }}
                                        >
                                            <FaMinus />
                                        </span>
                                        <span className="number">
                                            {itemCart.qty}
                                        </span>
                                        <span
                                            className="btn"
                                            onClick={() => {
                                                handleAddCart(product._id);
                                            }}
                                        >
                                            <FaPlus />
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        className="btn-outline-coklat"
                                        onClick={() => {
                                            handleAddCart(product._id);
                                        }}
                                    >
                                        <p>ADD TO CART</p>
                                        <IoCartOutline />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {products.length > 0 && (
                <div className="container mx-auto py-7">
                    <div className="sub-section mb-1">
                        <div className="icon">
                            <img
                                src="/img/restoqu-logo-r-white-little.png"
                                alt=""
                            />
                        </div>
                        <p>Menu</p>
                    </div>
                    <h3 className="text-biru">Explore Our Menu</h3>

                    <div className="container-product gap-5 my-5">
                        {products.map(
                            (item, index) =>
                                index < limitingProducts() && (
                                    <Link
                                        to={`/product/${item._id}`}
                                        key={index}
                                        className="item"
                                    >
                                        <div className="gambar mb-2">
                                            <div className="content flex flex-col">
                                                {item.tags.some(
                                                    (tag) =>
                                                        tag.name === "Favorit"
                                                ) && (
                                                    <div className="flex justify-end">
                                                        <div className="fav">
                                                            <p>Favorite</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <img
                                                src={`${
                                                    import.meta.env
                                                        .VITE_BACKEND_URL
                                                }/image/${item.image_url}`}
                                                alt=""
                                            />
                                        </div>
                                        <p className="nama">{item.name}</p>
                                        <p className="harga">
                                            Rp{" "}
                                            {item.price.toLocaleString("id-ID")}
                                        </p>
                                    </Link>
                                )
                        )}
                    </div>
                    <div className="flex justify-center w-full">
                        <Link to={"/product"} className="btn-outline-coklat">
                            <p>Lihat produk</p>
                            <FaArrowRightLong />
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetail;
