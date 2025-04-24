import { IoCart, IoCartOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/userStore";
import {
    RiSearchFill,
    RiSearchLine,
    RiUser3Fill,
    RiUser3Line,
} from "react-icons/ri";
import useCartStore from "../../store/cartStore";

const Navbar = () => {
    const { userToken } = useUserStore();
    const { cart } = useCartStore();
    const [scrollY, setScrollY] = useState(0);
    const [hoverSearch, setHoverSearch] = useState(false);
    const [hoverCart, setHoverCart] = useState(false);
    const [hoverUser, setHoverUser] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <nav className={`${scrollY > 70 ? "putih" : ""}`}>
                <div className={`logo-hp ${scrollY > 70 ? "hide" : ""}`}>
                    <img
                        className="logo-text"
                        src="/img/restoqu-logo-text-white.png"
                        alt=""
                    />
                </div>
                <div className="nav container py-2">
                    <div className="flex gap-2 items-center">
                        <img
                            className="logo-text"
                            src={`/img/restoqu-logo-text${
                                scrollY > 70 ? "" : "-white"
                            }.png`}
                            alt=""
                        />
                        <img
                            className="logo-r"
                            src="/img/restoqu-logo-r.png"
                            alt=""
                        />
                    </div>
                    <div className="list">
                        <Link to={"/"}>Home</Link>
                        <Link to={"/product"}>Products</Link>
                    </div>
                    <div className="icons">
                        <Link className="flex items-center gap-2">
                            <input type="text" />
                            <div
                                className="icon"
                                onMouseEnter={() => {
                                    setHoverSearch(true);
                                }}
                                onMouseLeave={() => {
                                    setHoverSearch(false);
                                }}
                            >
                                {hoverSearch ? (
                                    <RiSearchFill />
                                ) : (
                                    <RiSearchLine />
                                )}
                            </div>
                        </Link>
                        <Link
                            to={"/cart"}
                            className="icon"
                            onMouseEnter={() => {
                                setHoverCart(true);
                            }}
                            onMouseLeave={() => {
                                setHoverCart(false);
                            }}
                        >
                            {cart.length > 0 && (
                                <span>
                                    {cart.reduce((prev, curr) => {
                                        return prev + curr.qty;
                                    }, 0)}
                                </span>
                            )}
                            {hoverCart ? <IoCart /> : <IoCartOutline />}
                        </Link>
                        <Link
                            to={userToken ? "/account" : "/auth/login"}
                            className="icon"
                            onMouseEnter={() => {
                                setHoverUser(true);
                            }}
                            onMouseLeave={() => {
                                setHoverUser(false);
                            }}
                        >
                            {hoverUser ? <RiUser3Fill /> : <RiUser3Line />}
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};
export default Navbar;
