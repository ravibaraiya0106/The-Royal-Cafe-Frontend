import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/common/Home";
import About from "@/pages/common/About";
import Contact from "@/pages/common/Contact";
import Blog from "@/pages/blog/Blog";

import { ROUTES } from "@/constants/navigation";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Default redirect */}
        <Route path="" element={<Navigate to={ROUTES.HOME} />} />

        {/*  Pages */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.BLOG} element={<Blog />} />

        {/*  Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
