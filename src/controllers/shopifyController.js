import Sku from "../models/Sku.js";
import ExistingSku from "../models/ExistingSku.js";
import Pricing from "../models/Pricing.js";
import Type from "../models/Type.js";
import {
  createProductForSku,
  findProductBySku,
  findProductsBySkus,
  listPublications,
} from "../services/shopify.js";

/** Builds the product title from whichever SKU shape we found. */
const buildTitle = (sku) => {
  const name = sku.productName || sku.name || "";
  const colors = sku.color
    ? sku.color
    : [sku.color_o, sku.color_i, sku.color_r].filter(Boolean).join(" / ");

  return colors ? `${name} - ${colors}`.trim() : name.trim();
};

const resolvePrice = (pricing) => {
  if (!pricing) return null;
  return pricing.sellingPriceInclGst ?? pricing.sellingPriceExclGst ?? null;
};

export const getShopifyPublications = async (req, res) => {
  try {
    const publications = await listPublications();
    res.status(200).json({ data: publications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Read-only reconciliation against the Shopify store — never creates,
 * edits, or deletes anything there. For every SKU we know about, it asks
 * Shopify "does a product with this SKU still exist?" and updates our own
 * DB to match:
 *   - not marked listed here, but found on Shopify -> mark it Listed
 *     (covers products pushed from another machine, or created by hand).
 *   - marked listed here, but no longer found on Shopify -> mark it
 *     Unlisted again (covers someone deleting the product on Shopify).
 * This is how already-listed/removed products show up correctly without
 * clicking each "Create Listing" button one at a time.
 */
export const syncShopifyStatuses = async (req, res) => {
  try {
    const [skus, existingSkus] = await Promise.all([
      Sku.find({}),
      ExistingSku.find({}),
    ]);

    const records = [...skus, ...existingSkus].filter(
      (r) => r.skuCode || r.code
    );
    const codes = records.map((r) => r.skuCode || r.code);

    const found = await findProductsBySkus(codes);

    const now = new Date();
    const newlyListed = [];
    const delisted = [];
    const updates = [];

    for (const record of records) {
      const code = record.skuCode || record.code;
      const match = found.get(code);
      const wasListed = Boolean(record.shopifyProductId);

      if (match) {
        if (!wasListed) newlyListed.push({ code, adminUrl: match.adminUrl });
        record.shopifyProductId = match.productId;
        record.shopifyVariantId = match.variantId;
        record.shopifyAdminUrl = match.adminUrl;
        record.shopifySyncedAt = now;
        updates.push(record.save());
      } else if (wasListed) {
        delisted.push({ code });
        record.shopifyProductId = undefined;
        record.shopifyVariantId = undefined;
        record.shopifyAdminUrl = undefined;
        record.shopifySyncedAt = now;
        updates.push(record.save());
      }
    }

    await Promise.all(updates);

    res.status(200).json({
      message: "Synced with Shopify",
      checked: codes.length,
      listed: newlyListed,
      delisted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShopifyProduct = async (req, res) => {
  try {
    const { skuCode } = req.body;

    if (!skuCode) {
      return res.status(400).json({ message: "skuCode is required" });
    }

    const sku =
      (await Sku.findOne({ skuCode })) ||
      (await ExistingSku.findOne({ code: skuCode }));

    if (!sku) {
      return res.status(404).json({ message: `SKU ${skuCode} not found` });
    }

    if (sku.shopifyProductId) {
      return res.status(200).json({
        message: "Product already exists on Shopify",
        alreadyExists: true,
        data: {
          productId: sku.shopifyProductId,
          adminUrl: sku.shopifyAdminUrl,
        },
      });
    }

    // The store is the source of truth — a SKU may have been pushed from
    // another machine, or the product created by hand.
    const existing = await findProductBySku(skuCode);
    if (existing) {
      sku.shopifyProductId = existing.productId;
      sku.shopifyVariantId = existing.variantId;
      sku.shopifyAdminUrl = existing.adminUrl;
      await sku.save();

      return res.status(200).json({
        message: "Product already exists on Shopify",
        alreadyExists: true,
        data: existing,
      });
    }

    const pricing = await Pricing.findOne({ skuCode });
    const price = resolvePrice(pricing);

    const type = sku.typeCode ? await Type.findOne({ code: sku.typeCode }) : null;

    const result = await createProductForSku({
      skuCode,
      title: buildTitle(sku),
      price: price ?? 0,
      productType: type?.name,
      tags: sku.typeCode ? [sku.typeCode] : [],
    });

    sku.shopifyProductId = result.productId;
    sku.shopifyVariantId = result.variantId;
    sku.shopifyAdminUrl = result.adminUrl;
    sku.shopifySyncedAt = new Date();
    await sku.save();

    res.status(201).json({
      message:
        price === null
          ? "Product created on Shopify with price 0 — no pricing found for this SKU"
          : "Product created on Shopify",
      missingPrice: price === null,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
