import { Link } from "react-router-dom";
import useUserStore from "../../store/userStore";

const Footer = () => {
    const { userToken } = useUserStore();

    return (
        <footer className="container mx-auto">
            <div className="flex justify-center gap-7 py-2">
                <Link to={"/"}>Home</Link>
                <Link to={"/product"}>Products</Link>
                <Link to={userToken ? "/account" : "/login"}>
                    {userToken ? "Account" : "Login"}
                </Link>
            </div>
            <div
                className="flex justify-center py-2"
                style={{ borderTop: "1px solid rgb(197, 197, 197)" }}
            >
                <p className="text-gray-400">©2025 All rights reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
