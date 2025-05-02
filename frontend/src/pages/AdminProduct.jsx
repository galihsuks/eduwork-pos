import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import useMessageStore from "../../store/messageStore";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoMdOpen } from "react-icons/io";
import Alert from "../components/Alert";
import useUserStore from "../../store/userStore";

const AdminProduct = () => {
    const [pagination, setPagination] = useState(0);
    const location = useLocation();
    const queryParmas = new URLSearchParams(location.search);
    const findProductParams = queryParmas.get("q");
    const [products, setProducts] = useState({
        data: [],
        count: 0,
    });
    const [numberPag, setNumberPag] = useState([]);
    const [pesan, setPesan] = useState(null);
    const { getMessage, setMessage } = useMessageStore();
    const [alert, setAlert] = useState({
        teks: "",
        show: false,
        productId: "",
    });
    const { userToken } = useUserStore();
    const navigator = useNavigate();

    useEffect(() => {
        console.log(`Pagination : ${pagination}`);
        (async () => {
            let url = `${
                import.meta.env.VITE_BACKEND_URL
            }/api/product?skip=${pagination}&limit=${10}${
                findProductParams ? `&q=${findProductParams}` : ""
            }`;
            const fetchProduct = await fetch(url);
            const productsJson = await fetchProduct.json();
            if (fetchProduct.status == 200) {
                console.log(productsJson);
                setProducts(productsJson);
                let angka = [];
                for (let i = 1; i <= Math.ceil(productsJson.count / 10); i++) {
                    angka.push(i);
                }
                setNumberPag(angka);
            }
            setPesan(getMessage());
        })();
    }, [pagination]);

    const handleDelete = () => {
        (async () => {
            const responseFetch = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/${
                    alert.productId
                }`,
                {
                    method: "delete",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            const productJson = await responseFetch.json();
            console.log("berhasil hapus");
            console.log(productJson);
            if (productJson.error) {
                return setPesan(productJson.message);
            }
            setMessage(`Produk ${productJson.name} berhasil di hapus`);
            navigator(0);
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
                        handleDelete();
                    }}
                />
            )}
            <div className="flex justify-between gap-3 items-center">
                <div>
                    <h1 className="text-biru">Our Products</h1>
                    <p className="text-gray-500">Product management</p>
                </div>
                <Link to={"/admin/product/add"} className="btn-coklat">
                    <p>Add</p>
                    <FaPlus />
                </Link>
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
                        // overflowY: "scroll",
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
                                        <th>Image</th>
                                        <th>Name / ID</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.map((p, ind_p) => (
                                        <tr key={ind_p}>
                                            <td>{ind_p + 1 + pagination}</td>
                                            <td>
                                                <img
                                                    src={`${
                                                        import.meta.env
                                                            .VITE_BACKEND_URL
                                                    }/image/${p.image_url}`}
                                                    alt=""
                                                />
                                            </td>
                                            <td>
                                                <div>
                                                    <p className="font-semibold">
                                                        {p.name}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "10px",
                                                            opacity: 0.5,
                                                        }}
                                                    >
                                                        {p.description}
                                                    </p>
                                                </div>
                                            </td>
                                            <td style={{ textWrap: "nowrap" }}>
                                                Rp{" "}
                                                {p.price.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </td>
                                            <td>{p.category.name}</td>
                                            <td>
                                                <div className="flex">
                                                    <Link
                                                        className="btn"
                                                        to={`/product/${p._id}`}
                                                    >
                                                        <IoMdOpen />
                                                    </Link>
                                                    <Link
                                                        className="btn"
                                                        to={`/admin/product/edit/${p._id}`}
                                                    >
                                                        <FiEdit3 />
                                                    </Link>
                                                    <button
                                                        className="btn"
                                                        onClick={() => {
                                                            setAlert({
                                                                teks: `Produk ${p.name} akan dihapus?`,
                                                                show: true,
                                                                productId:
                                                                    p._id,
                                                            });
                                                        }}
                                                    >
                                                        <RiDeleteBin2Line />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="pagination gap-3">
                            <span
                                className="item"
                                onClick={() => {
                                    if (pagination > 0) {
                                        setPagination(pagination - 10);
                                    }
                                }}
                            >
                                <FaChevronLeft />
                            </span>
                            {numberPag.map((n, ind_n) => (
                                <span
                                    onClick={() => {
                                        setPagination(10 * ind_n);
                                    }}
                                    className={`item ${
                                        10 * ind_n == pagination ? "active" : ""
                                    }`}
                                    key={ind_n}
                                >
                                    {n}
                                </span>
                            ))}
                            <span
                                className="item"
                                onClick={() => {
                                    if (
                                        pagination <
                                        Math.floor(products.count / 10) * 10
                                    ) {
                                        console.log(pagination + 10);
                                        setPagination(pagination + 10);
                                    }
                                }}
                            >
                                <FaChevronRight />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminProduct;
