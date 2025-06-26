import e from "express";
import { getColorCode, addMaterial, addType, getSKUCode, getAllMaterials, getAllTypes, getAllColors, addNewColorCode, addProduct, getProductsByCategory, getDesignCode, updateProduct, getAllCodes, getOldSkuCodes } from "../controllers/skuController.js";
import { addBaseColor, addColorByMaterial, addGeneralColor, addPricing, deleteProduct, deleteSku, getAllBase, getAllColorEntries, getColorByMaterial, getCutleryCode, getCutleryColors, getMaterialCode, getMaterialSkuCode, getPricing, newCutleryColor } from "../controllers/colorController.js";

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

router.get("/all-codes", getAllCodes)
router.get("/oldsku", getOldSkuCodes);
router.post("/get-sku", getSKUCode);
router.post("/get-msku", getMaterialSkuCode);

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

router.delete("/del-sku", deleteSku);
router.delete("/del-product/:id", deleteProduct);

router.post("/add-gen-color", addGeneralColor);

router.post("/pdetails", addPricing);
router.get("/get-price", getPricing);

export default router;