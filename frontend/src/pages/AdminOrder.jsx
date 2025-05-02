import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import useUserStore from "../../store/userStore";
import { Link } from "react-router-dom";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";

const statusArr = ["waiting_payment", "processing", "in_delivery", "delivered"];

const AdminOrder = () => {
    const { userToken } = useUserStore();
    const [pesan, setPesan] = useState("");
    const [orders, setOrders] = useState([]);
    const [orderSelected, setOrderSelected] = useState(null);
    const [alert, setAlert] = useState({
        teks: "",
        show: false,
        value: "",
    });

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
                setPesan(resOrder.message);
                return;
            }
            setOrders(resOrder.data);
        })();
    }, []);

    useEffect(() => {
        console.log(orderSelected);
    }, [orderSelected]);

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

    const handleUpdateStatus = (value) => {
        (async () => {
            const fetchOrder = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/${
                    orderSelected._id
                }`,
                {
                    method: "put",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ status: value }),
                }
            );
            const resOrder = await fetchOrder.json();
            if (resOrder.error) {
                setPesan(resOrder.message);
                return;
            }
            setPesan(
                `Status order ${`0000${orderSelected.order_number}`.slice(
                    -5
                )} telah diupdate`
            );
            setOrders(
                orders.map((o) => {
                    if (o._id == orderSelected._id) {
                        return {
                            ...o,
                            status: value,
                        };
                    } else return o;
                })
            );
            setAlert({ ...alert, show: false });
            setOrderSelected(null);
        })();
    };
    return (
        <>
            {alert && (
                <Alert
                    teks={alert.teks}
                    show={alert.show}
                    cancel={() => {
                        setAlert({ ...alert, show: false });
                    }}
                    action={() => {
                        handleUpdateStatus(alert.value);
                    }}
                />
            )}
            <div
                className={`modal-order-admin py-7 ${
                    orderSelected ? "show px-10" : ""
                }`}
            >
                <h3 className="text-ungu">Detail Order</h3>
                {orderSelected && (
                    <>
                        <p className="text-biru mb-2">
                            #{`0000${orderSelected.order_number}`.slice(-5)}
                        </p>

                        <div className="container-tags-admin">
                            <label className="item">
                                <select
                                    value={orderSelected.status}
                                    onChange={(e) => {
                                        setAlert({
                                            teks: `Status order ${`#${`0000${orderSelected.order_number}`.slice(
                                                -5
                                            )}`} akan diubah menjadi ${e.target.value.replace(
                                                "_",
                                                " "
                                            )}?`,
                                            show: true,
                                            value: e.target.value,
                                        });
                                        // handleUpdateStatus(e.target.value);
                                    }}
                                >
                                    {statusArr.map((c, ind_c) => (
                                        <option key={ind_c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <span>
                                    <IoChevronDown />
                                </span>
                            </label>
                        </div>

                        <h5 className={`font-semibold text-biru mt-4`}>
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
                                                orderSelected.delivery_address
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
                                                orderSelected.delivery_address
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
                                                orderSelected.delivery_address
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
                                                orderSelected.delivery_address
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
                                                orderSelected.delivery_address
                                                    .provinsi
                                            }
                                        </b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h5 className={`font-semibold text-biru mt-4`}>
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
                                {orderSelected.order_items.map((c, ind_c) => (
                                    <tr key={ind_c}>
                                        <td className="pe-5 pb-1 text-gray-500">
                                            {c.name} ({c.qty})
                                        </td>
                                        <td className="pb-1 text-biru text-end">
                                            Rp{" "}
                                            {(c.price * c.qty).toLocaleString(
                                                "id-ID"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between gap-2 items-center mt-3">
                            <button
                                className="btn-teks-aja"
                                onClick={() => {
                                    setOrderSelected(null);
                                }}
                            >
                                <FaArrowLeftLong />
                                <p>Close</p>
                            </button>
                            <Link
                                to={`/invoice/${orderSelected._id}`}
                                className="btn-teks-aja"
                            >
                                <p>Invoice</p>
                                <FaArrowRightLong />
                            </Link>
                        </div>
                    </>
                )}
            </div>
            <div className="flex justify-between gap-3 items-center">
                <div>
                    <h1 className="text-biru">Our Orders</h1>
                    <p className="text-gray-500">Order management</p>
                </div>
            </div>
            <hr className="my-4" />
            <div style={{ flex: 1, position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {pesan && (
                        <div className="bg-green-100 text-sm text-green-700 py-3 px-5 rounded-lg mb-3">
                            {pesan}
                        </div>
                    )}
                    <div
                        className="mb-3"
                        style={{ flex: 1, position: "relative" }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                overflowY: "scroll",
                            }}
                        >
                            <table className="table-admin">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Customer</th>
                                        <th style={{ textAlign: "center" }}>
                                            Tanggal
                                        </th>
                                        <th
                                            style={{
                                                textWrap: "nowrap",
                                                textAlign: "center",
                                            }}
                                        >
                                            Order Number
                                        </th>
                                        <th
                                            style={{
                                                textWrap: "nowrap",
                                                textAlign: "center",
                                            }}
                                        >
                                            Total payment
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o, ind_o) => (
                                        <tr
                                            onClick={() => {
                                                setOrderSelected(o);
                                            }}
                                            key={ind_o}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>{ind_o + 1}</td>
                                            <td>
                                                <div>
                                                    <p className="font-semibold">
                                                        {o.user.full_name}
                                                    </p>
                                                    <p
                                                        className="text-gray-500"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {o.user.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td
                                                align="center"
                                                style={{ textWrap: "nowrap" }}
                                            >
                                                {
                                                    formatDate(o.createdAt)
                                                        .tanggal
                                                }
                                            </td>
                                            <td align="center">
                                                #
                                                {`0000${o.order_number}`.slice(
                                                    -5
                                                )}
                                            </td>
                                            <td
                                                align="center"
                                                style={{ textWrap: "nowrap" }}
                                            >
                                                Rp{" "}
                                                {o.total_payment.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </td>
                                            <td align="center">
                                                <div
                                                    style={{
                                                        textWrap: "nowrap",
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                        width: "fit-content",
                                                        borderRadius: "3em",
                                                    }}
                                                    className={` py-1 px-3 ${generateColorStatus(
                                                        o.status
                                                    )}`}
                                                >
                                                    {o.status.replace("_", " ")}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminOrder;
