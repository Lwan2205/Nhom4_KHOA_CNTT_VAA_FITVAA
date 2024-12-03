import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import ProductList from "../component/ProductList";
import ProductDetail from "../component/ProductDetail";
import Cart from "../component/Cart";
import Order from "../component/Order";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import AllProduct from "../pages/AllProduct"
import AddProduct from "../component/AddProduct";
import OrderList from "../pages/OrderList";
import OrderDetail from "../component/OrderDetail";
import UserProfile from "../pages/UserProfile";
import ManufacturerList from "../pages/ManufacturerList";
import AddManufacturer from "../component/AddManufacturer";
import DiscountList from "../pages/DiscountList";
import AddDiscount from "../component/AddDiscount";
import SearchResults from "../component/SearchResults";
import UserOrders from "../component/UserOrders";
import ProductListByBrand from "../component/ProductListByBrand";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import CategoryList from "../pages/CategoryList";
import AddCategory from "../component/AddCategory";
import PaymentStatus from "../component/PaymentStatus";
import FeedBack from "../pages/FeedBack";
import ProductListDiscount from "../component/ProductListDiscount";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "sign-up",
                element: <SignUp />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: ":categoryId/products",
                element: <ProductList />
            },
            {
                path: "products/:productId",
                element: <ProductDetail />
            },
            {
                path: "cart",
                element: <Cart />
            },
            {
                path: "order",
                element: <Order />
            },
            {
                path: "orders/:id",
                element: <OrderDetail />
            },
            {
                path: "user",
                element: <UserProfile />
            },
            {
                path: 'search-results',
                element: <SearchResults />
            },
            {
                path: 'userOder',
                element: <UserOrders />
            },
            {
                path: 'brand/:brandId',
                element: <ProductListByBrand />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
            {
                path: 'reset-password/:resetToken',
                element: <ResetPassword />
            },
            {
                path: 'payment-status',
                element: <PaymentStatus />
            },
            {
                path: 'feedback',
                element: <FeedBack />
            },
            {
                path: 'discount',
                element: < ProductListDiscount />
            },

            {
                path: "admin-panel",
                element: <AdminPanel />,
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers />
                    },
                    {
                        path: "all-products",
                        element: <AllProduct />,

                    },
                    {
                        path: "all-products/add-product",
                        element: <AddProduct />
                    },
                    {
                        path: "all-orders",
                        element: <OrderList />
                    },
                    {
                        path: "all-manufactures",
                        element: <ManufacturerList />
                    },
                    {
                        path: "all-manufactures/add-all-manufactures",
                        element: <AddManufacturer />
                    },
                    {
                        path: "all-discounts",
                        element: <DiscountList />
                    },
                    {
                        path: "all-discounts/add-discount",
                        element: <AddDiscount />
                    },
                    {
                        path: "all-categories",
                        element: <CategoryList />
                    },
                    {
                        path: "all-categories/add-category",
                        element: <AddCategory />
                    }



                ]
            }


        ]

    }

])

export default router;