// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useUserStore from "../../store/userStore";

const ProtectedRoute = ({ allowedFilter, children }) => {
    const { userRole } = useUserStore();
    // allowedFilter = {
    //     user: true/false,
    //     roles: ['admin', 'user']
    // }

    if (allowedFilter.user) {
        if (!userRole) {
            return <Navigate to="/login" replace />;
        }
        if (!allowedFilter.roles.includes(userRole)) {
            switch (userRole) {
                case "admin":
                    return <Navigate to="/admin/product" replace />;
                case "user":
                    return <Navigate to="/" replace />;
                default:
                    return <Navigate to="/" replace />;
            }
        }
    } else {
        if (userRole) {
            switch (userRole) {
                case "admin":
                    return <Navigate to="/admin/product" replace />;
                case "user":
                    return <Navigate to="/" replace />;
                default:
                    return <Navigate to="/" replace />;
            }
        }
    }
    return children;
};

export default ProtectedRoute;
