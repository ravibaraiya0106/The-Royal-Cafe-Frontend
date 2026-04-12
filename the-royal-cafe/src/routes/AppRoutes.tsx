import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/common/Home";
import About from "@/pages/common/About";
import Contact from "@/pages/common/Contact";
import Blog from "@/pages/blogs/Blogs";
import BlogDetails from "@/pages/blogs/BlogDetails";
import Items from "@/pages/items/Items";
import { AdminRoutes } from "@/routes/AdminRoutes";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { ROUTES } from "@/constants/Navigation";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Auth routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        {/*  Pages */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.ITEMS} element={<Items />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.BLOGS} element={<Blog />} />
        <Route path={ROUTES.BLOG_DETAILS} element={<BlogDetails />} />
        <Route path={ROUTES.FOOD_ITEM} element={<Items />} />

        {AdminRoutes}
        {/*  Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
