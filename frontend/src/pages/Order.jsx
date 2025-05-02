import { FaArrowRightLong, FaChevronRight } from "react-icons/fa6";
import useUserStore from "../../store/userStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import { GoDotFill } from "react-icons/go";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const Order = () => {
    const { userName, userEmail, userToken, emptyUser } = useUserStore();
    const [error, setError] = useState("");
    const navigator = useNavigate();
    const { setCart } = useCartStore();
    const [order, setOrder] = useState([]);

    useEffect(() => {
        (async () => {
            const fetchOrder = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/order`,
                {
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-type": "application/json",
                    },
                }
            );
            const resOrder = await fetchOrder.json();
            if (resOrder.error) {
                setError(resOrder.message);
                return;
            }
            setOrder(
                resOrder.data.map((o) => {
                    return {
                        ...o,
                        expand: false,
                    };
                })
            );
        })();
    }, []);

    useEffect(() => {
        console.log(order);
    }, [order]);

    const handleLogout = () => {
        (async () => {
            const fetchAuth = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
                {
                    method: "post",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-type": "application/json",
                    },
                }
            );
            const authJson = await fetchAuth.json();
            if (authJson.error) {
                setError(authJson.message);
                return;
            }
            emptyUser();
            setCart([]);
            navigator("/login");
        })();
    };

    function formatDate(input) {
        const date = new Date(input);
        const day = String(date.getDate()).padStart(2, "0");
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return {
            tanggal: `${day} ${month} ${year}`,
            waktu: `${hours}:${minutes}`,
        };
    }

    const generateColorStatus = (status) => {
        switch (status) {
            case "waiting_payment":
                return "bg-sky-300 text-sky-900";
            case "processing":
                return "bg-amber-300 text-amber-900";
            case "in_delivery":
                return "bg-orange-300 text-orange-900";
            case "delivered":
                return "bg-green-300 text-green-900";
            default:
                return "bg-red-500";
        }
    };

    return (
        <>
            <div className="page-header">
                <div className="content">
                    <div>
                        <p className="text-white font-bold">Your</p>
                        <h1 className="text-white">Orders</h1>
                    </div>
                </div>
                <img
                    className=""
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=962&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                />
            </div>
            <div className="konten">
                <div className="container mx-auto py-7">
                    <div className="container-account">
                        <div
                            className={`sidebar-account ${
                                window.innerWidth <= 700
                                    ? "mb-5 gap-7"
                                    : "pe-10 gap-2"
                            }`}
                        >
                            <Link
                                to={"/account"}
                                className="btn-teks-aja"
                                style={{ color: "gray" }}
                            >
                                My Account
                            </Link>
                            <Link to={"/order"} className="btn-teks-aja">
                                My Orders
                            </Link>
                            {window.innerWidth > 700 && (
                                <button
                                    className="btn-coklat mt-4"
                                    onClick={() => {
                                        handleLogout();
                                    }}
                                >
                                    <p>LOGOUT</p>
                                    <FaArrowRightLong />
                                </button>
                            )}
                        </div>
                        <div
                            className={`container-order ${
                                window.innerWidth <= 700 ? "" : "ps-10"
                            }`}
                        >
                            {order.map((o, ind_o) => (
                                <div
                                    key={ind_o}
                                    className={`item ${
                                        ind_o != 0 ? "no-first pt-5 mt-5" : ""
                                    }`}
                                >
                                    <div
                                        className="flex justify-between gap-5 items-center"
                                        style={{ position: "relative" }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                width: "100%",
                                                height: "0",
                                                left: 0,
                                                bottom: 0,
                                            }}
                                            className="bg-red-500 flex justify-center"
                                        >
                                            <div
                                                className="arrow-expand"
                                                onClick={() =>
                                                    setOrder(
                                                        order.map((e) => {
                                                            if (
                                                                e._id == o._id
                                                            ) {
                                                                return {
                                                                    ...e,
                                                                    expand: !e.expand,
                                                                };
                                                            } else return e;
                                                        })
                                                    )
                                                }
                                            >
                                                <p>
                                                    {o.expand
                                                        ? "Hide detail"
                                                        : "Show detail"}
                                                </p>
                                                {o.expand ? (
                                                    <IoChevronUp />
                                                ) : (
                                                    <IoChevronDown />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                className="mb-1 flex items-center gap-2 text-gray-500"
                                                style={{ fontSize: "12px" }}
                                            >
                                                <p>
                                                    {
                                                        formatDate(o.createdAt)
                                                            .tanggal
                                                    }
                                                </p>
                                                <GoDotFill />
                                                <p>
                                                    {
                                                        formatDate(o.createdAt)
                                                            .waktu
                                                    }
                                                </p>
                                            </div>
                                            <h3
                                                className="text-biru mb-1"
                                                style={{
                                                    fontFamily:
                                                        '"Poppins", sans-serif',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Rp{" "}
                                                {o.total_payment.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </h3>
                                            <p
                                                style={{ fontSize: "12px" }}
                                                className="text-ungu"
                                            >
                                                #
                                                {`0000${o.order_number}`.slice(
                                                    -5
                                                )}
                                            </p>
                                        </div>
                                        <div
                                            style={{ height: "100%" }}
                                            className="flex flex-col items-end"
                                        >
                                            <div
                                                className={`status ${generateColorStatus(
                                                    o.status
                                                )}`}
                                            >
                                                {o.status.replace("_", " ")}
                                            </div>
                                            <Link
                                                to={`/invoice/${o._id}`}
                                                className="btn-teks-aja"
                                            >
                                                <p>Invoice</p>
                                                <FaChevronRight />
                                            </Link>
                                        </div>
                                    </div>
                                    <div
                                        className={`container-expand ${
                                            o.expand ? "py-3" : ""
                                        } gap-3 ${o.expand ? "expand" : ""}`}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <h5
                                                className={`font-semibold text-biru`}
                                            >
                                                Alamat tujuan
                                            </h5>
                                            <p
                                                className="text-gray-500 mb-3"
                                                style={{ fontSize: "12px" }}
                                            >
                                                Pengiriman akan dikirim ke
                                            </p>
                                            <table style={{ fontSize: "13px" }}>
                                                <tbody>
                                                    <tr>
                                                        <td className="pe-5 pb-1 text-gray-500">
                                                            Detail
                                                        </td>
                                                        <td className="pb-1 text-biru">
                                                            :{" "}
                                                            <b>
                                                                {
                                                                    o
                                                                        .delivery_address
                                                                        .detail
                                                                }
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="pe-5 pb-1 text-gray-500">
                                                            kelurahan
                                                        </td>
                                                        <td className="pb-1 text-biru">
                                                            :{" "}
                                                            <b>
                                                                {
                                                                    o
                                                                        .delivery_address
                                                                        .kelurahan
                                                                }
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="pe-5 pb-1 text-gray-500">
                                                            Kecamatan
                                                        </td>
                                                        <td className="pb-1 text-biru">
                                                            :{" "}
                                                            <b>
                                                                {
                                                                    o
                                                                        .delivery_address
                                                                        .kecamatan
                                                                }
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="pe-5 pb-1 text-gray-500">
                                                            Kabupaten
                                                        </td>
                                                        <td className="pb-1 text-biru">
                                                            :{" "}
                                                            <b>
                                                                {
                                                                    o
                                                                        .delivery_address
                                                                        .kabupaten
                                                                }
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="pe-5 pb-1 text-gray-500">
                                                            Provinsi
                                                        </td>
                                                        <td className="pb-1 text-biru">
                                                            :{" "}
                                                            <b>
                                                                {
                                                                    o
                                                                        .delivery_address
                                                                        .provinsi
                                                                }
                                                            </b>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h5
                                                className={`font-semibold text-biru`}
                                            >
                                                Order Items
                                            </h5>
                                            <p
                                                className="text-gray-500 mb-3"
                                                style={{ fontSize: "12px" }}
                                            >
                                                Product yang Anda pesan
                                            </p>
                                            <table style={{ fontSize: "13px" }}>
                                                <tbody>
                                                    {o.order_items.map(
                                                        (c, ind_c) => (
                                                            <tr key={ind_c}>
                                                                <td className="pe-5 pb-1 text-gray-500">
                                                                    {c.name} (
                                                                    {c.qty})
                                                                </td>
                                                                <td className="pb-1 text-biru">
                                                                    Rp{" "}
                                                                    {(
                                                                        c.price *
                                                                        c.qty
                                                                    ).toLocaleString(
                                                                        "id-ID"
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {window.innerWidth <= 700 && (
                            <button
                                className="btn-coklat mt-5"
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                <p>LOGOUT</p>
                                <FaArrowRightLong />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Order;
