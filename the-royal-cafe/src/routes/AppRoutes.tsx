import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/common/Home";
import About from "@/pages/common/About";
import Contact from "@/pages/common/Contact";
import Blog from "@/pages/blog/Blog";
import Items from "@/pages/items/Items";
import { AdminRoutes } from "@/routes/AdminRoutes";

import { ROUTES } from "@/constants/Navigation";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Pages */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.ITEMS} element={<Items />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.BLOG} element={<Blog />} />
        <Route path={ROUTES.FOOD_ITEM} element={<Items />} />
        {AdminRoutes}
        {/*  Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
