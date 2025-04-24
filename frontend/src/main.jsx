// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Auth from "./Auth.jsx";
import Regist from "./pages/Regist.jsx";
import Login from "./pages/Login.jsx";
import Account from "./pages/Account.jsx";
import Cart from "./pages/Cart.jsx";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="product">
                    <Route index element={<Products />} />
                    <Route path=":id" element={<ProductDetail />} />
                </Route>
                <Route path="account" element={<Account />} />
                <Route path="cart" element={<Cart />} />
            </Route>
            <Route path="/auth" element={<Auth />}>
                <Route path="regist" element={<Regist />} />
                <Route path="login" element={<Login />} />
            </Route>
        </Routes>
    </BrowserRouter>
    // </StrictMode>,
);
