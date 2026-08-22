import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  BanknotesIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { getAllOrders } from "../store/orderSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { orders = [], status } = useSelector(
    (state) => state.order
  );

  // =========================================
  // FETCH ORDERS
  // =========================================

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // =========================================
  // TOTAL REVENUE
  // =========================================

  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (total, order) =>
        total + (Number(order.Total_Amount) || 0),
      0
    );
  }, [orders]);

  // =========================================
  // ORDER STATISTICS
  // =========================================

  const orderStats = useMemo(() => {
    return {
      pending: orders.filter(
        (order) => order.Order_Status === "Pending"
      ).length,

      preparing: orders.filter(
        (order) => order.Order_Status === "Preparing"
      ).length,

      onTheWay: orders.filter(
        (order) => order.Order_Status === "On the Way"
      ).length,

      delivered: orders.filter(
        (order) => order.Order_Status === "Delivered"
      ).length,

      cancelled: orders.filter(
        (order) => order.Order_Status === "Cancelled"
      ).length,
    };
  }, [orders]);

  // =========================================
  // RECENT ORDERS
  // =========================================

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200">
        <div className="px-6 md:px-8 py-5 flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-500">
              Admin Panel
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-900">
                Admin
              </p>

              <p className="text-xs text-slate-500">
                IshShop
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>

          </div>

        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="px-6 md:px-8 py-8 max-w-7xl mx-auto">

        {/* ================= WELCOME ================= */}

        <div className="mb-8">

          <h2 className="text-xl font-semibold text-slate-900">
            Welcome back, Admin 👋
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your store today.
          </p>

        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <StatCard
            title="Total Revenue"
            value={`Rs. ${totalRevenue.toLocaleString()}`}
            icon={BanknotesIcon}
            description="From all orders"
          />

          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={ShoppingBagIcon}
            description="All orders"
          />

          <StatCard
            title="Delivered Orders"
            value={orderStats.delivered}
            icon={CheckCircleIcon}
            description="Successfully delivered"
          />

          <StatCard
            title="Cancelled Orders"
            value={orderStats.cancelled}
            icon={XCircleIcon}
            description="Cancelled orders"
          />

        </div>

        {/* ================= ORDER STATUS ================= */}

        <section className="mt-8">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Order Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Current status of your orders
              </p>
            </div>

            <a
              href="/admin/orders"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View Orders
              <ArrowRightIcon className="w-4 h-4" />
            </a>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

            <OrderStatus
              title="Pending"
              value={orderStats.pending}
              icon={ClockIcon}
              iconClass="text-amber-600 bg-amber-100"
            />

            <OrderStatus
              title="Preparing"
              value={orderStats.preparing}
              icon={CubeIcon}
              iconClass="text-orange-600 bg-orange-100"
            />

            <OrderStatus
              title="On the Way"
              value={orderStats.onTheWay}
              icon={TruckIcon}
              iconClass="text-blue-600 bg-blue-100"
            />

            <OrderStatus
              title="Delivered"
              value={orderStats.delivered}
              icon={CheckCircleIcon}
              iconClass="text-green-600 bg-green-100"
            />

            <OrderStatus
              title="Cancelled"
              value={orderStats.cancelled}
              icon={XCircleIcon}
              iconClass="text-red-600 bg-red-100"
            />

          </div>

        </section>

        {/* ================= CONTENT GRID ================= */}

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ================= RECENT ORDERS ================= */}

          <section className="xl:col-span-2 bg-white border border-slate-200 rounded-xl">

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Orders
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Latest orders from your customers
                </p>
              </div>

              <a
                href="/admin/orders"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </a>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-200 text-left">

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {recentOrders.length > 0 ? (

                    recentOrders.map((order) => (

                      <OrderRow
                        key={order._id}
                        id={`#${order._id.slice(-7)}`}
                        customer={
                          order.user?.user_Name ||
                          "Unknown User"
                        }
                        amount={`Rs. ${(
                          Number(order.Total_Amount) || 0
                        ).toLocaleString()}`}
                        status={
                          order.Order_Status || "Pending"
                        }
                      />

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-sm text-slate-500"
                      >
                        No orders found.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

          {/* ================= QUICK ACTIONS ================= */}

          <section className="bg-white border border-slate-200 rounded-xl">

            <div className="px-6 py-5 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage your store
              </p>

            </div>

            <div className="p-6 space-y-3">

              <QuickAction
                icon={PlusIcon}
                title="Add Product"
                description="Add a new product"
                href="/admin/products/new"
              />

              <QuickAction
                icon={ShoppingBagIcon}
                title="Manage Orders"
                description="View and manage orders"
                href="/admin/orders"
              />

              <QuickAction
                icon={CubeIcon}
                title="Manage Products"
                description="View all products"
                href="/admin/products"
              />

              <QuickAction
                icon={UsersIcon}
                title="Manage Users"
                description="View customers"
                href="/admin/users"
              />

            </div>

          </section>

        </div>

        {/* ================= BOTTOM GRID ================= */}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ================= PAYMENT OVERVIEW ================= */}

          <section className="bg-white border border-slate-200 rounded-xl p-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BanknotesIcon className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Payment Overview
                </h2>

                <p className="text-sm text-slate-500">
                  Payments received from orders
                </p>
              </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <PaymentOverview
                orders={orders}
                method="Khalti"
              />

              <PaymentOverview
                orders={orders}
                method="COD"
              />

            </div>

          </section>

          {/* ================= INVENTORY ================= */}

          <section className="bg-white border border-slate-200 rounded-xl p-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <CubeIcon className="w-5 h-5 text-amber-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Inventory Alerts
                </h2>

                <p className="text-sm text-slate-500">
                  Products that need attention
                </p>
              </div>

            </div>

            <div className="mt-6">

              <p className="text-sm text-slate-500">
                Inventory data is not connected yet.
              </p>

              <a
                href="/admin/products"
                className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Manage Products
                <ArrowRightIcon className="w-4 h-4" />
              </a>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};


/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

        </div>

        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>

      </div>

      <p className="mt-4 text-xs font-medium text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* ========================================================= */
/* ORDER STATUS */
/* ========================================================= */

function OrderStatus({
  title,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">

      <div className="flex items-center gap-3">

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClass}`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-xl font-bold text-slate-900">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


/* ========================================================= */
/* ORDER ROW */
/* ========================================================= */

function OrderRow({
  id,
  customer,
  amount,
  status,
}) {
  const statusStyles = {
    Pending: "bg-amber-100 text-amber-700",

    Preparing:
      "bg-orange-100 text-orange-700",

    "On the Way":
      "bg-blue-100 text-blue-700",

    Delivered:
      "bg-green-100 text-green-700",

    Cancelled:
      "bg-red-100 text-red-700",
  };

  return (
    <tr className="hover:bg-slate-50 transition">

      <td className="px-6 py-4">
        <p className="text-sm font-semibold text-slate-900">
          {id}
        </p>

      </td>

      <td className="px-6 py-4">
        <p className="text-sm text-slate-700">
          {customer}
        </p>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm font-semibold text-slate-900">
          {amount}
        </p>

      </td>

      <td className="px-6 py-4">

        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            statusStyles[status] ||
            "bg-slate-100 text-slate-700"
          }`}
        >
          {status}
        </span>

      </td>

    </tr>
  );
}


/* ========================================================= */
/* QUICK ACTION */
/* ========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition group"
    >

      <div className="w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-blue-100 flex items-center justify-center transition">

        <Icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />

      </div>

      <div className="flex-1">

        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="text-xs text-slate-500 mt-0.5">
          {description}
        </p>

      </div>

      <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />

    </a>
  );
}


/* ========================================================= */
/* PAYMENT OVERVIEW */
/* ========================================================= */

function PaymentOverview({ orders, method }) {
  const paymentOrders = orders.filter(
    (order) => order.Payment_Details?.method === method
  );

  const amount = paymentOrders.reduce(
    (total, order) =>
      total + (Number(order.Total_Amount) || 0),
    0
  );

  return (
    <div className="bg-slate-50 rounded-lg p-4">

      <p className="text-sm text-slate-500">
        {method === "COD" ? "Cash on Delivery" : method}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        Rs. {amount.toLocaleString()}
      </p>

      <p className="mt-1 text-xs text-slate-500 font-medium">
        {paymentOrders.length} orders
      </p>

    </div>
  );
}


export default Dashboard;