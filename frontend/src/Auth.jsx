import { FaArrowRightLong } from "react-icons/fa6";
import "./App.scss";
import { Link, Outlet, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { useEffect } from "react";
function Auth() {
    const { userToken } = useUserStore();
    const navigator = useNavigate();

    useEffect(() => {
        if (userToken) {
            navigator("/");
        }
    }, []);

    return (
        <div className="auth">
            <div className="gambar-header">
                <div className="logo p-6 gap-6">
                    <img src={`/img/restoqu-logo-text-white.png`} alt="" />
                    <Link to={"/product"} className="btn-putih">
                        <p>Lihat produk</p>
                        <FaArrowRightLong />
                    </Link>
                </div>
                <img
                    className="background"
                    src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1010&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                />
            </div>
            <div className="content p-10">
                <Outlet />
            </div>
        </div>
    );
}

export default Auth;
