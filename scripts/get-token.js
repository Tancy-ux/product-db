/**
 * One-time helper: obtain a shpat_ Admin API access token for a single store.
 *
 * Dev Dashboard apps don't display an Admin API token; the token only exists
 * once the app has been installed on a store. This runs that install once and
 * prints the resulting token so it can be pasted into .env.
 *
 * Token type is not readable from the prefix: shpat_ is what store-admin custom
 * apps issue and shpca_ is what Dev Dashboard ones issue, and both are offline.
 * What marks a token as online (per-user) is `associated_user` in the response,
 * which only appears when the authorize URL asks for grant_options[]=per-user.
 *
 * Required env vars (backend/.env):
 *   SHOPIFY_STORE_DOMAIN   e.g. your-store.myshopify.com
 *   SHOPIFY_API_KEY        the app's Client ID from the Dev Dashboard
 *   SHOPIFY_API_SECRET     the app's shpss_... secret
 *
 * Usage:
 *   node scripts/get-token.js
 *
 * Delete this file once the token is in .env.
 */

import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const ENV_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  ".env"
);

/** Replaces each key in backend/.env, appending any that aren't there yet. */
const upsertEnv = (updates) => {
  let current = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null) continue;

    const line = `${key}=${value}`;
    const pattern = new RegExp(`^\\s*${key}=.*$`, "m");

    current = pattern.test(current)
      ? current.replace(pattern, line)
      : current +
        (current === "" || current.endsWith("\n") ? "" : "\n") +
        line +
        "\n";
  }

  fs.writeFileSync(ENV_PATH, current);
};

const PORT = 3456;
const REDIRECT_URI = `http://localhost:${PORT}/auth/callback`;
const SCOPES = "read_products,write_products,read_publications,write_publications";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;

if (!domain || !apiKey || !apiSecret) {
  console.error(
    "Missing env vars. Set SHOPIFY_STORE_DOMAIN, SHOPIFY_API_KEY and\n" +
      "SHOPIFY_API_SECRET in backend/.env, then run this again."
  );
  process.exit(1);
}
if (!apiSecret.startsWith("shpss_")) {
  console.error("SHOPIFY_API_SECRET should start with shpss_ — check the value.");
  process.exit(1);
}

const state = crypto.randomBytes(16).toString("hex");

// Shopify signs the callback query string; verifying it proves the redirect
// really came from Shopify and not from someone hitting localhost directly.
const hmacIsValid = (params) => {
  const received = params.get("hmac");
  if (!received) return false;

  const message = [...params.entries()]
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("&");

  const expected = crypto
    .createHmac("sha256", apiSecret)
    .update(message)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const buildAuthorizeUrl = () =>
  `https://${domain}/admin/oauth/authorize` +
  `?client_id=${encodeURIComponent(apiKey)}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&state=${state}`;

const exchangeCodeForToken = async (code) => {
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.access_token) {
    throw new Error(
      `Token exchange failed (HTTP ${res.status}): ${JSON.stringify(body)}`
    );
  }
  return body;
};

const reply = (res, status, message) => {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Shopify sends the merchant to the App URL (root) after a custom-app
  // install. That request carries the shop but no code, so bounce it into the
  // authorization grant, which comes back to /auth/callback with one.
  if (url.pathname === "/" && url.searchParams.get("shop")) {
    console.log("Install landed on the app URL; redirecting to the grant screen...");
    res.writeHead(302, { Location: buildAuthorizeUrl() });
    res.end();
    return;
  }

  if (url.pathname !== "/auth/callback") return reply(res, 404, "Not found");

  const params = url.searchParams;

  // An install started from a Dev Dashboard link carries no state of ours, so a
  // mismatch here is expected on that path. The HMAC check below is what
  // actually proves the callback came from Shopify.
  if (params.get("state") !== state) {
    console.log("(callback had no matching state — install started outside this script)");
  }
  if (!hmacIsValid(params)) {
    reply(res, 400, "HMAC verification failed. Start the script again.");
    return;
  }

  const code = params.get("code");
  if (!code) return reply(res, 400, "No code in callback.");

  try {
    const result = await exchangeCodeForToken(code);
    reply(res, 200, "Token received. You can close this tab and return to the terminal.");

    const token = result.access_token;

    // An online (per-user) token is the one carrying associated_user; a token
    // with a refresh_token is an offline token of the newer expiring kind.
    // Both can look alike from the prefix alone, so go by the payload.
    const isPerUser = Boolean(result.associated_user);
    const refreshToken = result.refresh_token;

    console.log("\n=== Success ===\n");
    console.log("Granted scopes :", result.scope);
    console.log("Token prefix   :", token.slice(0, 6));
    console.log("expires_in     :", result.expires_in ?? "(absent -> never expires)");
    console.log("refresh_token  :", refreshToken ? "present" : "absent");
    console.log("associated_user:", isPerUser ? "present -> ONLINE token" : "absent");
    console.log("response keys  :", Object.keys(result).join(", "));
    console.log("");

    if (isPerUser) {
      console.log("This is an ONLINE, per-user token tied to your staff login.");
      console.log("It cannot be refreshed. Check, in order:");
      console.log("  1. 'Use legacy install flow' is true on the ACTIVE app version");
      console.log("     (config changes need the version released before they apply)");
      console.log("  2. The app is uninstalled from the store, so this run installs fresh");
      console.log("");
    } else {
      upsertEnv({
        SHOPIFY_ADMIN_TOKEN: token,
        SHOPIFY_REFRESH_TOKEN: refreshToken,
      });

      console.log(
        `Wrote SHOPIFY_ADMIN_TOKEN to backend/.env (prefix ${token.slice(0, 6)}, ` +
          `length ${token.length}).`
      );
      if (refreshToken) {
        console.log("Wrote SHOPIFY_REFRESH_TOKEN too — this token expires, so the");
        console.log("backend will need to refresh it before " + result.expires_in + "s elapse.");
      }
      console.log("Restart the backend, then delete backend/scripts/.\n");
    }
  } catch (err) {
    reply(res, 500, String(err.message));
    console.error("\n" + err.message + "\n");
  } finally {
    server.close(() => process.exit(0));
  }
});

server.listen(PORT, () => {
  const installUrl = buildAuthorizeUrl();

  console.log(`\nListening on ${REDIRECT_URI}`);
  console.log("\nMake sure this exact URL is set as an allowed redirect URL");
  console.log("in the Dev Dashboard, then open the link below in your browser:\n");
  console.log(installUrl + "\n");
});
