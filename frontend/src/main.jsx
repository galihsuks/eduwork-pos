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
import Checkout from "./pages/Checkout.jsx";
import Order from "./pages/Order.jsx";
import Invoice from "./pages/Invoice.jsx";
import AppAdmin from "./AppAdmin.jsx";
import AdminProduct from "./pages/AdminProduct.jsx";
import AdminProductDetail from "./pages/AdminProductDetail.jsx";
import AdminOrder from "./pages/AdminOrder.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
                <Route path="invoice">
                    <Route
                        path=":order_id"
                        element={
                            <ProtectedRoute
                                allowedFilter={{
                                    user: true,
                                    roles: ["user", "admin"],
                                }}
                            >
                                <Invoice />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route
                    path="account"
                    element={
                        <ProtectedRoute
                            allowedFilter={{
                                user: true,
                                roles: ["user"],
                            }}
                        >
                            <Account />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="order"
                    element={
                        <ProtectedRoute
                            allowedFilter={{
                                user: true,
                                roles: ["user"],
                            }}
                        >
                            <Order />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="cart"
                    element={
                        <ProtectedRoute
                            allowedFilter={{
                                user: true,
                                roles: ["user"],
                            }}
                        >
                            <Cart />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="checkout"
                    element={
                        <ProtectedRoute
                            allowedFilter={{
                                user: true,
                                roles: ["user"],
                            }}
                        >
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route
                path="/"
                element={
                    <ProtectedRoute
                        allowedFilter={{
                            user: false,
                        }}
                    >
                        <Auth />
                    </ProtectedRoute>
                }
            >
                <Route path="login" element={<Login />} />
                <Route path="regist" element={<Regist />} />
            </Route>
            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        allowedFilter={{
                            user: true,
                            roles: ["admin"],
                        }}
                    >
                        <AppAdmin />
                    </ProtectedRoute>
                }
            >
                <Route path="product">
                    <Route index element={<AdminProduct />} />
                    <Route path="add" element={<AdminProductDetail />} />
                    <Route path="edit">
                        <Route
                            path=":product_id"
                            element={<AdminProductDetail />}
                        />
                    </Route>
                </Route>
                <Route path="order" element={<AdminOrder />} />
            </Route>
        </Routes>
    </BrowserRouter>
    // </StrictMode>,
);
