import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "please fill all required fields" };
    }
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    const data = await response.json();
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "product created successfully" };
  },
  fetchProduct: async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    console.log("API Response:", data); // Inspect the response
    set({ products: data }); // Adjust based on the actual structure
  },
  deleteProduct: async (pid) => {
    try {
      const response = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        // Optimistically update the state
        set((state) => ({
          products: [
            ...state.products.filter((product) => product._id !== pid),
          ],
        }));
        return { success: true, message: "Product deleted successfully" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: "An error occurred while deleting the product",
      };
    }
  },
  updateProduct: async (pid, updatedProduct) => {
    const response = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    const data = await response.json();
    if (data.success) {
      // Optimistically update the state
      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? { ...product, ...updatedProduct } : product
        ),
      }));
      return { success: true, message: "Product updated successfully" };
    } else {
      return { success: false, message: data.message };
    }
  },
}));
