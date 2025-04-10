import Color from "../models/Color.js";
import Counter from "../models/Counter.js";
import Material from "../models/Material.js";
import Product from "../models/Product.js";
import Sku from "../models/Sku.js";
import Type from "../models/Type.js";

export const getColorCode = async (req, res) => {
  try {
    const { outerColor, innerColor, rimColor } = req.body;

    const colorCode = await Color.findOne({ outerColor, innerColor, rimColor });

    if (colorCode) {
      return res.status(200).json({ exists: true, data: colorCode.code });
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

export const addNewColorCode = async (req, res) => {
  try {
    const { outerColor, innerColor, rimColor } = req.body;
    const color = await Color.findOne({
      outerColor,
      innerColor,
      rimColor,
    });
    if (color) {
      return res
        .status(200)
        .json({ message: "Color code already exists!", data: color.code });
    }
    // If no color code is found, create a new one
    let lastColor = await Color.findOne().sort({ code: -1 });
    let nextCode = lastColor ? lastColor.code + 1 : 29;

    const newColor = new Color({
      outerColor,
      innerColor,
      rimColor,
      code: nextCode,
    });
    await newColor.save();
    return res.status(200).json({
      message: "Color code generated successfully",
      colorCode: newColor.code,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const addMaterial = async (req, res) => {
  try {
    const { name, code } = req.body;

    let exists = await Material.findOne({ name: name });
    if (exists) {
      return res.status(400).json({ message: "Material already exists" });
    }
    const newMaterial = new Material({ name, code });
    await newMaterial.save();
    res
      .status(200)
      .json({ message: "Material added successfully", data: newMaterial });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const addType = async (req, res) => {
  try {
    const { name, code } = req.body;
    let existsType = await Type.findOne({ name: name });
    if (existsType) {
      return res.status(400).json({ message: "Type already exists" });
    }
    const newType = new Type({ name, code });
    await newType.save();
    res.status(200).json({ message: "Type added successfully", data: newType });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getSKUCode = async (req, res) => {
  try {
    const {
      materialName,
      outerColor,
      innerColor,
      rimColor,
      typology,
      productName,
    } = req.body;
    let colorCode;

    const material = await Material.findOne({ name: materialName });
    if (!material) {
      return res.status(200).json({ message: "Material not found" });
    }

    let color = await Color.findOne({ outerColor, innerColor, rimColor });
    if (!color) {
      return res.status(200).json({ message: "Color combination not found!" });
    }
    colorCode = color.code.toString().padStart(3, "0");

    const type = await Type.findOne({ name: typology });
    if (!type) {
      return res.status(200).json({ message: "Type not found" });
    }

    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(200).json({ message: "Product not found" });
    }
    const designCode = product.design_code;

    const skuCode = `${material.code}${colorCode}${type.code}${designCode}`;

    const existingSKU = await Sku.findOne({ skuCode });
    if (existingSKU) {
      return res.status(200).json({ message: "SKU code exists: ", skuCode });
    }
    const newSKU = new Sku({
      skuCode,
      materialCode: material.code,
      colorCode,
      typeCode: type.code,
      productName: product.name,
    });
    await newSKU.save();

    res
      .status(200)
      .json({ message: "SKU code generated successfully", newSKU });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res
      .status(200)
      .json({ message: "Materials fetched successfully", data: materials });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getAllTypes = async (req, res) => {
  try {
    const types = await Type.find();
    res
      .status(200)
      .json({ message: "Types fetched successfully", data: types });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// This function fetches all unique colors from the Color model
export const getAllColors = async (req, res) => {
  try {
    const outerColors = await Color.distinct("outerColor");
    const innerColors = await Color.distinct("innerColor");
    const rimColors = await Color.distinct("rimColor");

    res.status(200).json({
      message: "Unique colors fetched successfully",
      data: {
        outerColors,
        innerColors,
        rimColors,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category })
      .sort({ design_code: 1 })
      .select("name design_code");
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export const addProduct = async (req, res) => {
  const { name, category } = req.body;
  try {
    let exists = await Product.findOne({ name: name });
    if (exists) {
      return res.status(400).json({ message: "Product already exists!" });
    }

    let counter = await Counter.findOne({ category });

    if (!counter) {
      counter = await Counter.create({ category, last_code: 100 });
    }
    counter.last_code += 1;
    await counter.save();

    const product = new Product({
      name,
      category,
      design_code: counter.last_code,
    });
    await product.save();
    return res
      .status(200)
      .json({ message: "Product added successfully", data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const existProduct = await Product.findOne({ name });
    if (existProduct && existProduct._id.toString() !== id) {
      return res.status(409).json({ message: "Product name exists" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      data: {
        name: product.name,
        category: product.category,
        design_code: product.design_code,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getDesignCode = async (req, res) => {
  try {
    const { productName } = req.body;
    if (!productName) {
      return res.status(400).json({ message: "Product name is required" });
    }
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Design code fetched successfully",
      designCode: product.design_code,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
