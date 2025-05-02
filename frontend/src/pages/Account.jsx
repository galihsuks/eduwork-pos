import { FaArrowRightLong } from "react-icons/fa6";
import useUserStore from "../../store/userStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";

const Account = () => {
    const { userName, userEmail, userToken, emptyUser } = useUserStore();
    const [error, setError] = useState("");
    const navigator = useNavigate();
    const { setCart } = useCartStore();

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
    return (
        <>
            <div className="page-header">
                <div className="content">
                    <div>
                        <p className="text-white font-bold">Your</p>
                        <h1 className="text-white">Profile</h1>
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
                            <Link to={"/account"} className="btn-teks-aja">
                                My Account
                            </Link>
                            <Link
                                to={"/order"}
                                className="btn-teks-aja"
                                style={{ color: "gray" }}
                            >
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
                            className={`text-biru ${
                                window.innerWidth <= 700 ? "" : "ps-10"
                            }`}
                        >
                            {error && (
                                <div className="message mb-3">{error}</div>
                            )}
                            <p>Full Name</p>
                            <h3 className="mb-5">{userName}</h3>
                            <p>Email</p>
                            <h3>{userEmail}</h3>
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
export default Account;
