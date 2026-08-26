import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  MagnifyingGlassIcon,
  CubeIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

import { STATUSES } from "../globals/misc/statuses";
import Loader from "../globals/loader/loader";

import {
  getAllProducts,
  deleteProduct,
} from "../store/productSlice";
import { Link } from "react-router-dom";


export default function ManageProducts() {

  const dispatch = useDispatch();

  const {
    products = [],
    status,
  } = useSelector((state) => state.product);


  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");


  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);


  // =========================================
  // PRODUCT STATISTICS
  // =========================================

  const stats = useMemo(() => {

    const total = products.length;

    const available = products.filter(
      (product) =>
        product.Product_Status === "Available"
    ).length;

    const unavailable = products.filter(
      (product) =>
        product.Product_Status === "Unavailable"
    ).length;

    const lowStock = products.filter(
      (product) =>
        Number(product.Product_StockQTY) > 0 &&
        Number(product.Product_StockQTY) <= 5
    ).length;

    const outOfStock = products.filter(
      (product) =>
        Number(product.Product_StockQTY) === 0
    ).length;

    return {
      total,
      available,
      unavailable,
      lowStock,
      outOfStock,
    };

  }, [products]);


  // =========================================
  // SEARCH + FILTER
  // =========================================

  const filteredProducts = useMemo(() => {

    let result = [...products];

    // Search

    if (search.trim()) {

      const value = search
        .toLowerCase()
        .trim();

      result = result.filter((product) =>
        product.Product_Name
          ?.toLowerCase()
          .includes(value)
      );

    }


    // Stock filter

    if (stockFilter === "In Stock") {

      result = result.filter(
        (product) =>
          Number(product.Product_StockQTY) > 0
      );

    }

    if (stockFilter === "Low Stock") {

      result = result.filter(
        (product) =>
          Number(product.Product_StockQTY) > 0 &&
          Number(product.Product_StockQTY) <= 5
      );

    }

    if (stockFilter === "Out of Stock") {

      result = result.filter(
        (product) =>
          Number(product.Product_StockQTY) === 0
      );

    }

    return result;

  }, [products, search, stockFilter]);


// DELETE
  const handleDelete = async (product) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.Product_Name}"?`
    );

    if (!confirmed) return;

    try {

      await dispatch(
        deleteProduct(product._id)
      );

    } catch (error) {

      console.log(error);

      alert("Failed to delete product.");

    }

  };

//Edit 
const handleEdit = async(product) =>{
  console.log(product)
}

// LOADING
  if (
    status === STATUSES.LOADING &&
    products.length === 0
  ) {

    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader message="Loading products wait...."/>
      </div>
    );

  }


  return (
    <main className="min-h-screen bg-slate-50 px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </Link>


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div>


            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-slate-900">
              Products
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage products, pricing and inventory.
            </p>

          </div>


          {/* ADD PRODUCT */}

          <a
            href="/admin/products/new"
            className="
              inline-flex items-center justify-center
              gap-2
              px-4 py-2.5
              rounded-lg
              bg-blue-600
              text-white
              text-sm
              font-semibold
              hover:bg-blue-700
              transition
              shadow-sm
            "
          >

            <PlusIcon className="w-5 h-5" />

            Add Product

          </a>

        </div>


        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">

          <ProductStat
            title="Total"
            value={stats.total}
          />

          <ProductStat
            title="Available"
            value={stats.available}
          />

          <ProductStat
            title="Unavailable"
            value={stats.unavailable}
          />

          <ProductStat
            title="Low Stock"
            value={stats.lowStock}
          />

          <ProductStat
            title="Out of Stock"
            value={stats.outOfStock}
          />

        </div>


        {/* =====================================
            SEARCH + FILTER
        ===================================== */}

        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          <div className="flex flex-col md:flex-row gap-3">

            {/* SEARCH */}

            <div className="relative flex-1">

              <MagnifyingGlassIcon
                className="
                  absolute left-4
                  top-1/2
                  -translate-y-1/2
                  w-5 h-5
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products..."
                className="
                  w-full h-11
                  pl-11 pr-4
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>


            {/* STOCK FILTER */}

            <select
              value={stockFilter}
              onChange={(e) =>
                setStockFilter(e.target.value)
              }
              className="
                h-11
                px-4
                rounded-xl
                border border-slate-200
                bg-white
                text-sm
                font-medium
                text-slate-700
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            >

              <option value="All">
                All Stock
              </option>

              <option value="In Stock">
                In Stock
              </option>

              <option value="Low Stock">
                Low Stock
              </option>

              <option value="Out of Stock">
                Out of Stock
              </option>

            </select>

          </div>

        </div>


        {/* =====================================
            PRODUCT TABLE
        ===================================== */}

        <div className="mt-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50 border-b border-slate-200 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Added
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredProducts.length > 0 ? (

                  filteredProducts.map((product) => {

                    const stock =
                      Number(
                        product.Product_StockQTY
                      ) || 0;

                    const isOutOfStock =
                      stock === 0;

                    const isLowStock =
                      stock > 0 && stock <= 5;


                    return (

                      <tr
                        key={product._id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* PRODUCT */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-4">

                            <div className="
                              w-14 h-14
                              rounded-xl
                              bg-slate-50
                              border border-slate-200
                              p-2
                              shrink-0
                            ">

                              <img
                                src={`http://${product.Product_Image}`}
                                alt={product.Product_Name}
                                className="w-full h-full object-contain"
                              />

                            </div>


                            <div className="min-w-0">

                              <p className="
                                text-sm
                                font-semibold
                                text-slate-900
                                line-clamp-2
                              ">
                                {product.Product_Name}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                #{product._id.slice(-7)}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* PRICE */}

                        <td className="px-6 py-4">

                          <p className="text-sm font-semibold text-slate-900">
                            Rs.{" "}
                            {Number(
                              product.Product_Price
                            ).toLocaleString()}
                          </p>

                        </td>


                        {/* STOCK */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2">

                            {isOutOfStock && (
                              <ExclamationTriangleIcon
                                className="w-4 h-4 text-red-500"
                              />
                            )}

                            {isLowStock && (
                              <ExclamationTriangleIcon
                                className="w-4 h-4 text-amber-500"
                              />
                            )}

                            <span
                              className={`
                                text-sm font-semibold
                                ${
                                  isOutOfStock
                                    ? "text-red-600"
                                    : isLowStock
                                    ? "text-amber-600"
                                    : "text-slate-700"
                                }
                              `}
                            >
                              {stock}
                            </span>

                          </div>

                        </td>


                        {/* STATUS */}

                        <td className="px-6 py-4">

                          <span
                            className={`
                              inline-flex
                              px-3 py-1
                              rounded-full
                              text-xs
                              font-semibold
                              ${
                                product.Product_Status ===
                                "Available"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                          >
                            {product.Product_Status}
                          </span>

                        </td>


                        {/* DATE */}

                        <td className="px-6 py-4">

                          <span className="text-sm text-slate-600">

                            {new Date(
                              product.createdAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td className="px-6 py-4">

                          <div className="flex items-center justify-end gap-2">

                            <Link
                            to={`/admin/products/${product._id}`}
                              title="View Product"
                              className="
                                p-2 rounded-lg
                                text-slate-500
                                hover:text-blue-600
                                hover:bg-blue-50
                                transition
                              "
                            >
                              <EyeIcon className="w-5 h-5" />
                            </Link>


                            <button
                            onClick={()=>handleEdit(product)}
                              title="Edit Product"
                              className="
                                p-2 rounded-lg
                                text-slate-500
                                hover:text-blue-600
                                hover:bg-blue-50
                                transition
                              "
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>


                            <button
                              title="Delete Product"
                              onClick={() =>
                                handleDelete(product)
                              }
                              className="
                                p-2 rounded-lg
                                text-slate-500
                                hover:text-red-600
                                hover:bg-red-50
                                transition
                              "
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  })

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center"
                    >

                      <CubeIcon className="mx-auto w-10 h-10 text-slate-300" />

                      <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        No products found
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filter.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}


// =========================================
// PRODUCT STAT
// =========================================

function ProductStat({ title, value }) {

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}