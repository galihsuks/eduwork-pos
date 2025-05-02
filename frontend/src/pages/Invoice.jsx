import { FaArrowRightLong, FaChevronRight } from "react-icons/fa6";
import useUserStore from "../../store/userStore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import { GoDotFill } from "react-icons/go";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";

const Invoice = () => {
    const { order_id } = useParams();
    const { userToken } = useUserStore();
    const [error, setError] = useState("");
    const navigator = useNavigate();
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        (async () => {
            const fetchInvoice = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/invoice/${order_id}`,
                {
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-type": "application/json",
                    },
                }
            );
            const resInvoice = await fetchInvoice.json();
            console.log("respons invoice");
            console.log(resInvoice);
            if (resInvoice.error) {
                setError(resInvoice.message);
                return;
            }
            setInvoice(resInvoice);
        })();
    }, []);

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
    function formatDateInv(input) {
        const date = new Date(input);
        const month = String(date.getMonth()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${year}`;
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

    const handleSudahBayar = async () => {
        const responseFetch = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/order/${
                invoice.order._id
            }`,
            {
                method: "put",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    status: "processing",
                }),
            }
        );
        const sudahBayar = await responseFetch.json();
        if (sudahBayar.error) {
            return setError(sudahBayar.message);
        }
        setInvoice({
            ...invoice,
            payment_status: "paid",
            order: {
                ...invoice.order,
                status: "processing",
            },
        });
    };

    return (
        <>
            <div className="page-header" style={{ minHeight: "200px" }}>
                <div className="content" style={{ minHeight: "200px" }}>
                    <div>
                        <h1 className="text-white">Invoice</h1>
                        {invoice && (
                            <p className="text-white font-semibold">
                                #{`0000${invoice.order.order_number}`.slice(-5)}
                            </p>
                        )}
                    </div>
                </div>
                <img
                    style={{ minHeight: "200px" }}
                    className=""
                    src="https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                />
            </div>
            {invoice ? (
                <>
                    <div className="konten">
                        <div className="container mx-auto py-7">
                            <p
                                className="text-center"
                                style={{ fontSize: "13px" }}
                            >
                                {`0000${invoice.order.order_number}`.slice(-5)}
                                /INV/RESTOQU/
                                {formatDateInv(invoice.createdAt)}
                            </p>
                            <hr className="my-3" />
                            <div className="container-invoice">
                                <div style={{ flex: 1 }}>
                                    <p
                                        className="text-gray-500"
                                        style={{ fontSize: "12px" }}
                                    >
                                        Dibuat pada
                                    </p>
                                    <div className="mb-3 flex items-center gap-2">
                                        <p>
                                            {
                                                formatDate(invoice.createdAt)
                                                    .tanggal
                                            }
                                        </p>
                                        <GoDotFill />
                                        <p>
                                            {
                                                formatDate(invoice.createdAt)
                                                    .waktu
                                            }
                                        </p>
                                    </div>
                                    <div className="flex w-full mb-3">
                                        <div style={{ flex: 1 }}>
                                            <p
                                                className="text-gray-500"
                                                style={{
                                                    fontSize: "12px",
                                                }}
                                            >
                                                Total tagihan
                                            </p>
                                            <h3
                                                style={{
                                                    fontFamily:
                                                        '"Poppins", sans-serif',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Rp{" "}
                                                {invoice.total.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </h3>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p
                                                className="text-gray-500 mb-1"
                                                style={{
                                                    fontSize: "12px",
                                                }}
                                            >
                                                Status pembayaran
                                            </p>
                                            <div
                                                className={`font-semibold px-3 py-1 ${generateColorStatus(
                                                    invoice.order.status
                                                )}`}
                                                style={{
                                                    width: "fit-content",
                                                    borderRadius: "3em",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {invoice.order.status.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p
                                        className="text-gray-500"
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    >
                                        Nomor Virtual Account
                                    </p>
                                    <h3
                                        style={{
                                            fontFamily: '"Poppins", sans-serif',
                                            fontWeight: 600,
                                        }}
                                    >
                                        0001234567
                                    </h3>
                                    <p
                                        style={{ fontSize: "12px" }}
                                        className="text-gray-400"
                                    >
                                        *Lakukan pembayaran dan kirimkan bukti
                                        pembayaran melalui WhatsApp{" "}
                                        <a
                                            href="https://wa.me/+6212345678s"
                                            style={{ color: "var(--ungu)" }}
                                        >
                                            Customer Service kami
                                        </a>
                                    </p>
                                    {invoice.payment_status ==
                                        "waiting_payment" && (
                                        <button
                                            className="btn-outline-coklat mt-5"
                                            onClick={() => {
                                                handleSudahBayar();
                                            }}
                                        >
                                            <p>Saya sudah bayar</p>
                                            <MdOutlinePayments />
                                        </button>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h5 className={`font-semibold text-biru`}>
                                        Alamat tujuan
                                    </h5>
                                    <p
                                        className="text-gray-500 mb-2"
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
                                                            invoice
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
                                                            invoice
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
                                                            invoice
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
                                                            invoice
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
                                                            invoice
                                                                .delivery_address
                                                                .provinsi
                                                        }
                                                    </b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <hr className="mt-3 mb-4" />
                                    <h5 className={`font-semibold text-biru`}>
                                        Order Items
                                    </h5>
                                    <p
                                        className="text-gray-500 mb-2"
                                        style={{ fontSize: "12px" }}
                                    >
                                        Product yang Anda pesan
                                    </p>
                                    <table style={{ fontSize: "13px" }}>
                                        <tbody>
                                            {invoice.order.order_items.map(
                                                (c, ind_c) => (
                                                    <tr key={ind_c}>
                                                        <td className="pe-5 pb-1 text-gray-500">
                                                            {c.name} ({c.qty})
                                                        </td>
                                                        <td className="pb-1 text-biru">
                                                            Rp{" "}
                                                            {(
                                                                c.price * c.qty
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
                    </div>
                </>
            ) : (
                <>
                    <div
                        style={{ flex: 1 }}
                        className="flex justify-center items-center"
                    >
                        {error ? (
                            <>
                                <p>{error}</p>
                            </>
                        ) : (
                            <p>Loading ...</p>
                        )}
                    </div>
                </>
            )}
        </>
    );
};
export default Invoice;
