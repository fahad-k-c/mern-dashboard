import express from "express";
import Product from "../models/product.model.js"; // Updated extension
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving products" });
  }
});

router.post("/", async (req, res) => {
  const product = req.body;

  if (!product.name || !product.price || !product.image) {
    return res.status(400).json({ message: "Invalid product data" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving product" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const product = await Product.findByIdAndUpdate(id, updatedProduct, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Updated successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating product" });
  }
});

export default router;
