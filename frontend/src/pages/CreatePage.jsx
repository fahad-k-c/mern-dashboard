import React, { useState } from "react";
import { useProductStore } from "../Store/product.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const [errors, setErrors] = useState({}); // State to track validation errors
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newProduct.name.trim()) newErrors.name = "Product name is required.";
    if (!newProduct.price || Number(newProduct.price) <= 0)
      newErrors.price = "Price must be greater than zero.";
    if (!newProduct.image.trim()) newErrors.image = "Image URL is required.";
    return newErrors;
  };

  const { createProduct } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const { success, message } = await createProduct(newProduct); // Add new product
      if (success) {
        alert(message);
        navigate("/"); // Navigate back to the home page
      } else {
        alert("Failed to create product.");
      }
    }
  };

  const handleViewProducts = () => {
    navigate("/"); // Navigate to the home page (view existing products)
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-blue-600 sm:text-3xl">
            Create New Product
          </h1>
          <form
            onSubmit={handleSubmit}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Enter the product details below
            </p>
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={newProduct.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter the product name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="price" className="sr-only">
                Price
              </label>
              <div className="relative">
                <input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter the price"
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="image" className="sr-only">
                Image
              </label>
              <div className="relative">
                <input
                  id="image"
                  type="text"
                  value={newProduct.image}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter the image URL"
                />
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
            >
              Submit Product
            </button>
          </form>

          {/* View Existing Products Button */}
          <button
            onClick={handleViewProducts}
            className="mt-4 w-full rounded-lg bg-red-500 px-5 py-3 text-sm font-medium text-white"
          >
            View Existing Products
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatePage;
