/**
 * Thin wrapper around the Shopify Admin GraphQL API.
 *
 * Required env vars (backend/.env):
 *   SHOPIFY_STORE_DOMAIN   e.g. your-store.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN    Admin API access token of a custom app
 *                          (scopes: write_products, read_products,
 *                                   write_publications, read_publications)
 * Optional:
 *   SHOPIFY_API_VERSION        defaults to 2026-01
 *   SHOPIFY_VENDOR             vendor written on every product
 *   SHOPIFY_PUBLICATION_NAMES  comma separated channel names to publish to,
 *                              defaults to "Point of Sale"
 */

const API_VERSION = process.env.SHOPIFY_API_VERSION || "2026-01";

const DEFAULT_PUBLICATIONS = ["Point of Sale"];

// Publications rarely change, so resolve their ids once per process.
let publicationCache = null;

const config = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;

  if (!domain || !token) {
    throw new Error(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN."
    );
  }
  return { domain, token };
};

export const shopifyGraphQL = async (query, variables = {}) => {
  const { domain, token } = config();

  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body) {
    throw new Error(`Shopify API error (HTTP ${res.status})`);
  }
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  return body.data;
};

const PUBLICATIONS_QUERY = `
  query Publications {
    publications(first: 50) {
      nodes {
        id
        catalog {
          title
        }
      }
    }
  }
`;

export const listPublications = async () => {
  const data = await shopifyGraphQL(PUBLICATIONS_QUERY);
  return data.publications.nodes.map((node) => ({
    id: node.id,
    name: node.catalog?.title || "",
  }));
};

/** Ids of the channels we publish to — POS by default, never the Online Store. */
export const getTargetPublicationIds = async () => {
  if (publicationCache) return publicationCache;

  const wanted = (process.env.SHOPIFY_PUBLICATION_NAMES || "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  const targets = (wanted.length ? wanted : DEFAULT_PUBLICATIONS).map((n) =>
    n.toLowerCase()
  );

  const publications = await listPublications();
  const matched = publications.filter((p) =>
    targets.includes(p.name.toLowerCase())
  );

  if (matched.length === 0) {
    throw new Error(
      `None of the sales channels [${targets.join(", ")}] exist on this store. ` +
        `Available: ${publications.map((p) => p.name).join(", ")}`
    );
  }

  publicationCache = matched.map((p) => p.id);
  return publicationCache;
};

const PRODUCT_SET_MUTATION = `
  mutation CreateSkuProduct($input: ProductSetInput!) {
    productSet(synchronous: true, input: $input) {
      product {
        id
        handle
        title
        status
        variants(first: 1) {
          nodes {
            id
            sku
            price
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const PUBLISH_MUTATION = `
  mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Creates an ACTIVE product with a single variant carrying the SKU code, then
 * publishes it to the POS channel only. The Online Store publication is never
 * touched, so the product stays off the web storefront.
 */
export const createProductForSku = async ({
  skuCode,
  title,
  price,
  productType,
  tags = [],
}) => {
  const input = {
    title,
    status: "ACTIVE",
    productType: productType || undefined,
    vendor: process.env.SHOPIFY_VENDOR || undefined,
    tags: ["sku-gen", ...tags],
    productOptions: [{ name: "Title", values: [{ name: "Default Title" }] }],
    variants: [
      {
        optionValues: [{ optionName: "Title", name: "Default Title" }],
        sku: skuCode,
        price: String(price ?? 0),
        inventoryItem: { tracked: false },
      },
    ],
  };

  const created = await shopifyGraphQL(PRODUCT_SET_MUTATION, { input });
  const errors = created.productSet.userErrors;
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join("; "));
  }

  const product = created.productSet.product;
  const publicationIds = await getTargetPublicationIds();

  const published = await shopifyGraphQL(PUBLISH_MUTATION, {
    id: product.id,
    input: publicationIds.map((publicationId) => ({ publicationId })),
  });
  const publishErrors = published.publishablePublish.userErrors;
  if (publishErrors?.length) {
    throw new Error(
      `Product created but publishing failed: ` +
        publishErrors.map((e) => e.message).join("; ")
    );
  }

  return {
    productId: product.id,
    variantId: product.variants.nodes[0]?.id,
    handle: product.handle,
    adminUrl: `https://${config().domain}/admin/products/${product.id
      .split("/")
      .pop()}`,
  };
};

/** Finds an existing product by SKU so we never create the same listing twice. */
const PRODUCT_BY_SKU_QUERY = `
  query ProductBySku($query: String!) {
    productVariants(first: 1, query: $query) {
      nodes {
        id
        product {
          id
        }
      }
    }
  }
`;

export const findProductBySku = async (skuCode) => {
  const data = await shopifyGraphQL(PRODUCT_BY_SKU_QUERY, {
    query: `sku:'${skuCode}'`,
  });
  const variant = data.productVariants.nodes[0];
  if (!variant) return null;

  return {
    productId: variant.product.id,
    variantId: variant.id,
    adminUrl: `https://${config().domain}/admin/products/${variant.product.id
      .split("/")
      .pop()}`,
  };
};
