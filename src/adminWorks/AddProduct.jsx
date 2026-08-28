import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeftIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { createProduct } from "../store/productSlice";
import { STATUSES } from "../globals/misc/statuses";
import Loader from "../globals/loader/loader";



export default function NewProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {status} = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    Product_name: "",
    Product_description: "",
    Product_price: "",
    Product_stockQTY: "",
    Product_status: "Available",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.Product_name ||
      !formData.Product_description ||
      !formData.Product_price ||
      !formData.Product_stockQTY ||
      !formData.Product_status
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = new FormData();

      data.append("Product_name", formData.Product_name);
      data.append(
        "Product_description",
        formData.Product_description
      );
      data.append(
        "Product_price",
        formData.Product_price
      );
      data.append(
        "Product_stockQTY",
        formData.Product_stockQTY
      );
      data.append(
        "Product_status",
        formData.Product_status
      );

      if (image) {
        data.append("productImage", image);
      }

      await dispatch(createProduct(data));

      alert("Product created successfully!");

      navigate("/admin/products");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to create product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

 
  if (status === STATUSES.LOADING) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader message="Wait" />
      </div>
    );
  }


  return (
    <main className="px-4 md:px-8 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Add New Product
          </h1>

          <p className="mt-2 text-slate-500">
            Add a new product to your store.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white border border-slate-200 rounded-xl overflow-hidden"
        >

          {/* Basic Information */}
          <section className="p-6 md:p-8 border-b border-slate-200">

            <h2 className="text-lg font-semibold text-slate-900">
              Product Information
            </h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="Product_name"
                  value={formData.Product_name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="Product_description"
                  value={formData.Product_description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Enter product description"
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Price
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    Rs.
                  </span>

                  <input
                    type="number"
                    name="Product_price"
                    value={formData.Product_price}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  name="Product_stockQTY"
                  value={formData.Product_stockQTY}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Product Status
                </label>

                <select
                  name="Product_status"
                  value={formData.Product_status}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">
                    Available
                  </option>

                  <option value="Unavailable">
                    Unavailable
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* Image */}
          <section className="p-6 md:p-8 border-b border-slate-200">

            <h2 className="text-lg font-semibold text-slate-900">
              Product Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload an image for this product.
            </p>

            <div className="mt-5">

              <label className="cursor-pointer block">

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition">

                  {preview ? (
                    <img
                      src={preview}
                      alt="Product preview"
                      className="mx-auto h-48 w-48 object-contain rounded-lg"
                    />
                  ) : (
                    <>
                      <PhotoIcon className="mx-auto w-12 h-12 text-slate-400" />

                      <p className="mt-3 font-medium text-slate-700">
                        Click to upload product image
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        PNG, JPG or JPEG
                      </p>
                    </>
                  )}

                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

              {image && (
                <p className="mt-3 text-sm text-slate-500">
                  Selected:{" "}
                  <span className="font-medium text-slate-700">
                    {image.name}
                  </span>
                </p>
              )}

            </div>
          </section>

          {/* Actions */}
          <div className="px-6 md:px-8 py-5 bg-slate-50 flex flex-col sm:flex-row justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Creating Product..."
                : "Create Product"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}