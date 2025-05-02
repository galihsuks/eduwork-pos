import { useEffect, useState } from "react";
import {
    FaArrowRightLong,
    FaCheck,
    FaChevronLeft,
    FaMinus,
    FaPlus,
} from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useUserStore from "../../store/userStore";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineEditLocation } from "react-icons/md";

const Checkout = () => {
    const { cart, setCart } = useCartStore();
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);
    const { userToken, userName, userEmail } = useUserStore();
    const navigator = useNavigate();
    const [provinsi, setProvinsi] = useState([]);
    const [kabupaten, setKabupaten] = useState([]);
    const [kecamatan, setKecamatan] = useState([]);
    const [kelurahan, setKelurahan] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [formDataAlamat, setFormDataAlamat] = useState({
        kelurahan: "",
        kecamatan: "",
        kabupaten: "",
        provinsi: "",
        detail: "",
        kodepos: "",
    });
    const [formActive, setFormActive] = useState(false);
    const [formDataOrder, setFormDataOrder] = useState({
        delivery_fee: 15000,
        delivery_address: "",
    });
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [editAlamat, setEditAlamat] = useState(null);

    useState(() => {
        if (editAlamat) {
            setFormActive(true);
        }
    }, [editAlamat]);

    useEffect(() => {
        if (formActive && provinsi.length == 0) {
            (async () => {
                setLoadingAddress(true);
                const fetchProvinsi = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/ext/provinsi`
                );
                const resProvinsi = await fetchProvinsi.json();
                console.log(resProvinsi);
                setLoadingAddress(false);
                setProvinsi(resProvinsi.rajaongkir.results);
            })();
        }
        if (!editAlamat) {
            setFormDataAlamat({
                provinsi: "",
                kabupaten: "",
                kecamatan: "",
                kelurahan: "",
                detail: "",
                kodepos: "",
            });
        } else {
            console.log(editAlamat);
            setFormDataAlamat({
                provinsi: editAlamat.provinsi,
                kabupaten: editAlamat.kabupaten,
                kecamatan: editAlamat.kecamatan,
                kelurahan: editAlamat.kelurahan,
                detail: editAlamat.detail,
                kodepos: editAlamat.nama.slice(-5),
            });
        }
        setKabupaten([]);
        setKecamatan([]);
        setKelurahan([]);
        if (!formActive) setEditAlamat(null);
    }, [formActive]);

    useEffect(() => {
        if (cart.length == 0) navigator("/product");
        (async () => {
            const resAddresses = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/delivery-address`,
                {
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-type": "application/json",
                    },
                }
            );
            const resAddressesJson = await resAddresses.json();
            console.log(resAddressesJson);
            setAddresses(resAddressesJson.data);
        })();
    }, []);

    useState(() => {
        setTotal(
            cart.reduce((prev, curr) => {
                return prev + curr.qty * curr.price;
            }, 0) + formDataOrder.delivery_fee
        );
    }, [cart]);

    useEffect(() => {
        if (formDataAlamat.provinsi && !editAlamat) {
            setKabupaten([]);
            setKecamatan([]);
            setKelurahan([]);
            setFormDataAlamat({
                ...formDataAlamat,
                kabupaten: "",
                kecamatan: "",
                kelurahan: "",
            });
            (async () => {
                setLoadingAddress(true);
                const fetchKbupaten = await fetch(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/ext/kabupaten?provinsi=${formDataAlamat.provinsi}`
                );
                const resKabupaten = await fetchKbupaten.json();
                setLoadingAddress(false);
                setKabupaten(resKabupaten.rajaongkir.results);
            })();
        }
    }, [formDataAlamat.provinsi]);
    useEffect(() => {
        if (formDataAlamat.kabupaten && !editAlamat) {
            setKecamatan([]);
            setKelurahan([]);
            setFormDataAlamat({
                ...formDataAlamat,
                kecamatan: "",
                kelurahan: "",
            });
            (async () => {
                setLoadingAddress(true);
                const fetchKecamatan = await fetch(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/ext/kecamatan?kabupaten=${formDataAlamat.kabupaten}`
                );
                const resKecamatan = await fetchKecamatan.json();
                setLoadingAddress(false);
                setKecamatan(resKecamatan.rajaongkir.results);
            })();
        }
    }, [formDataAlamat.kabupaten]);
    useEffect(() => {
        if (formDataAlamat.kecamatan && !editAlamat) {
            setKelurahan([]);
            setFormDataAlamat({
                ...formDataAlamat,
                kelurahan: "",
            });
            (async () => {
                setLoadingAddress(true);
                const fetchKelurahan = await fetch(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/ext/kelurahan?kecamatan=${encodeURI(
                        formDataAlamat.kecamatan
                    )}`
                );
                const resKelurahan = await fetchKelurahan.json();
                setLoadingAddress(false);
                setKelurahan(resKelurahan);
            })();
        }
    }, [formDataAlamat.kecamatan]);

    const handleDeleteAddress = (idAddress) => {
        (async () => {
            const fetchAddress = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/delivery-address/${idAddress}`,
                {
                    method: "delete",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-type": "application/json",
                    },
                }
            );
            const resAddress = await fetchAddress.json();
            if (resAddress.error) {
                return setError(resAddress.message);
            }
            setAddresses(addresses.filter((a) => a._id != idAddress));
            setFormDataOrder({
                ...formDataOrder,
                delivery_address:
                    idAddress == formDataOrder.delivery_address
                        ? ""
                        : formDataOrder.delivery_address,
            });
        })();
    };

    const handleSubmitAddress = (e) => {
        e.preventDefault();
        if (editAlamat) {
            (async () => {
                const fetchAddress = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/delivery-address/${
                        editAlamat._id
                    }`,
                    {
                        method: "put",
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            nama: `${formDataAlamat.detail} ${formDataAlamat.kelurahan}, ${formDataAlamat.kecamatan}, ${formDataAlamat.kabupaten}, ${formDataAlamat.provinsi} ${formDataAlamat.kodepos}`,
                            kelurahan: formDataAlamat.kelurahan,
                            kecamatan: formDataAlamat.kecamatan,
                            kabupaten: formDataAlamat.kabupaten,
                            provinsi: formDataAlamat.provinsi,
                            detail: formDataAlamat.detail,
                        }),
                    }
                );
                const resAddress = await fetchAddress.json();
                if (resAddress.error) {
                    return setError(resAddress.message);
                }
                console.log(resAddress);
                setAddresses(
                    addresses.map((a) => {
                        if (a._id == editAlamat._id) {
                            return {
                                ...a,
                                nama: `${formDataAlamat.detail} ${formDataAlamat.kelurahan}, ${formDataAlamat.kecamatan}, ${formDataAlamat.kabupaten}, ${formDataAlamat.provinsi} ${formDataAlamat.kodepos}`,
                                kelurahan: formDataAlamat.kelurahan,
                                kecamatan: formDataAlamat.kecamatan,
                                kabupaten: formDataAlamat.kabupaten,
                                provinsi: formDataAlamat.provinsi,
                                detail: formDataAlamat.detail,
                            };
                        } else return a;
                    })
                );
                setFormActive(false);
            })();
        } else {
            const provinsiSelected = provinsi.find(
                (p) => p.province_id == formDataAlamat.provinsi
            );
            const kabupatenSelected = kabupaten.find(
                (p) => p.city_id == formDataAlamat.kabupaten
            );
            const kecamatanSelected = kecamatan.find(
                (p) => p.subdistrict_name == formDataAlamat.kecamatan
            );
            const kelurahanSelected = kelurahan.find(
                (p) => p.KodePos == formDataAlamat.kelurahan
            );
            (async () => {
                const fetchAddress = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/delivery-address`,
                    {
                        method: "post",
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            nama: `${formDataAlamat.detail} ${kelurahanSelected.DesaKelurahan}, ${kecamatanSelected.subdistrict_name}, ${kabupatenSelected.city_name}, ${provinsiSelected.province} ${kelurahanSelected.KodePos}`,
                            kelurahan: kelurahanSelected.DesaKelurahan,
                            kecamatan: kecamatanSelected.subdistrict_name,
                            kabupaten: kabupatenSelected.city_name,
                            provinsi: provinsiSelected.province,
                            detail: formDataAlamat.detail,
                        }),
                    }
                );
                const resAddress = await fetchAddress.json();
                if (resAddress.error) {
                    return setError(resAddress.message);
                }
                console.log(resAddress);
                setAddresses([...addresses, resAddress]);
                setFormActive(false);
            })();
        }
    };

    const handleChangeRadioAlamat = (idAddress) => {
        setFormDataOrder({
            ...formDataOrder,
            delivery_address: idAddress,
        });
    };

    const submitOrder = () => {
        (async () => {
            const fetchOrder = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/order`,
                {
                    method: "post",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(formDataOrder),
                }
            );
            const resOrder = await fetchOrder.json();
            console.log(resOrder);
            if (resOrder.error) {
                return setError(resOrder.message);
            }
            setCart([]);
            navigator("/order");
        })();
    };

    return (
        <>
            <div className="page-header">
                <div className="content">
                    <div>
                        <p className="text-white font-bold">Restoqu</p>
                        {window.innerWidth < 700 ? (
                            <h1 className="text-white">
                                Complete
                                <br />
                                your order!
                            </h1>
                        ) : (
                            <h1 className="text-white">Complete your order!</h1>
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
                    className={`container-checkout ${
                        window.innerWidth < 700 ? "p-7 gap-5" : "p-10 gap-8"
                    }`}
                >
                    <div
                        style={{
                            flex: 1,
                            borderRight: "1px solid var(--biru)",
                        }}
                        className={`${
                            window.innerWidth < 700 ? "pe-5" : "pe-8"
                        }`}
                    >
                        <h5 className={`font-semibold text-biru`}>
                            Informasi Pengirim
                        </h5>
                        <p
                            className="text-gray-500 mb-3"
                            style={{ fontSize: "12px" }}
                        >
                            Informasi pengirim merupakan akun Anda
                        </p>
                        <table style={{ fontSize: "13px" }} className="mb-3">
                            <tbody>
                                <tr>
                                    <td className="pe-5 py-1 text-gray-500">
                                        Nama
                                    </td>
                                    <td className="py-1 text-biru">
                                        : <b>{userName}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pe-5 pb-1 text-gray-500">
                                        Email
                                    </td>
                                    <td className="pb-1 text-biru">
                                        : <b>{userEmail}</b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <hr className="mb-5" />
                        <h5 className="font-semibold text-biru">
                            Alamat Pengiriman
                        </h5>
                        <p
                            className="text-gray-500 mb-3"
                            style={{ fontSize: "12px" }}
                        >
                            Pilih alamat yang dituju
                        </p>
                        <div
                            className={`container-form-address ${
                                formActive ? "" : "show"
                            }`}
                        >
                            <div className="container-address gap-2">
                                {addresses.map((a, ind_a) => (
                                    <label
                                        key={ind_a}
                                        className={`item ${
                                            a._id ==
                                            formDataOrder.delivery_address
                                                ? "checked"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            name="radio-alamat"
                                            type="radio"
                                            value={a._id}
                                            onChange={(e) => {
                                                handleChangeRadioAlamat(
                                                    e.target.value
                                                );
                                            }}
                                        />
                                        <div
                                            className="flex gap-4"
                                            style={{ flex: 1 }}
                                        >
                                            <span></span>
                                            <p>{a.nama}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn-icon-aja"
                                                onClick={() => {
                                                    setEditAlamat(a);
                                                    setFormActive(true);
                                                }}
                                            >
                                                <MdOutlineEditLocation />
                                            </button>
                                            <button
                                                className="btn-icon-aja"
                                                onClick={() => {
                                                    handleDeleteAddress(a._id);
                                                }}
                                            >
                                                <RiDeleteBin5Line />
                                            </button>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <button
                                className="btn-teks-aja mt-3"
                                onClick={() => setFormActive(true)}
                            >
                                <p>Tambah alamat</p>
                                <FaPlus />
                            </button>
                        </div>
                        <div
                            className={`container-form-address ${
                                formActive ? "show" : ""
                            }`}
                        >
                            <form onSubmit={handleSubmitAddress}>
                                <div className="flex gap-4 mb-3">
                                    <div
                                        className="formulir"
                                        style={{ flex: 1 }}
                                    >
                                        <label>Provinsi</label>
                                        {editAlamat ? (
                                            <input
                                                value={formDataAlamat.provinsi}
                                                onChange={(e) => {
                                                    setFormDataAlamat({
                                                        ...formDataAlamat,
                                                        provinsi:
                                                            e.target.value,
                                                    });
                                                }}
                                                type="text"
                                                required
                                            />
                                        ) : (
                                            <select
                                                required
                                                value={formDataAlamat.provinsi}
                                                onChange={(e) => {
                                                    setFormDataAlamat({
                                                        ...formDataAlamat,
                                                        provinsi:
                                                            e.target.value,
                                                    });
                                                }}
                                            >
                                                <option value="">
                                                    {loadingAddress
                                                        ? "Loading .."
                                                        : provinsi.length > 0
                                                        ? "-- Pilih --"
                                                        : "-- Kosong --"}
                                                </option>
                                                {provinsi.map((p, ind_p) => (
                                                    <option
                                                        key={ind_p}
                                                        value={p.province_id}
                                                    >
                                                        {p.province}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    <div
                                        className="formulir"
                                        style={{ flex: 1 }}
                                    >
                                        <label>Kabupaten</label>
                                        {editAlamat ? (
                                            <input
                                                value={formDataAlamat.kabupaten}
                                                onChange={(e) => {
                                                    setFormDataAlamat({
                                                        ...formDataAlamat,
                                                        kabupaten:
                                                            e.target.value,
                                                    });
                                                }}
                                                type="text"
                                                required
                                            />
                                        ) : (
                                            <select
                                                required
                                                value={formDataAlamat.kabupaten}
                                                onChange={(e) => {
                                                    setFormDataAlamat({
                                                        ...formDataAlamat,
                                                        kabupaten:
                                                            e.target.value,
                                                    });
                                                }}
                                            >
                                                <option value="">
                                                    {loadingAddress
                                                        ? "Loading .."
                                                        : kabupaten.length > 0
                                                        ? "-- Pilih --"
                                                        : "-- Kosong --"}
                                                </option>
                                                {kabupaten.map((p, ind_p) => (
                                                    <option
                                                        key={ind_p}
                                                        value={p.city_id}
                                                    >
                                                        {p.city_name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4 mb-3">
                                    <div
                                        className="formulir"
                                        style={{ flex: 1 }}
                                    >
                                        <label>Kecamatan</label>
                                        {editAlamat ? (
                                            <input
                                                value={formDataAlamat.kecamatan}
                                                onChange={(e) => {
                                                    setFormDataAlamat({
                                                        ...formDataAlamat,
                                                        kecamatan:
                                                            e.target.value,
                                                    });
                                                }}
                                                type="text"
                                                required
                                            />
                                        ) : (
                                            <select
                                                required
                                                value={formDataAlamat.kecamatan}
                                                onChange={(e) => {
                                                    setFormDataAlamat({
                                                        ...formDataAlamat,
                                                        kecamatan:
                                                            e.target.value,
                                                    });
                                                }}
                                            >
                                                <option value="">
                                                    {loadingAddress
                                                        ? "Loading .."
                                                        : kecamatan.length > 0
                                                        ? "-- Pilih --"
                                                        : "-- Kosong --"}
                                                </option>
                                                {kecamatan.map((p, ind_p) => (
                                                    <option
                                                        key={ind_p}
                                                        value={
                                                            p.subdistrict_name
                                                        }
                                                    >
                                                        {p.subdistrict_name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    <div
                                        className="formulir"
                                        style={{ flex: 1 }}
                                    >
                                        <label>Kelurahan</label>
                                        {editAlamat ? (
                                            <input
                                                value={formDataAlamat.kelurahan}
                                                onChange={(e) => {
                                                    setFormDataAlamat({
                                                        ...formDataAlamat,
                                                        kelurahan:
                                                            e.target.value,
                                                    });
                                                }}
                                                type="text"
                                                required
                                            />
                                        ) : (
                                            <select
                                                required
                                                value={formDataAlamat.kelurahan}
                                                onChange={(e) => {
                                                    setFormDataAlamat({
                                                        ...formDataAlamat,
                                                        kelurahan:
                                                            e.target.value,
                                                    });
                                                }}
                                            >
                                                <option value="">
                                                    {loadingAddress
                                                        ? "Loading .."
                                                        : kelurahan.length > 0
                                                        ? "-- Pilih --"
                                                        : "-- Kosong --"}
                                                </option>
                                                {kelurahan.map((p, ind_p) => (
                                                    <option
                                                        key={ind_p}
                                                        value={p.KodePos}
                                                    >
                                                        {p.DesaKelurahan}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4 mb-3">
                                    {editAlamat && (
                                        <div
                                            className="formulir"
                                            style={{ flex: 1 }}
                                        >
                                            <label>Kodepos</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Nama Jalan, Nomor rumah, RT-RW"
                                                value={formDataAlamat.kodepos}
                                                onChange={(e) => {
                                                    setFormDataAlamat({
                                                        ...formDataAlamat,
                                                        kodepos: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div
                                        className="formulir"
                                        style={{ flex: 1 }}
                                    >
                                        <label>Detail</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nama Jalan, Nomor rumah, RT-RW"
                                            value={formDataAlamat.detail}
                                            onChange={(e) => {
                                                setFormDataAlamat({
                                                    ...formDataAlamat,
                                                    detail: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        className="btn-biru"
                                        style={{ fontSize: "14px" }}
                                        onClick={() => {
                                            setFormActive(false);
                                        }}
                                    >
                                        <FaChevronLeft />
                                        <p>Batal</p>
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-outline-coklat"
                                        style={{ fontSize: "14px" }}
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className={`container-side-checkout`}>
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
                                    <td className="font-semibold">
                                        Biaya ongkir
                                    </td>
                                    <td className="harga">Rp 15.000</td>
                                </tr>
                                <tr className="text-ungu">
                                    <td className="font-semibold">Total</td>
                                    <td className="harga font-semibold">
                                        Rp {total.toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button
                            onClick={() => {
                                submitOrder();
                            }}
                            className={`${
                                formDataOrder.delivery_fee > 0 &&
                                formDataOrder.delivery_address != ""
                                    ? "btn-coklat"
                                    : "text-gray-500"
                            }`}
                            style={{
                                width: "100%",
                                pointerEvents:
                                    formDataOrder.delivery_fee > 0 &&
                                    formDataOrder.delivery_address != ""
                                        ? "all"
                                        : "none",
                            }}
                        >
                            <p className="text-center">Bayar</p>
                            {formDataOrder.delivery_fee > 0 &&
                                formDataOrder.delivery_address != "" && (
                                    <FaArrowRightLong />
                                )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
