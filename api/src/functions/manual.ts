import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { readFile } from "fs/promises";
import * as path from "path";
import { readManualToken } from "../token";

// Compiled layout is api/dist/src/functions/manual.js, so the PDFs sit three
// levels up. MANUALS_DIR overrides it if the deployment puts them elsewhere.
const MANUALS_DIR = process.env.MANUALS_DIR || path.join(__dirname, "..", "..", "..", "manuals");

export async function manual(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const token = request.query.get("t");
  const file = token ? readManualToken(token) : null;
  if (!file) {
    return { status: 403, jsonBody: { error: "This manual link is invalid or has expired. Search again to get a fresh one." } };
  }
  // The name came out of a payload we signed, but it is about to become a file
  // path — keep it to the shape manuals.ts can actually produce.
  if (!/^[a-z0-9-]+\.pdf$/.test(file)) {
    return { status: 400, jsonBody: { error: "Bad manual reference" } };
  }

  try {
    const body = await readFile(path.join(MANUALS_DIR, file));
    return {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${file}"`,
        "Cache-Control": "private, no-store",
      },
      body,
    };
  } catch (err) {
    context.error(`manual read failed for ${file}`, err);
    return { status: 404, jsonBody: { error: "Manual not found" } };
  }
}

// Anonymous by design: the signed token is the credential. A function key can't
// travel on a plain <a href>, and it would be no secret in a browser bundle anyway.
app.http("manual", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "manual",
  handler: manual,
});
