import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

import {
  getOrderById,
  updateOrder,
  cancelOrder,
} from "../store/orderSlice";

import { STATUSES } from "../globals/misc/statuses";
import Loader from "../globals/loader/loader";

export default function SingleOrder() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedOrder, status } = useSelector(
    (state) => state.order
  );

  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getOrderById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedOrder) {
      setSelectedStatus(selectedOrder.Order_Status);
    }
  }, [selectedOrder]);

  // Loading
  if (status === STATUSES.LOADING) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader message="Please Wait"/>
      </div>
    );
  }

  // Order not found
  if (!selectedOrder) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Order Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            We couldn't find this order.
          </p>

          <Link
            to="/admin/orders"
            className="inline-block mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const order = selectedOrder;

  const isPaid =
    order.Payment_Details?.status === "Paid";

  const paymentMethod =
    order.Payment_Details?.method || "Cash on Delivery";

  const subtotal =
    order.Items?.reduce(
      (total, item) =>
        total +
        (item.product?.Product_Price || 0) *
          (item.quantity || 0),
      0
    ) || 0;

  // Update status
  const handleStatusUpdate = async () => {
    if (selectedStatus === order.Order_Status) {
      return;
    }
    await dispatch(
      updateOrder(order._id,selectedStatus)
    );

    // Refresh order
    dispatch(getOrderById(order._id));
  };

  // Cancel order
  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    await dispatch(cancelOrder(order._id));

    dispatch(getOrderById(order._id));
  };

  return (
    <main className="px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          <div>
            <p className="text-sm text-slate-500">
              Order Details
            </p>

            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-slate-900 break-all">
              #{order._id}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>

          {/* Current Status */}
          <StatusBadge status={order.Order_Status} />

        </div>

        {/* Main Grid */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">

            {/* Order Items */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">

              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Order Items
                </h2>
              </div>

              <div className="divide-y divide-slate-200">

                {order.Items?.map((item, index) => {
                  const product = item.product;

                  return (
                    <div
                      key={item._id || index}
                      className="p-6 flex flex-col sm:flex-row gap-5"
                    >

                      {/* Product Image */}
                      <div className="w-24 h-24 shrink-0 bg-slate-100 rounded-lg p-2">
                        <img
                          src={product?.Product_Image}
                          alt={product?.Product_Name || "Product"}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">

                        <h3 className="font-semibold text-slate-900">
                          {product?.Product_Name || "Product"}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          Quantity:{" "}
                          <span className="font-medium text-slate-800">
                            {item.quantity}
                          </span>
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Price:{" "}
                          <span className="font-medium text-slate-800">
                            Rs. {product?.Product_Price || 0}
                          </span>
                        </p>

                      </div>

                      {/* Item Total */}
                      <div className="sm:text-right">

                        <p className="text-xs text-slate-500">
                          Item Total
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          Rs.{" "}
                          {(product?.Product_Price || 0) *
                            (item.quantity || 0)}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>
            </section>

            {/* Customer / Shipping Information */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">

              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Customer & Shipping Information
                </h2>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Shipping Address
                  </p>

                  <p className="mt-2 font-medium text-slate-900">
                    {order.Shipping_Address}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Phone Number
                  </p>

                  <p className="mt-2 font-medium text-slate-900">
                    {order.Phone_Number}
                  </p>
                </div>

              </div>
            </section>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Update Status */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">

              <h2 className="text-lg font-semibold text-slate-900">
                Manage Order
              </h2>

              <div className="mt-5">

                <label className="text-sm font-medium text-slate-700">
                  Order Status
                </label>

                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value)
                  }
                  className="mt-2 w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Preparing">
                    Preparing
                  </option>

                  <option value="On the Way">
                    On the Way
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

                <button
                  onClick={handleStatusUpdate}
                  disabled={
                    selectedStatus === order.Order_Status
                  }
                  className="mt-4 w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Update Status
                </button>

              </div>

              {/* Cancel */}
              {order.Order_Status !== "Cancelled" &&
                order.Order_Status !== "Delivered" && (
                  <button
                    onClick={handleCancelOrder}
                    className="mt-3 w-full px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}

            </section>

            {/* Order Summary */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">

              <h2 className="text-lg font-semibold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-slate-900">
                    Rs. {subtotal}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-between">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    Rs. {order.Total_Amount}
                  </span>
                </div>

              </div>

            </section>

            {/* Payment */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">

              <h2 className="text-lg font-semibold">
                Payment
              </h2>

              <div className="mt-5 space-y-4">

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Method
                  </span>

                  <span className="font-semibold">
                    {paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {isPaid ? "Paid" : "Not Paid"}
                  </span>
                </div>

              </div>

            </section>

          </div>

        </div>

      </div>
    </main>
  );
}


/* Status Badge */

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-100 text-amber-700",
    Preparing: "bg-blue-100 text-blue-700",
    "On the Way" : "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}