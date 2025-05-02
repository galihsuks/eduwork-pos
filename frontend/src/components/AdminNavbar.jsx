import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import { MdFastfood } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { FaArrowRightLong } from "react-icons/fa6";
import useCartStore from "../../store/cartStore";

const AdminNavbar = () => {
    const { userEmail, userName } = useUserStore();
    const { emptyUser, userToken } = useUserStore();
    const navigator = useNavigate();
    const location = useLocation();
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
                console.error(authJson.message);
                return;
            }
            emptyUser();
            setCart([]);
            navigator("/login");
        })();
    };

    const checkActivePath = (path) => {
        if (location.pathname.includes(path)) return "active";
        else return "";
    };

    return (
        <div className="admin-navbar">
            <h3 className="mb-4">
                Admin
                <br />
                Restoqu
            </h3>
            <p>{userName}</p>
            <p>{userEmail}</p>
            <hr className="my-6" />
            <div className="flex flex-col gap-3" style={{ flex: 1 }}>
                <Link
                    to={"/admin/product"}
                    className={`item ${checkActivePath("product")}`}
                >
                    <MdFastfood />
                    <p>Products</p>
                </Link>
                <Link
                    to={"/admin/order"}
                    className={`item ${checkActivePath("order")}`}
                >
                    <TbTruckDelivery />
                    <p>Orders</p>
                </Link>
            </div>
            <hr className="my-6" />
            <button
                className="btn-putih mt-4"
                onClick={() => {
                    handleLogout();
                }}
            >
                <p>LOGOUT</p>
                <FaArrowRightLong />
            </button>
        </div>
    );
};
export default AdminNavbar;
