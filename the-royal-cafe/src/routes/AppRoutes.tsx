import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/common/Home";
import About from "@/pages/common/About";
import Contact from "@/pages/common/Contact";
import Blog from "@/pages/blogs/Blogs";
import BlogDetails from "@/pages/blogs/BlogDetails";
import Items from "@/pages/items/Items";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { ROUTES } from "@/constants/Navigation";
import UserProfile from "@/pages/user/UserProfile";
import OrderHistory from "@/pages/user/OrderHistory";
import UserProtectedRoute from "@/routes/UserProtectedRoute";
import Cart from "@/pages/cart/Cart";
import Checkout from "@/pages/checkout/Checkout";
import Reviews from "@/pages/reviews/Reviews";

import DeliveryProtectedRoute from "@/routes/DeliveryProtectedRoute";
import DeliveryLogin from "@/pages/Delivery/DeliveryLogin";
import DeliveryDashboard from "@/pages/Delivery/DeliveryDashboard";
import DeliveryOrders from "@/pages/Delivery/DeliveryOrders";
import DeliveryHistory from "@/pages/Delivery/DeliveryHistory";
import DeliveryProfile from "@/pages/Delivery/DeliveryProfile";

import ResetPassword from "@/pages/auth/ResetPassword";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Pages */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.ITEMS} element={<Items />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.BLOGS} element={<Blog />} />
        <Route path={ROUTES.BLOG_DETAILS} element={<BlogDetails />} />
        <Route path={ROUTES.FOOD_ITEM} element={<Items />} />
        <Route path={ROUTES.CART} element={<Cart />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route
          path={ROUTES.USER_PROFILE}
          element={
            <UserProtectedRoute>
              <UserProfile />
            </UserProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDER_HISTORY}
          element={
            <UserProtectedRoute>
              <OrderHistory />
            </UserProtectedRoute>
          }
        />
        <Route path={ROUTES.REVIEWS} element={<Reviews />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Delivery Boy Portal Routes */}
        <Route path={ROUTES.DELIVERY_LOGIN} element={<DeliveryLogin />} />
        <Route
          path={ROUTES.DELIVERY_DASHBOARD}
          element={
            <DeliveryProtectedRoute>
              <DeliveryDashboard />
            </DeliveryProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DELIVERY_ORDERS}
          element={
            <DeliveryProtectedRoute>
              <DeliveryOrders />
            </DeliveryProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DELIVERY_HISTORY}
          element={
            <DeliveryProtectedRoute>
              <DeliveryHistory />
            </DeliveryProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DELIVERY_PROFILE}
          element={
            <DeliveryProtectedRoute>
              <DeliveryProfile />
            </DeliveryProtectedRoute>
          }
        />

        {AdminRoutes}
        {/*  Fallback */}
        <Route
          path="/admin/*"
          element={<Navigate to={ROUTES.HOME} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
