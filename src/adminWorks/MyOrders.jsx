import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
  EyeIcon,
  ArrowLeftIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

import { STATUSES } from "../globals/misc/statuses";
import Loader from "../globals/loader/loader";
import { deleteOrder, getAllOrders } from "../store/orderSlice";



export default function MyOrders() {

  const dispatch = useDispatch();

  const { orders, status } = useSelector((state) => state.order);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [
      ...new Set(
        orders
          ?.map((order) => order.Order_Status)
          .filter(Boolean)
      ),
    ];

    return uniqueStatuses;
  }, [orders]);

 

  const isDateInRange = (date, filter) => {
    if (filter === "All") return true;

    const orderDate = new Date(date);
    const now = new Date();

    if (filter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      return orderDate >= sevenDaysAgo;
    }

    if (filter === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      return orderDate >= thirtyDaysAgo;
    }

    if (filter === "3months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);

      return orderDate >= threeMonthsAgo;
    }

    if (filter === "6months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      return orderDate >= sixMonthsAgo;
    }

    return true;
  };

  // --------------------------------------------------
  // Filter + Search + Sort
  // --------------------------------------------------

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let result = [...orders];

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(
        (order) => order.Order_Status === statusFilter
      );
    }

    // Date filter
    result = result.filter((order) =>
      isDateInRange(order.createdAt, dateFilter)
    );

    // Search
    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((order) => {
        const orderId = order._id?.toLowerCase() || "";

        const paymentMethod =
          order.Payment_Details?.method?.toLowerCase() || "";

        const paymentStatus =
          order.Payment_Details?.status?.toLowerCase() || "";

        const productNames =
          order.Items?.map(
            (item) =>
              item.product?.Product_Name?.toLowerCase() || ""
          ).join(" ") || "";

        return (
          orderId.includes(searchValue) ||
          paymentMethod.includes(searchValue) ||
          paymentStatus.includes(searchValue) ||
          productNames.includes(searchValue)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [orders, search, statusFilter, dateFilter, sortOrder]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (status === STATUSES.LOADING) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // --------------------------------------------------
  // Empty orders
  // --------------------------------------------------

  if (!orders || orders.length === 0) {
    return (
      <main className="min-h-[60vh] px-4 py-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-20">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            No Orders Yet
          </h1>

          <p className="mt-2 text-slate-500 max-w-md">
            No-one has placed orders yet.Once someone orders, it will appear
            here.
          </p>
        </div>
      </main>
    );
  }


  const handleDeleteClick = async(id)=>{
    const confirmed = window.confirm(
        "Are you sure you want to delete this order?"
      );
      if (!confirmed) return;
      const response = await dispatch(deleteOrder(id))
      if (response) {
        alert("Order deleted successfully.");
      } else {
        alert("Failed to delete order.");
      }
    };

  return (
    <main className="bg-slate-50 min-h-screen px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">

    <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </Link>

  

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>

            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-slate-900">
            Order's
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View and track everything people ordered from IshShop.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {orders.length}
            </span>{" "}
            orders
          </div>
        </div>

        {/* =========================================
            SEARCH + FILTER BAR
        ========================================= */}

        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product, order ID or payment method..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-3">

            {/* Status */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <FunnelIcon className="w-5 h-5 text-slate-400 shrink-0" />

              <button
                onClick={() => setStatusFilter("All")}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  statusFilter === "All"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>

              {statuses.map((statusName) => (
                <button
                  key={statusName}
                  onClick={() => setStatusFilter(statusName)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    statusFilter === statusName
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {statusName}
                </button>
              ))}
            </div>

            <div className="hidden lg:block flex-1" />

            {/* Date Filter */}
            <div className="relative">
              <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 pl-9 pr-9 appearance-none rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Dates</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
              </select>

              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-10 px-4 pr-9 appearance-none rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* =========================================
            NO FILTER RESULTS
        ========================================= */}

        {filteredOrders.length === 0 && (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl py-16 text-center">

            <MagnifyingGlassIcon className="mx-auto w-10 h-10 text-slate-300" />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No matching orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setDateFilter("All");
              }}
              className="mt-5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* =========================================
            ORDERS
        ========================================= */}

        <div className="mt-8 space-y-6">

          {filteredOrders.map((order) => {

            const isPaid =
              order.Payment_Details?.status === "Paid";

            const paymentMethod =
              order.Payment_Details?.method ||
              "Cash on Delivery";

            const orderStatus =
              order.Order_Status || "Pending";

            // Status styling
            let statusClass =
              "bg-blue-100 text-blue-700";

            if (orderStatus === "Completed") {
              statusClass = "bg-green-100 text-green-700";
            }

            if (orderStatus === "Cancelled") {
              statusClass = "bg-red-100 text-red-700";
            }

            if (orderStatus === "On the Way") {
              statusClass = "bg-purple-100 text-purple-700";
            }

            return (
              <div
                key={order._id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >

                {/* =====================================
                    ORDER TOP
                ===================================== */}

                <div className="p-5 md:p-6 border-b border-slate-200">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Order ID
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 break-all">
                        #{order._id}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusClass}`}
                      >
                        {orderStatus}
                      </span>

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isPaid ? "Paid" : "Not Paid"}
                      </span>

                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {paymentMethod === "Khalti"
                          ? "Khalti"
                          : "Cash on Delivery"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* =====================================
                    PRODUCTS
                ===================================== */}

                <div className="p-5 md:p-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {order.Items?.map((item, index) => {

                      const product = item.product;

                      return (
                        <div
                          key={item._id || index}
                          className="flex gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50"
                        >

                          {/* Image */}
                          <div className="w-20 h-20 shrink-0 rounded-lg bg-white border border-slate-200 p-2">
                            <img
                              src={product?.Product_Image}
                              alt={
                                product?.Product_Name ||
                                "Product"
                              }
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Details */}
                          <div className="min-w-0 flex-1">

                            <h3 className="font-semibold text-sm text-slate-900 line-clamp-2">
                              {product?.Product_Name ||
                                "Product"}
                            </h3>

                            <p className="mt-2 text-xs text-slate-500">
                              Quantity:{" "}
                              <span className="font-semibold text-slate-700">
                                {item.quantity}
                              </span>
                            </p>

                            {item.price && (
                              <p className="mt-1 text-xs text-slate-500">
                                Price:{" "}
                                <span className="font-semibold text-slate-700">
                                  Rs. {item.price}
                                </span>
                              </p>
                            )}

                          </div>

                        </div>
                      );
                    })}

                  </div>

                </div>

                {/* =====================================
                    ORDER BOTTOM
                ===================================== */}

                <div className="px-5 md:px-6 py-5 bg-slate-50 border-t border-slate-200">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

    {/* Payment */}
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">
        Payment
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {paymentMethod === "Khalti"
          ? "Paid through Khalti"
          : "Cash on Delivery"}
      </p>
    </div>

    {/* Right side */}
    <div className="flex items-center justify-between sm:justify-end gap-6">

      {/* Total */}
      <div className="text-left sm:text-right">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Total Amount
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          Rs. {order.Total_Amount}
        </p>
      </div>

      {/* View Order */}
      <Link
        to={`/admin/orders/${order._id}`}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
      >
        <EyeIcon className="w-4 h-4" />
        View Order
      </Link>

      <button
        onClick={()=>handleDeleteClick(order._id)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
      >
        <TrashIcon className="w-4 h-4" />
        Delete Order
      </button>

    </div>

  </div>
</div>

              </div>
            );
          })}

        </div>

      </div>
    </main>
  );
}