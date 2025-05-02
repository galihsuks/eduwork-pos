import { useEffect, useState } from "react";
import {
    FaArrowLeftLong,
    FaArrowRightLong,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import useMessageStore from "../../store/messageStore";
import useUserStore from "../../store/userStore";
import useCartStore from "../../store/cartStore";

const Login = () => {
    const navigator = useNavigate();
    const { getMessage } = useMessageStore();
    const { setUser } = useUserStore();
    const { setCart } = useCartStore();
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        setError("");
    }, [formData]);

    useEffect(() => {
        setError(getMessage());
    }, []);

    const handeSubmit = (e) => {
        e.preventDefault();
        (async () => {
            const fetchAuth = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
                {
                    method: "post",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
            const authJson = await fetchAuth.json();
            if (authJson.error) {
                setError(authJson.message);
                return;
            }

            const fetchCart = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${authJson.token}`,
                        "Content-type": "application/json",
                    },
                }
            );
            const cartJson = await fetchCart.json();

            setUser({
                token: authJson.token,
                full_name: authJson.user.full_name,
                email: authJson.user.email,
                _id: authJson.user._id,
                role: authJson.user.role,
            });
            setCart(cartJson);
            navigator(authJson.user.role == "user" ? "/" : "/admin/product");
        })();
    };

    return (
        <div>
            {window.innerWidth <= 700 && (
                <Link
                    to={"/product"}
                    className="mb-2 bg-gray-100 py-2 px-5 text-ungu"
                    style={{
                        display: "block",
                        width: "fit-content",
                        borderRadius: "3em",
                    }}
                >
                    <FaArrowLeftLong />
                </Link>
            )}
            <div className="flex justify-end items-center gap-3 mb-5">
                <p className="text-sm">Don't have an account yet?</p>
                <Link
                    className="btn-outline-coklat"
                    style={{ fontSize: "12px" }}
                    to={"/regist"}
                >
                    <p>REGISTER</p>
                    <FaArrowRightLong />
                </Link>
            </div>
            <h1 className="text-biru">Welcome to</h1>
            {window.innerWidth <= 700 ? (
                <img
                    className="mb-3"
                    src={`/img/restoqu-logo-text.png`}
                    style={{ height: "60px" }}
                    alt=""
                />
            ) : (
                <h1 className="mb-2 text-biru">Restoqu</h1>
            )}
            <p className="text-gray-500 mb-7" style={{ fontSize: "small" }}>
                Login to your account
            </p>
            {error && <div className="message mb-3">{error}</div>}
            <form onSubmit={handeSubmit}>
                <div className="mb-3">
                    <p className="text-sm mb-2 text-biru">Email</p>
                    <div className="form-input">
                        <input
                            required
                            type="email"
                            placeholder="restoqu@gmail.com"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                });
                            }}
                        />
                    </div>
                </div>
                <div className="mb-7">
                    <p className="text-sm mb-2 text-biru">Password</p>
                    <div className="form-input">
                        <input
                            required
                            placeholder="password"
                            type={showPass ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                });
                            }}
                        />
                        <span
                            onClick={() => {
                                setShowPass((prev) => !prev);
                            }}
                            className={showPass ? "active" : ""}
                        >
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <button type="submit" className="btn-coklat">
                    <p>LOGIN</p>
                    <FaArrowRightLong />
                </button>
            </form>
        </div>
    );
};

export default Login;
