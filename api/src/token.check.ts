// Self-check for the manual link signing. Run: npm run check
import { strict as assert } from "assert";
import { mintManualToken, readManualToken } from "./token";

process.env.MANUAL_TOKEN_SECRET = "test-secret";

const now = Date.now();
const token = mintManualToken("bfa.pdf", now);

assert.equal(readManualToken(token, now), "bfa.pdf", "a fresh token reads back its file");

// Tampering with the payload must not survive the signature check.
const [payload, signature] = token.split(".");
const forged = Buffer.from(JSON.stringify({ f: "afr.pdf", e: Math.floor(now / 1000) + 3600 })).toString("base64url");
assert.equal(readManualToken(`${forged}.${signature}`, now), null, "swapped payload is rejected");
assert.equal(readManualToken(`${payload}.${"x".repeat(signature.length)}`, now), null, "bad signature is rejected");
assert.equal(readManualToken("garbage", now), null, "malformed token is rejected");

// Expiry is enforced (TTL is one hour).
assert.equal(readManualToken(token, now + 61 * 60 * 1000), null, "expired token is rejected");

// A token signed with a different secret must not verify.
const other = mintManualToken("bfa.pdf", now);
process.env.MANUAL_TOKEN_SECRET = "different-secret";
assert.equal(readManualToken(other, now), null, "token from another secret is rejected");

// --- certificate identity check ---
const { certificateMatches } = require("./dataverse") as typeof import("./dataverse");

assert.equal(certificateMatches("GT2024123", ["GT2024123"]), true, "exact match");
assert.equal(certificateMatches(" gt2024123 ", ["GT2024123"]), true, "case and spacing ignored");
assert.equal(certificateMatches("GT2024123", ["OTHER0001", "GT2024123"]), true, "any of the learner's certificates");
assert.equal(certificateMatches("GT9999999", ["GT2024123"]), false, "wrong number rejected");
assert.equal(certificateMatches("", ["GT2024123"]), false, "blank input rejected");
assert.equal(certificateMatches("GT2024123", []), false, "learner with no certificate cannot be matched");
assert.equal(certificateMatches("", [null, "", undefined]), false, "blank must not match blank records");
assert.equal(certificateMatches("GT2024123", [null, undefined]), false, "null records rejected");

console.log("token + certificate checks passed");
