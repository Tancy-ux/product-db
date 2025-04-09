import e from "express";
import { getColorCode, addMaterial, addType, getSKUCode, getAllMaterials, getAllTypes, getAllColors, addNewColorCode, addProduct, getProductsByCategory, getDesignCode, updateProduct } from "../controllers/skuController.js";
import { addBaseColor, addColorByMaterial, getAllBase, getAllColorEntries, getColorByMaterial, getCutleryCode, getCutleryColors, getMaterialCode, newCutleryColor } from "../controllers/colorController.js";

const router = e.Router();

router.get("/types", getAllTypes);
router.get("/colors", getAllColors);
router.get("/materials", getAllMaterials);
router.get("/products/:category", getProductsByCategory);
router.get("/color-entries", getAllColorEntries);

router.post("/add-type", addType);
router.post("/add-product", addProduct);
router.post("/add-material", addMaterial);
router.post("/add-color", addNewColorCode);

router.put("/update-product/:id", updateProduct);

router.post("/get-sku", getSKUCode);
router.post("/design-code", getDesignCode);
router.post("/get-color-code", getColorCode);

router.post("/m-code", getMaterialCode);
router.post("/c-code", getCutleryCode);

router.get("/cutlery", getCutleryColors);
router.post("/newcu", newCutleryColor);
router.get("/colors/:material", getColorByMaterial);
router.post("/newcol", addColorByMaterial);

router.post("/add-base", addBaseColor);
router.get("/get-base", getAllBase);

export default router;