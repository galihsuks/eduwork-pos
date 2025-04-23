import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            const fetchProduct = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/product`
            );
            const productsJson = await fetchProduct.json();
            if (fetchProduct.status == 200) {
                setProducts(
                    productsJson.data.filter((item) =>
                        item.tags.some((tag) => tag.name === "Favorit")
                    )
                );
            }
        })();
    }, []);

    useEffect(() => {
        console.log(products);
    }, [products]);

    return (
        <>
            <div className="home-header">
                <div className="content">
                    <div className="mt-5 container">
                        <p className="text-white">Restoqu</p>
                        <h1 className="text-white mb-3">
                            Berbagai rasa
                            <br />
                            berpadu menjadi satu
                        </h1>
                        <div
                            style={{ borderLeft: "1px solid white" }}
                            className="ps-5 mb-4"
                        >
                            <p
                                className="text-white"
                                style={{ maxWidth: "300px" }}
                            >
                                Bercengkrama bersama keluarga ditemani dengan
                                nuansa elegan dan modern bersama kami
                            </p>
                        </div>
                        <Link to={"/product"} className="btn-putih">
                            <p>Lihat produk</p>
                            <FaArrowRightLong />
                        </Link>
                    </div>
                </div>
                <img
                    className=""
                    src="https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                />
            </div>
            <div className="container mx-auto py-7">
                <div className="sub-section mb-1">
                    <div className="icon">
                        <img src="img/restoqu-logo-r-white-little.png" alt="" />
                    </div>
                    <p>Categories</p>
                </div>
                <h3 className="text-biru">Browse by Category</h3>

                <div className="container-category my-5">
                    <div className="sub-container gap-2">
                        <div
                            className="item"
                            style={{
                                backgroundImage:
                                    "url(https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                            }}
                        >
                            <p>Makanan berat</p>
                        </div>
                        <div
                            className="item"
                            style={{
                                backgroundImage:
                                    "url(https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2157&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                            }}
                        >
                            <p>Minuman</p>
                        </div>
                        <div
                            className="item"
                            style={{
                                backgroundImage:
                                    "url(https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                            }}
                        >
                            <p>Camilan</p>
                        </div>
                        <div
                            className="item"
                            style={{
                                backgroundImage:
                                    "url(https://images.unsplash.com/photo-1476887334197-56adbf254e1a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                            }}
                        >
                            <p>Dessert</p>
                        </div>
                        <div
                            className="item"
                            style={{
                                backgroundImage:
                                    "url(https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                            }}
                        >
                            <p>Makanan sehat</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto">
                <hr />
            </div>

            <div className="container mx-auto py-7">
                <div className="sub-section mb-1">
                    <div className="icon">
                        <img src="img/restoqu-logo-r-white-little.png" alt="" />
                    </div>
                    <p>Menu</p>
                </div>
                <h3 className="text-biru">Explore Our Menu</h3>

                <div className="container-product gap-5 my-5">
                    {products.map(
                        (item, index) =>
                            index < 5 && (
                                <Link
                                    to={`/product/${item._id}`}
                                    key={index}
                                    className="item"
                                >
                                    <div className="gambar mb-2">
                                        <div className="content flex flex-col">
                                            {item.tags.some(
                                                (tag) => tag.name === "Favorit"
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
                                                import.meta.env.VITE_BACKEND_URL
                                            }/image/${item.image_url}`}
                                            alt=""
                                        />
                                    </div>
                                    <p className="nama">{item.name}</p>
                                    <p className="harga">
                                        Rp {item.price.toLocaleString("id-ID")}
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
        </>
    );
};
export default Home;
