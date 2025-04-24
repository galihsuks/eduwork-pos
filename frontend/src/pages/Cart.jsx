import { useEffect, useState } from "react";
import { FaArrowRightLong, FaCheck, FaMinus, FaPlus } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useUserStore from "../../store/userStore";
import { RiDeleteBin5Line } from "react-icons/ri";

const Cart = () => {
    const { cart, setCart } = useCartStore();
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);
    const { userToken } = useUserStore();

    const fetchCart = async (body) => {
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
        setTotal(
            cartJson.reduce((prev, curr) => {
                return prev + curr.qty * curr.price;
            }, 0)
        );
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
    const handleDeleteCart = (product_id) => {
        fetchCart(cart.filter((c) => c.product_id != product_id));
    };

    useState(() => {
        setTotal(
            cart.reduce((prev, curr) => {
                return prev + curr.qty * curr.price;
            }, 0)
        );
    }, [cart]);

    return (
        <>
            <div className="page-header">
                <div className="content">
                    <div>
                        <p className="text-white font-bold">Restoqu</p>
                        {window.innerWidth < 700 ? (
                            <h1 className="text-white">
                                Your Cart
                                <br />
                                Items
                            </h1>
                        ) : (
                            <h1 className="text-white">Your Cart Items</h1>
                        )}
                    </div>
                </div>
                <img
                    src={
                        "https://images.unsplash.com/photo-1639390150902-8f1b3916e14b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    alt=""
                />
            </div>
            <div className="container mx-auto konten">
                <div
                    className={`container-cart ${
                        window.innerWidth < 700 ? "p-7 gap-5" : "p-10 gap-8"
                    }`}
                >
                    {cart.length > 0 ? (
                        <div
                            className="flex flex-col gap-2"
                            style={{ flex: 1 }}
                        >
                            {cart.map((c, ind_c) => (
                                <div key={ind_c} className="item">
                                    <Link
                                        to={`/product/${c.product_id}`}
                                        className="flex gap-4"
                                    >
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/image/${c.image_url}`}
                                            alt=""
                                        />
                                        <div className="flex flex-col justify-center">
                                            <p className="category text-gray-400">
                                                {c.product_category}
                                            </p>
                                            <p className="name">{c.name}</p>
                                            <p className="harga">
                                                Rp{" "}
                                                {c.price.toLocaleString(
                                                    "id-ID"
                                                )}{" "}
                                                x {c.qty}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex flex-col">
                                        <div
                                            style={{ flex: 1 }}
                                            className="flex flex-col items-end justify-center"
                                        >
                                            <p
                                                style={{ fontSize: "12px" }}
                                                className="text-gray-400"
                                            >
                                                Total
                                            </p>
                                            <p
                                                style={{ fontWeight: 600 }}
                                                className="text-biru"
                                            >
                                                Rp{" "}
                                                {(
                                                    c.price * c.qty
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <div className="flex gap-5 items-center">
                                            <div className="quantity">
                                                <span
                                                    className="btn"
                                                    onClick={() => {
                                                        handleReduceCart(
                                                            c.product_id
                                                        );
                                                    }}
                                                >
                                                    <FaMinus />
                                                </span>
                                                <span className="number">
                                                    {c.qty}
                                                </span>
                                                <span
                                                    className="btn"
                                                    onClick={() => {
                                                        handleAddCart(
                                                            c.product_id
                                                        );
                                                    }}
                                                >
                                                    <FaPlus />
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    width: "1px",
                                                    height: "20px",
                                                }}
                                                className="bg-biru"
                                            ></div>
                                            <button
                                                className="btn-hapus"
                                                onClick={() => {
                                                    handleDeleteCart(
                                                        c.product_id
                                                    );
                                                }}
                                            >
                                                <RiDeleteBin5Line />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{ flex: 1 }}
                            className="flex flex-col justify-center items-center"
                        >
                            <p className="mb-2">Enter your favorite item</p>
                            <Link
                                to={"/product"}
                                className="btn-outline-coklat"
                            >
                                <p>Lihat produk</p>
                                <FaArrowRightLong />
                            </Link>
                        </div>
                    )}
                    <div
                        className={`container-side-checkout ${
                            window.innerWidth < 700 ? "ps-5" : "ps-8"
                        }`}
                    >
                        <h3
                            className="text-biru mb-3"
                            style={{ fontFamily: '"Poppins", sans-serif' }}
                        >
                            SUMMARY
                        </h3>
                        <div
                            className="py-2 mb-2"
                            style={{
                                borderBlock: "1px solid gray",
                                width: "100%",
                            }}
                        >
                            {cart.length > 0 ? (
                                <table>
                                    <tbody>
                                        {cart.map((c, ind_c) => (
                                            <tr key={ind_c}>
                                                <td>
                                                    {c.name} ({c.qty})
                                                </td>
                                                <td className="harga">
                                                    Rp{" "}
                                                    {(
                                                        c.price * c.qty
                                                    ).toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p
                                    className="text-gray-500"
                                    style={{ fontSize: "12px" }}
                                >
                                    Belum ada item
                                </p>
                            )}
                        </div>
                        <table className="mb-4">
                            <tbody>
                                <tr>
                                    <td className="font-semibold">Total</td>
                                    <td className="harga">
                                        Rp {total.toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Link
                            to={"/checkout"}
                            className={`${
                                cart.length > 0 ? "btn-coklat" : "text-gray-500"
                            }`}
                            style={{
                                width: "100%",
                                pointerEvents: cart.length > 0 ? "all" : "none",
                            }}
                        >
                            <p className="text-center">Checkout</p>
                            {cart.length > 0 && <FaArrowRightLong />}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
