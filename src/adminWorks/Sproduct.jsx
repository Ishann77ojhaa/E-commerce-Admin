import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";

import {
  getProductById,
  updateProductStatus,
  updateStockAndPrice,
} from "../store/productSlice";

const Sproduct = ({ id: productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct } = useSelector(
    (state) => state.product
  );

  const product = selectedProduct?.product?.[0];
  const reviews = selectedProduct?.productReviews;

  const [loadingProduct, setLoadingProduct] = useState(true);

  const [productStatus, setProductStatus] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [price, setPrice] = useState("");

  const [savingStatus, setSavingStatus] = useState(false);
  const [savingStockPrice, setSavingStockPrice] = useState(false);

  // Get product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);

      await dispatch(getProductById(productId));

      setLoadingProduct(false);
    };

    if (productId) {
      fetchProduct();
    }
  }, [dispatch, productId]);

  // Fill form when product loads
  useEffect(() => {
    if (product) {
      setProductStatus(product.Product_Status);
      setStockQty(product.Product_StockQTY);
      setPrice(product.Product_Price);
    }
  }, [product]);

  // Update Status
  const handleStatusUpdate = async () => {
    if (productStatus === product.Product_Status) {
     return;
    }

    try {
      setSavingStatus(true);

      await dispatch(
        updateProductStatus({
          id: productId,
          productStatus,
        })
      );
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update product status"
      );

      // Reset dropdown if update failed
      setProductStatus(product.Product_Status);
    } finally {
      setSavingStatus(false);
    }
  };

  // Update Stock + Price
  const handleStockPriceUpdate = async () => {
    if (stockQty === "" || price === "") {
      alert("Stock quantity and price are required");
      return;
    }

    if (Number(stockQty) < 0) {
      alert("Stock quantity cannot be negative");
      return;
    }

    if (Number(price) < 0) {
      alert("Price cannot be negative");
      return;
    }

    try {
      setSavingStockPrice(true);

      await dispatch(
        updateStockAndPrice({
          id: productId,
          ProductStockQTY: Number(stockQty),
          ProductPrice: Number(price),
        })
      );
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update stock and price"
      );

      // Restore old values if update failed
      setStockQty(product.Product_StockQTY);
      setPrice(product.Product_Price);
    } finally {
      setSavingStockPrice(false);
    }
  };

  // Initial loading ONLY
  if (loadingProduct) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading Product...
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        Product not found.
      </div>
    );
  }

  const imageUrl = product.Product_Image?.startsWith("http")
    ? product.Product_Image
    : `http://${product.Product_Image}`;

  return (
    <section className="text-gray-700 body-font overflow-hidden bg-gray-50 min-h-screen">
      <div className="container px-5 py-12 mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Details
          </h1>

          <p className="text-gray-500 mt-1">
            View and manage product information
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 lg:p-8">

          <div className="flex flex-wrap">

            {/* IMAGE */}
            <div className="lg:w-1/2 w-full">
              <div className="w-full h-[450px] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">

                <img
                  alt={product.Product_Name}
                  src={imageUrl}
                  className="w-full h-full object-contain"
                />

              </div>
            </div>

            {/* DETAILS */}
            <div className="lg:w-1/2 w-full lg:pl-10 mt-8 lg:mt-0">

              <p className="text-sm font-medium tracking-widest uppercase text-red-500 mb-2">
                Product
              </p>

              <h1 className="text-gray-900 text-3xl font-bold mb-3">
                {product.Product_Name}
              </h1>

              {/* REVIEWS */}
              <div className="flex items-center mb-6">

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 text-red-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <span className="text-gray-600 ml-3 text-sm">
                  {reviews?.length || 0} Reviews
                </span>

              </div>

              {/* DESCRIPTION */}
              <div className="mb-7">

                <h3 className="font-semibold text-gray-900 mb-2">
                  Description
                </h3>

                <p className="leading-relaxed text-gray-600">
                  {product.Product_Description}
                </p>

              </div>

              {/* CURRENT PRICE */}
              <div className="mb-7">

                <span className="text-sm text-gray-500">
                  Current Price
                </span>

                <p className="text-3xl font-bold text-gray-900 mt-1">
                  Rs. {product.Product_Price}
                </p>

              </div>

              {/* STATUS */}
              <div className="border-t pt-6 mb-6">

                <div className="flex items-center justify-between mb-3">

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Product Status
                    </h3>

                    <p className="text-sm text-gray-500">
                      Control whether customers can purchase this
                      product.
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.Product_Status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.Product_Status}
                  </span>

                </div>

                <div className="flex gap-3">

                  <select
                    value={productStatus}
                    onChange={(e) =>
                      setProductStatus(e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-lg outline-none focus:border-red-500"
                  >
                    <option value="Available">
                      Available
                    </option>

                    <option value="Unavailable">
                      Unavailable
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={
                      savingStatus ||
                      productStatus === product.Product_Status
                    }
                    className="px-5 py-2 text-white bg-red-600 hover:bg-red-500 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingStatus ? "Saving..." : "Update"}
                  </button>

                </div>

              </div>

              {/* STOCK + PRICE */}
              <div className="border-t pt-6 mb-6">

                <h3 className="font-semibold text-gray-900 mb-1">
                  Stock & Price
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  Update the product stock quantity and selling
                  price.
                </p>

                <div className="grid grid-cols-2 gap-4">

                  {/* STOCK */}
                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={stockQty}
                      onChange={(e) =>
                        setStockQty(e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:border-red-500"
                    />

                  </div>

                  {/* PRICE */}
                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:border-red-500"
                    />

                  </div>

                </div>

                {/* STOCK STATUS */}
                <div className="mt-4">

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      product.Product_StockQTY > 0
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.Product_StockQTY > 0
                      ? `${product.Product_StockQTY} Available`
                      : "Out of Stock"}
                  </span>

                </div>

                <button
                  type="button"
                  onClick={handleStockPriceUpdate}
                  disabled={savingStockPrice}
                  className="w-full mt-5 px-5 py-2.5 text-white bg-gray-900 hover:bg-gray-800 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingStockPrice
                    ? "Saving Changes..."
                    : "Update Stock & Price"}
                </button>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sproduct;