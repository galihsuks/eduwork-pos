import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import {
    FaCheck,
    FaChevronLeft,
    FaChevronRight,
    FaFilter,
} from "react-icons/fa6";
import useMessageStore from "../../store/messageStore";

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
    "All",
    "Makanan Berat",
    "Minuman",
    "Camilan",
    "Dessert",
    "Makanan Sehat",
];

const Products = () => {
    const [products, setProducts] = useState({
        data: [],
        count: 0,
    });
    const { getMessage, message } = useMessageStore();
    // const categorySelectedFromHome = useRef(getMessage());
    const [category, setCategory] = useState(message == "" ? "All" : message);
    const [tags, setTags] = useState([]);
    const [pag, setPag] = useState({
        skip: 1,
        limit: 9,
    });
    const [numberPag, setNumberPag] = useState([]);
    const [showFilter, setShowFilter] = useState(true);
    const firstRender = useRef(false);
    const navigator = useNavigate();
    const location = useLocation();
    const queryParmas = new URLSearchParams(location.search);
    const findProductParams = queryParmas.get("q");

    useEffect(() => {
        console.log(findProductParams);
        if (window.innerWidth < 700) {
            setShowFilter(false);
            console.log("ini kurang dari 700 inner widthnya");
            setPag({ ...pag, limit: 8, skip: 0 });
        } else {
            setPag({ ...pag, limit: 9, skip: 0 });
        }
    }, []);

    useEffect(() => {
        if (firstRender.current) {
            setPag({ ...pag, skip: 0 });
            (async () => {
                let url = `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/product?skip=0&limit=${pag.limit}${
                    findProductParams ? `&q=${findProductParams}` : ""
                }`;
                if (category != "All") {
                    url += `&category=${encodeURI(category)}`;
                }
                if (tags.length > 0) {
                    tags.forEach((t) => {
                        url += `&tags[]=${encodeURI(t)}`;
                    });
                }
                const fetchProduct = await fetch(url);
                const productsJson = await fetchProduct.json();
                if (fetchProduct.status == 200) {
                    setProducts(productsJson);
                    let angka = [];
                    for (
                        let i = 1;
                        i <= Math.ceil(productsJson.count / pag.limit);
                        i++
                    ) {
                        angka.push(i);
                    }
                    setNumberPag(angka);
                }
            })();
        }
    }, [category, tags, pag.limit]);

    useEffect(() => {
        (async () => {
            let url = `${import.meta.env.VITE_BACKEND_URL}/api/product?skip=${
                pag.skip
            }&limit=${pag.limit}${
                findProductParams ? `&q=${findProductParams}` : ""
            }`;
            if (category != "All") {
                url += `&category=${encodeURI(category)}`;
            }
            if (tags.length > 0) {
                tags.forEach((t) => {
                    url += `&tags[]=${encodeURI(t)}`;
                });
            }
            const fetchProduct = await fetch(url);
            const productsJson = await fetchProduct.json();
            if (fetchProduct.status == 200) {
                setProducts(productsJson);
                let angka = [];
                for (
                    let i = 1;
                    i <= Math.ceil(productsJson.count / pag.limit);
                    i++
                ) {
                    angka.push(i);
                }
                setNumberPag(angka);
            }
            getMessage();
            if (!firstRender.current) firstRender.current = true;
        })();
    }, [pag.skip]);

    useEffect(() => {
        console.log(pag);
    }, [pag]);

    const handleHapusFind = () => {
        navigator(`/product`);
        navigator(0);
    };

    return (
        <>
            <div className="page-header">
                <div className="content">
                    <div>
                        <p className="text-white font-bold">Our</p>
                        {window.innerWidth > 700 ? (
                            <h1 className="text-white">Food & Beverage</h1>
                        ) : (
                            <h1 className="text-white">
                                Food
                                <br />
                                Beverage
                            </h1>
                        )}
                    </div>
                </div>
                <img
                    className=""
                    src="https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                />
            </div>
            <div className="container mx-auto py-7">
                <div
                    className={`flex ${window.innerWidth > 700 ? "gap-5" : ""}`}
                >
                    <div className={`sidebar pe-5 ${showFilter ? "show" : ""}`}>
                        <div
                            className="btn-filter mb-2"
                            onClick={() => {
                                if (window.innerWidth < 700)
                                    setShowFilter((prev) => !prev);
                            }}
                        >
                            <FaFilter />
                            <p>Filter</p>
                        </div>
                        <div className="item">
                            <p>CATEGORIES</p>
                        </div>
                        <div className="expand">
                            {categoriesItem.map((c, ind_c) => (
                                <label
                                    key={ind_c}
                                    className={`item-expand ${
                                        category == c ? "checked" : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        value={c}
                                        onChange={(e) =>
                                            e.target.checked
                                                ? setCategory(e.target.value)
                                                : ""
                                        }
                                    />
                                    <span></span>
                                    <p>{c}</p>
                                </label>
                            ))}
                        </div>
                        <div className="item">
                            <p>TAGS</p>
                        </div>
                        <div className="expand">
                            {tagsItems.map((t, ind_t) => (
                                <label
                                    key={ind_t}
                                    className={`item-expand ${
                                        tags.includes(t) ? "checked" : ""
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        value={t}
                                        onChange={(e) =>
                                            e.target.checked
                                                ? setTags([
                                                      ...tags,
                                                      e.target.value,
                                                  ])
                                                : setTags((prev) =>
                                                      prev.filter((p) => p != t)
                                                  )
                                        }
                                    />
                                    {/* <span></span> */}
                                    {tags.includes(t) ? (
                                        <FaCheck />
                                    ) : (
                                        <GoDotFill />
                                    )}
                                    <p>{t}</p>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div style={{ flex: 1 }} className="flex flex-col">
                        <div className="flex justify-between gap-3 items-center">
                            <div>
                                <div className="sub-section mb-1">
                                    <div className="icon">
                                        <img
                                            src="img/restoqu-logo-r-white-little.png"
                                            alt=""
                                        />
                                    </div>
                                    <p>Menu</p>
                                </div>
                                <h3 className="text-biru">
                                    {findProductParams
                                        ? `Anda mencari ${findProductParams}`
                                        : "Explore Our Menu"}
                                </h3>
                            </div>
                            {window.innerWidth > 700 && findProductParams && (
                                <button
                                    onClick={() => {
                                        handleHapusFind();
                                    }}
                                    type="button"
                                    className="btn-coklat"
                                >
                                    Hapus pencarian
                                </button>
                            )}
                        </div>
                        {window.innerWidth <= 700 && findProductParams && (
                            <button
                                type="button"
                                onClick={() => {
                                    handleHapusFind();
                                }}
                                className="btn-coklat mt-2"
                            >
                                Hapus pencarian
                            </button>
                        )}

                        {products.data.length > 0 ? (
                            <>
                                <div
                                    className={`container-product sempit gap-5 my-5 ${
                                        showFilter ? "show-filter" : ""
                                    }`}
                                >
                                    {products.data.map((item, index) => (
                                        <Link
                                            to={`/product/${item._id}`}
                                            key={index}
                                            className="item"
                                        >
                                            <div className="gambar mb-2">
                                                <div className="content flex flex-col">
                                                    {item.tags.some(
                                                        (tag) =>
                                                            tag.name ===
                                                            "Favorit"
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
                                                {item.price.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                                <div className="flex justify-center w-full mt-6">
                                    <div className="pagination gap-3">
                                        <span
                                            className="item"
                                            onClick={() => {
                                                if (pag.skip > 0) {
                                                    setPag({
                                                        ...pag,
                                                        skip:
                                                            pag.skip -
                                                            pag.limit,
                                                    });
                                                }
                                            }}
                                        >
                                            <FaChevronLeft />
                                        </span>
                                        {numberPag.map((n, ind_n) => (
                                            <span
                                                onClick={() => {
                                                    setPag({
                                                        ...pag,
                                                        skip: pag.limit * ind_n,
                                                    });
                                                }}
                                                className={`item ${
                                                    pag.limit * ind_n ==
                                                    pag.skip
                                                        ? "active"
                                                        : ""
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
                                                    pag.skip <
                                                    Math.floor(
                                                        products.count /
                                                            pag.limit
                                                    ) *
                                                        pag.limit
                                                ) {
                                                    console.log({
                                                        ...pag,
                                                        skip:
                                                            pag.skip +
                                                            pag.limit,
                                                    });
                                                    setPag({
                                                        ...pag,
                                                        skip:
                                                            pag.skip +
                                                            pag.limit,
                                                    });
                                                }
                                            }}
                                        >
                                            <FaChevronRight />
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div
                                style={{ flex: 1 }}
                                className="flex justify-center items-center"
                            >
                                <p className="text-center text-gray-500">
                                    <i>Tidak ada menu</i>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Products;
