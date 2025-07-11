import BaseColor from "../models/BaseColor.js";
import Color from "../models/Color.js";
import CutleryColor from "../models/CutleryColor.js";
import GeneralColor from "../models/GeneralColor.js";
import Material from "../models/Material.js";
import Product from "../models/Product.js";
import Type from "../models/Type.js";
import Sku from "../models/Sku.js";
import Pricing from "../models/Pricing.js";
import ExistingSku from "../models/ExistingSku.js";
import Counter from "../models/Counter.js";

export const getCutleryColors = async (req, res) => {
  try {
    const colors = await CutleryColor.find().sort({ code: 1 });
    res.status(200).json({ data: colors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const newCutleryColor = async (req, res) => {
  try {
    const lastColor = await CutleryColor.findOne().sort({ code: -1 });
    const nextCode = lastColor ? lastColor.code + 1 : 1;

    const newColor = new CutleryColor({ ...req.body, code: nextCode });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getColorByMaterial = async (req, res) => {
  const { material } = req.params;
  try {
    const colors = await GeneralColor.find({ material }).sort({ code: 1 });
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addColorByMaterial = async (req, res) => {
  try {
    const { material, color } = req.body;
    const existing = await GeneralColor.findOne({ material, color });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Color already exists for this material." });
    }

    const lastColor = await GeneralColor.findOne({ material }).sort({
      code: -1,
    });
    const nextCode = lastColor ? lastColor.code + 1 : 1;

    const newColor = new GeneralColor({ material, color, code: nextCode });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaterialCode = async (req, res) => {
  try {
    const { material, color } = req.body;

    const colorData = await GeneralColor.findOne({ material, color });

    if (colorData) {
      return res.status(200).json({ exists: true, data: colorData.code });
    }

    return res.status(200).json({
      exists: false,
      message: "Color combination does not exist! Please create it first.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCutleryCode = async (req, res) => {
  try {
    const { handleColor, finishColor } = req.body;

    const colorData = await GeneralColor.findOne({ handleColor, finishColor });

    if (colorData) {
      return res.status(200).json({ exists: true, data: colorData.code });
    }

    return res.status(200).json({
      exists: false,
      message: "Color combination does not exist! Please create it first.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllColorEntries = async (req, res) => {
  try {
    const colors = await Color.find().sort({ code: 1 });
    res.status(200).json({ data: colors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBaseColor = async (req, res) => {
  const { name } = req.body;
  try {
    const exists = await BaseColor.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Color already exists" });
    }
    const newColor = new BaseColor({ name });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBase = async (req, res) => {
  try {
    const colors = await BaseColor.find().sort({ code: 1 });
    res.status(200).json({ data: colors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaterialSkuCode = async (req, res) => {
  try {
    const { materialName, colour, typology, productName } = req.body;

    const material = await Material.findOne({ name: materialName });
    if (!material) {
      return res
        .status(404)
        .json({ message: "Material not found", data: material });
    }
    const type = await Type.findOne({ name: typology });
    if (!type) {
      return res.status(404).json({ message: "Type not found" });
    }

    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const designCode = product.design_code;

    let skuCode = "";

    if(type.code === "FOM") {
      skuCode = `FOM${designCode}`;
    } else if(type.code === "BOX") {
      skuCode = `Box${designCode}`;
    } else { 
      
    let color = await GeneralColor.findOne({
      material: materialName,
      color: colour,
    });
    if (!color) {
      return res.status(404).json({ message: "Color not found!", data: color });
    }
    let colorCode = color.code.toString().padStart(3, "0");

      skuCode = `${material.code}${colorCode}${type.code}${designCode}`;
    }

    const existingSKU = await Sku.findOne({ skuCode });
    if (existingSKU) {
      return res.status(200).json({ message: "SKU code exists: ", skuCode });
    }
    const newSKU = new Sku({
      skuCode,
      materialCode: material.code,
      color: type.code === "FOM" || type.code === "BOX" ? "" : colour,
      typeCode: type.code,
      productName: product.name,
    });
    await newSKU.save();
    res
      .status(200)
      .json({ message: "SKU code generated successfully", data: newSKU });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteSku = async (req, res) => {
  try {
    const { skuCode } = req.params;

    let sku = await Sku.findOneAndDelete({ skuCode });
    let oldsku = await ExistingSku.findOneAndDelete({ code: skuCode });
    
    if (!sku || !oldsku) {
      return res.status(404).json({ message: "SKU not found in either collection" });
    }

    res.status(200).json({ message: "SKU deleted successfully", data: sku });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.findOneAndDelete({ _id: id });
    
    const counter = await Counter.findOne({ category: product.category });
    if (counter) {
      counter.last_code -= 1;
      await counter.save();
    }

    res.status(200).json({ message: "Product deleted successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addGeneralColor = async (req, res) => {
  try {
    const { material, color, code } = req.body;
    const exists = await GeneralColor.findOne({ material, color });
    if (exists) {
      return res.status(400).json({ message: "Color already exists" });
    }
    const newColor = new GeneralColor({ material, color, code });
    await newColor.save();
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const addPricing = async (req, res) => {
  try {
    const { skuCode, makingPriceExclGst, deliveryCharges, sellingPriceExclGst, makingPriceInclGst, sellingPriceInclGst, totalCost, cogs } = req.body;

    const newPricing = new Pricing({
      skuCode,
      makingPriceExclGst,
      makingPriceInclGst,
      deliveryCharges,
      totalCost,
      sellingPriceExclGst,
      sellingPriceInclGst,
      cogs,
    });

    await newPricing.save();
    res.status(201).json({ message: "New Pricing added successfully", data: newPricing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPricing = async (req, res) => {
  try {
    const allPricing = await Pricing.find();
    res.status(200).json(allPricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      makingPriceExclGst,
      deliveryCharges,
      sellingPriceExclGst,
      gstRate,
    } = req.body;

    const cp = parseFloat(makingPriceExclGst);
    const dc = parseFloat(deliveryCharges);
    const sp = parseFloat(sellingPriceExclGst);
    const gst = parseFloat(gstRate) || 1.18; // fallback to 18% if missing

    const cogs = ((cp / sp) * 100).toFixed(2);

    const updated = await Pricing.findByIdAndUpdate(
      id,
      {
        makingPriceExclGst: cp,
        makingPriceInclGst: (cp * gst).toFixed(2),
        deliveryCharges: dc,
        totalCost: dc > 0 ? (cp + dc).toFixed(2) : cp.toFixed(2),
        sellingPriceExclGst: sp,
        sellingPriceInclGst: (sp * gst).toFixed(2),
        gstRate: gst,
        cogs,
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deletePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Pricing.findByIdAndDelete(id);
    res.status(200).json({ message: "Pricing deleted successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};