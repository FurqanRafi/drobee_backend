import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRelatedProducts, // ✅ new controller function
} from "../controller/d_productController.js";

const router = express.Router();

router.post("/products", addProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/related/:id", getRelatedProducts); // ✅ new route
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
