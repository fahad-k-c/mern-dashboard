import React, { useEffect, useState } from "react";
import { useProductStore } from "../Store/product.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useAuthStore } from "../Store/useAuthStore"; // Import useAuthStore hook
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

const HomePage = () => {
  const { fetchProduct, products } = useProductStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product

  const [productName, setProductName] = useState(""); // State for product name
  const [productPrice, setProductPrice] = useState(""); // State for product price
  const [imageUrl, setImageUrl] = useState(""); // State for image URL

  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  const { logout } = useAuthStore(); // Get logout function from Zustand store

  useEffect(() => {
    fetchProduct(); // Fetch product data on component mount
  }, [fetchProduct]);

  const { deleteProduct, updateProduct } = useProductStore();

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    if (success) {
      alert(message);
    } else {
      alert(message);
    }
  };

  const handleOpenDialog = (product) => {
    setSelectedProduct(product); // Store the product to edit
    setProductName(product.name); // Set name for editing
    setProductPrice(product.price); // Set price for editing
    setImageUrl(product.image); // Set image URL for editing
    setIsOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsOpen(false); // Close the dialog
  };

  const handleUpdateProduct = async () => {
    if (!productName || !productPrice || !imageUrl) {
      alert("Please fill all fields.");
      return;
    }

    const updatedProduct = {
      name: productName,
      price: productPrice,
      image: imageUrl,
    };

    if (selectedProduct) {
      const { success, message } = await updateProduct(
        selectedProduct._id,
        updatedProduct
      );
      if (success) {
        alert(message);
        handleCloseDialog(); // Close dialog after successful update
      } else {
        alert(message);
      }
    }
  };

  const handleRedirectToCreatePage = () => {
    navigate("/create"); // Redirect to the /create route
  };

  // Handle Logout
  const handleLogout = () => {
    logout(); // Call the logout function from Zustand store
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-center text-3xl font-bold text-teal-600 sm:text-3xl">
          Product List
        </h1>

        <div className="flex space-x-4">
          {" "}
          {/* Container for logout and create product buttons */}
          <button
            onClick={handleLogout} // Trigger the logout function
            className="bg-red-500 text-white py-2 px-6 rounded-md"
          >
            Logout
          </button>
          <button
            onClick={handleRedirectToCreatePage} // Call the redirect function
            className="bg-blue-600 text-white py-2 px-6 rounded-md"
          >
            Create New Product
          </button>
        </div>
      </div>

      {/* Conditional rendering based on product availability */}
      {products.length === 0 ? (
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-semibold">No Products Available</h2>
          <p className="mt-2">
            The inventory is currently empty. Please check back later after
            adding new products.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <a
              key={product.id}
              href="#"
              className="group relative block overflow-hidden border rounded-lg shadow-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
              />
              <div className="relative border border-gray-100 bg-white p-6">
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-sm text-gray-700">${product.price}</p>

                <form className="mt-4">
                  <button
                    className="block w-full rounded bg-red-500 p-4 text-sm font-medium transition hover:scale-105 text-white"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete from Cart
                  </button>
                </form>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Dialog Component */}
      {selectedProduct && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product Information</DialogTitle>
              <DialogDescription>
                Make changes to the product information. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="productName" className="text-right">
                  Product Name
                </label>
                <input
                  id="productName"
                  value={productName} // Track product name input
                  onChange={(e) => setProductName(e.target.value)} // Update state on change
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="productPrice" className="text-right">
                  Product Price
                </label>
                <input
                  id="productPrice"
                  value={productPrice} // Track product price input
                  onChange={(e) => setProductPrice(e.target.value)} // Update state on change
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="imageUrl" className="text-right">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  value={imageUrl} // Track image URL input
                  onChange={(e) => setImageUrl(e.target.value)} // Update state on change
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <button
                onClick={handleCloseDialog}
                className="rounded bg-red-500 text-white px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProduct} // Pass product ID to update function
                className="rounded bg-blue-600 text-white px-4 py-2"
              >
                Save changes
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HomePage;
