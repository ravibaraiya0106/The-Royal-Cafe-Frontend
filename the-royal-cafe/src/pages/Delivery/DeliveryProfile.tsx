import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiTruck,
  FiShield,
  FiLogOut,
} from "react-icons/fi";
import DeliveryLayout from "@/Layouts/DeliveryLayout";
import { getUser, clearAuth } from "@/utils/storage";
import {
  getMyDeliveriesService,
  type DeliveryPersonProfile,
} from "@/services/deliveryService";
import { ROUTES } from "@/constants/Navigation";

const DeliveryProfile = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [profile, setProfile] = useState<DeliveryPersonProfile | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyDeliveriesService({ status: "completed" });
        if (res.delivery_person) {
          setProfile(res.delivery_person);
        }
        setCompletedCount(res.total || 0);
      } catch (err) {
        console.error("Failed to load profile details", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.dispatchEvent(new Event("authChanged"));
    navigate(ROUTES.DELIVERY_LOGIN);
  };

  return (
    <DeliveryLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header Brief */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-brand text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {(user?.username || "D")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-serif">
              {profile?.name || user?.first_name ? `${user?.first_name} ${user?.last_name || ""}` : user?.username}
            </h1>
            <p className="text-xs font-semibold text-brand uppercase tracking-wider mt-0.5">
              Verified Delivery Partner
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand border-b border-gray-100 pb-3">
            Agent Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <FiUser className="w-3.5 h-3.5 text-brand" />
                Username / Agent ID
              </span>
              <p className="text-gray-900 font-semibold">{user?.username}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <FiPhone className="w-3.5 h-3.5 text-brand" />
                Phone Number
              </span>
              <p className="text-gray-900 font-semibold">{profile?.phone || user?.phone_no || "-"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <FiMail className="w-3.5 h-3.5 text-brand" />
                Email Address
              </span>
              <p className="text-gray-900 font-semibold">{profile?.email || user?.email || "-"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <FiShield className="w-3.5 h-3.5 text-brand" />
                Total Deliveries Completed
              </span>
              <p className="text-green-700 font-bold">{completedCount} Orders Completed</p>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand border-b border-gray-100 pb-3 flex items-center gap-2">
            <FiTruck className="w-4 h-4" />
            <span>Vehicle Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 block">Vehicle Type</span>
              <span className="text-gray-900 font-bold capitalize">
                {profile?.vehicle_type || "Bike"}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 block">Vehicle Registration Number</span>
              <span className="text-gray-900 font-bold uppercase">
                {profile?.vehicle_number || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout from Delivery Portal</span>
          </button>
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryProfile;
