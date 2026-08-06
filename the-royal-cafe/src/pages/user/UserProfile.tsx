import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Separator from "@/components/common/Seperator";
import { getUser, logout } from "@/utils/storage";
import { Navigate, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/Navigation";
import { useEffect, useState } from "react";

import ProfileHero from "@/components/profile/ProfileHero";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileActions from "@/components/profile/ProfileActions";
import ProfileCTA from "@/components/profile/ProfileCTA";

const UserProfile = () => {
  const [user, setUser] = useState(() => getUser());
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => setUser(getUser());
    window.addEventListener("authChanged", updateUser);
    return () => window.removeEventListener("authChanged", updateUser);
  }, []);

  if (!user || typeof user !== "object") return <Navigate to={ROUTES.HOME} replace />;

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <Navbar />

      <ProfileHero user={user} />
      <ProfileInfo user={user} />

      <Separator />

      <ProfileActions user={user} onLogout={handleLogout} />

      <Separator />

      <ProfileCTA redirectTo={ROUTES.ITEMS} />

      <Separator />

      <Footer />
    </>
  );
};

export default UserProfile;
