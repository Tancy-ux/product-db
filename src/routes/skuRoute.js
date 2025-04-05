import e from "express";
import { getColorCode, addMaterial, addType, getSKUCode, getAllMaterials, getAllTypes, getAllColors, addNewColorCode, addProduct, getProductsByCategory } from "../controllers/skuController.js";

const router = e.Router();

router.get("/types", getAllTypes);
router.get("/colors", getAllColors);
router.get("/materials", getAllMaterials);
router.get("/products/:category", getProductsByCategory);

router.post("/add-type", addType);
router.post("/add-product", addProduct);
router.post("/add-material", addMaterial);
router.post("/add-color", addNewColorCode);

router.post("/get-sku", getSKUCode);
router.post("/get-color-code", getColorCode);

export default router;