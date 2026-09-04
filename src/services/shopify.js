/**
 * Thin wrapper around the Shopify Admin GraphQL API.
 *
 * Authentication takes whichever of two routes fits the store:
 *
 *   1. SHOPIFY_ADMIN_TOKEN — an offline shpat_ token from the authorization
 *      code grant (scripts/get-token.js). This is the route for a store that
 *      is NOT in the app's Dev Dashboard organization, which covers any
 *      ordinary production store. The token does not expire.
 *
 *   2. Client credentials grant — used automatically when no token is set.
 *      Only works when the app and the store belong to the same Shopify
 *      organization; otherwise Shopify answers "shop_not_permitted". These
 *      tokens expire, so they are fetched on demand and cached in memory
 *      until shortly before expiry.
 *
 * Required env vars (backend/.env):
 *   SHOPIFY_STORE_DOMAIN   e.g. your-store.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN    offline token (route 1), or
 *   SHOPIFY_API_KEY        the app's Client ID, and
 *   SHOPIFY_API_SECRET     the app's shpss_... Client secret  (route 2)
 * Optional:
 *   SHOPIFY_API_VERSION        defaults to 2026-01
 *   SHOPIFY_VENDOR             vendor written on every product
 *   SHOPIFY_PUBLICATION_NAMES  comma separated channel names to publish to,
 *                              defaults to "Point of Sale"
 */

const API_VERSION = process.env.SHOPIFY_API_VERSION || "2026-01";

const DEFAULT_PUBLICATIONS = ["Point of Sale"];

// Refresh a little early so a token can't expire mid-request.
const TOKEN_EXPIRY_MARGIN_MS = 60_000;

// Publications rarely change, so resolve their ids once per process.
let publicationCache = null;

// { token, expiresAt } — expiresAt is null for tokens that never expire.
let tokenCache = null;

const config = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;

  if (!domain) {
    throw new Error("Shopify is not configured. Set SHOPIFY_STORE_DOMAIN.");
  }
  return { domain };
};

/** Exchanges the app's client credentials for an Admin API access token. */
const requestAccessToken = async () => {
  const { domain } = config();
  const clientId = process.env.SHOPIFY_API_KEY;
  const clientSecret = process.env.SHOPIFY_API_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Shopify is not configured. Set SHOPIFY_API_KEY and SHOPIFY_API_SECRET " +
        "(or a ready-made SHOPIFY_ADMIN_TOKEN)."
    );
  }

  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });

  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    // Shopify answers with an HTML error page for things like a missing install.
    if (/app_not_installed/.test(text)) {
      throw new Error(
        `The app is not installed on ${domain}. Install it on the store from ` +
          `the Shopify Dev Dashboard, then try again.`
      );
    }
    throw new Error(`Could not get a Shopify access token (HTTP ${res.status}).`);
  }

  if (!res.ok || !body?.access_token) {
    const detail = body?.error_description || body?.error || `HTTP ${res.status}`;
    throw new Error(`Could not get a Shopify access token: ${detail}`);
  }

  return {
    token: body.access_token,
    expiresAt: body.expires_in
      ? Date.now() + body.expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS
      : null,
  };
};

const getAccessToken = async () => {
  const explicit = process.env.SHOPIFY_ADMIN_TOKEN;
  if (explicit) return explicit;

  if (tokenCache && (tokenCache.expiresAt === null || Date.now() < tokenCache.expiresAt)) {
    return tokenCache.token;
  }

  tokenCache = await requestAccessToken();
  return tokenCache.token;
};

export const shopifyGraphQL = async (query, variables = {}, { retryOn401 = true } = {}) => {
  const { domain } = config();
  const token = await getAccessToken();

  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  // A cached token can still be revoked or expire early; drop it and retry once.
  if (res.status === 401 && retryOn401 && !process.env.SHOPIFY_ADMIN_TOKEN) {
    tokenCache = null;
    return shopifyGraphQL(query, variables, { retryOn401: false });
  }

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
        name
        catalog {
          title
        }
      }
    }
  }
`;

export const listPublications = async () => {
  const data = await shopifyGraphQL(PUBLICATIONS_QUERY);
  // Channel publications expose their label on `name`; catalog-backed ones
  // carry it on the catalog instead.
  return data.publications.nodes.map((node) => ({
    id: node.id,
    name: node.name || node.catalog?.title || "",
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
