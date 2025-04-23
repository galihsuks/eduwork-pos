import { useEffect, useState } from "react";
import {
    FaArrowLeftLong,
    FaArrowRightLong,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import useMessageStore from "../../store/messageStore";

const Regist = () => {
    const navigator = useNavigate();
    const { setMessage } = useMessageStore();
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handeSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        (async () => {
            const fetchAuth = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
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
            setMessage("Berhasil mendaftar! Sekarang login dengan akun barumu");
            navigator("/auth/login");
        })();
    };

    useEffect(() => {
        setError("");
    }, [formData]);

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
                <p className="text-sm">Already have an account?</p>
                <Link
                    className="btn-outline-coklat"
                    style={{ fontSize: "12px" }}
                    to={"/auth/login"}
                >
                    <p>LOG IN</p>
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
                Register your account
            </p>
            {error && <div className="message mb-3">{error}</div>}
            <form onSubmit={handeSubmit}>
                <div className="mb-3">
                    <p className="text-sm mb-2 text-biru">Name</p>
                    <div className="form-input">
                        <input
                            required
                            type="text"
                            placeholder="Restoqu"
                            value={formData.full_name}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    full_name: e.target.value,
                                });
                            }}
                        />
                    </div>
                </div>
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
                    <p>Register</p>
                    <FaArrowRightLong />
                </button>
            </form>
        </div>
    );
};

export default Regist;
