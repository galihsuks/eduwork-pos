import "./App.scss";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
function AppAdmin() {
    return (
        <div className="flex" style={{ height: "100svh", width: "100%" }}>
            <AdminNavbar />
            <div style={{ flex: 1 }} className="px-7 py-5 flex flex-col">
                <Outlet />
            </div>
        </div>
    );
}

export default AppAdmin;
