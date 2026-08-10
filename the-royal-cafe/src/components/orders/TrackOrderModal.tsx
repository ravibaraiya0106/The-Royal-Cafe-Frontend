import React, { useEffect, useState } from "react";
import {
  FiX,
  FiTruck,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiClock,
  FiPackage,
} from "react-icons/fi";
import LiveDeliveryMap from "@/components/common/LiveDeliveryMap";
import { getSocket } from "@/config/socket";

export type OrderTrackInfo = {
  _id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  final_amount: number;
  deliveryLocation?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  phone: string;
  createdAt: string;
  delivery_person?: {
    name: string;
    phone: string;
    vehicle_type?: string;
    vehicle_number?: string;
  };
};

type Props = {
  order: OrderTrackInfo | null;
  onClose: () => void;
};

const ORDER_STEPS = [
  { key: "confirmed", label: "Order Confirmed" },
  { key: "preparing", label: "Preparing in Kitchen" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export const TrackOrderModal: React.FC<Props> = ({ order, onClose }) => {
  const [currentStatus, setCurrentStatus] = useState<string>(
    order?.order_status || "confirmed",
  );

  useEffect(() => {
    if (!order) return;
    setCurrentStatus(order.order_status);

    // Listen to real-time status updates via Socket.IO
    const socket = getSocket();
    socket.emit("join_order", order._id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleStatusUpdate = (data: any) => {
      if (data && data.orderId === order._id && data.status) {
        setCurrentStatus(data.status);
      }
    };

    socket.on("order:status_update", handleStatusUpdate);

    return () => {
      socket.off("order:status_update", handleStatusUpdate);
      socket.emit("leave_order", order._id);
    };
  }, [order]);

  if (!order) return null;

  const getStepIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s === "delivered") return 3;
    if (s === "out_for_delivery" || s === "picked") return 2;
    if (s === "preparing") return 1;
    return 0; // confirmed / default
  };

  const activeStepIdx = getStepIndex(currentStatus);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-[5px] border border-gray-200 shadow-2xl w-full max-w-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-brand text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FiTruck className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold font-serif">
                Track Order #{order.order_number}
              </h2>
              <p className="text-[11px] text-gray-200">
                Live delivery status & real-time GPS map tracking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-all text-white"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Order Status Progress Bar */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-[5px] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Delivery Progress
              </span>
              <span className="text-xs font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-[5px] uppercase">
                {currentStatus.replace(/_/g, " ")}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 relative">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx <= activeStepIdx;
                const isCurrent = idx === activeStepIdx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center space-y-1.5 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isPassed
                          ? "bg-brand text-white ring-2 ring-brand/30"
                          : "bg-gray-200 text-gray-500"
                      } ${isCurrent ? "animate-pulse" : ""}`}
                    >
                      {isPassed ? <FiCheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-semibold leading-tight ${
                        isPassed ? "text-brand" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Delivery Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <FiMapPin className="text-brand w-4 h-4" />
                <span>Live Partner GPS Tracking</span>
              </span>
              <span className="text-[11px] font-semibold text-green-700 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-[5px] border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
                Live Map Online
              </span>
            </div>

            <LiveDeliveryMap
              orderId={order._id}
              destinationCoords={
                order.deliveryLocation &&
                order.deliveryLocation.latitude &&
                order.deliveryLocation.longitude
                  ? {
                      lat: order.deliveryLocation.latitude,
                      lng: order.deliveryLocation.longitude,
                    }
                  : undefined
              }
              destinationAddress={order.deliveryLocation?.address}
              height="280px"
            />
          </div>

          {/* Delivery Partner Details Card (If assigned) */}
          {order.delivery_person && (
            <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-[5px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  {order.delivery_person.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Assigned Delivery Partner</p>
                  <p className="text-sm font-bold text-gray-900">{order.delivery_person.name}</p>
                  {order.delivery_person.vehicle_number && (
                    <p className="text-xs text-gray-600 font-mono">
                      {order.delivery_person.vehicle_type || "Vehicle"}: {order.delivery_person.vehicle_number}
                    </p>
                  )}
                </div>
              </div>

              {order.delivery_person.phone && (
                <a
                  href={`tel:${order.delivery_person.phone}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white text-xs font-bold rounded-[5px] hover:bg-brand/90 transition-all shadow-xs self-start sm:self-auto"
                >
                  <FiPhone className="w-3.5 h-3.5" />
                  <span>Call Delivery Partner</span>
                </a>
              )}
            </div>
          )}

          {/* Order Details Summary */}
          <div className="bg-white border border-gray-200 p-4 rounded-[5px] space-y-2 text-xs text-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-semibold text-gray-500 flex items-center gap-1">
                <FiPackage className="w-3.5 h-3.5 text-brand" /> Total Amount:
              </span>
              <span className="font-bold text-brand text-sm">
                ₹{order.final_amount} ({order.payment_method})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-500 flex items-center gap-1">
                <FiClock className="w-3.5 h-3.5 text-brand" /> Destination Address:
              </span>
              <span className="font-semibold text-gray-900 truncate max-w-[300px]">
                {order.deliveryLocation?.address || "Delivery address missing"}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 text-xs font-bold rounded-[5px] hover:bg-gray-300 transition-all shadow-xs"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
