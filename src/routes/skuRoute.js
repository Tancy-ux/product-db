import e from "express";
import { getColorCode, addMaterial, addType, getSKUCode, getAllMaterials, getAllTypes, getAllColors, addNewColorCode, addProduct, getProductsByCategory, getDesignCode } from "../controllers/skuController.js";
import { addColorByMaterial, getColorByMaterial, getCutleryColors, newCutleryColor } from "../controllers/colorController.js";

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
router.post("/design-code", getDesignCode);
router.post("/get-color-code", getColorCode);

router.get("/cutlery", getCutleryColors);
router.post("/newcu", newCutleryColor);

router.get("/colors/:material", getColorByMaterial);
router.post("/newcol", addColorByMaterial);

export default router;