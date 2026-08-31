import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { searchTrainingsByLearnerId } from "../dataverse";
import { manualFileFor } from "../manuals";
import { mintManualToken } from "../token";

export async function trainings(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const idNumber = request.query.get("idNumber")?.trim();
  const certificateNumber = request.query.get("cert")?.trim();
  if (!idNumber || !certificateNumber) {
    return { status: 400, jsonBody: { error: "idNumber and cert are both required" } };
  }

  try {
    const found = await searchTrainingsByLearnerId(idNumber, certificateNumber);
    if (found === null) {
      // One response for every failure mode — unknown ID, wrong certificate, or
      // no certificate on record. Distinguishing them would turn this endpoint
      // into a way of confirming which ID numbers exist.
      return { status: 404, jsonBody: { error: "No match for those details" } };
    }
    // Only a Competent enrolment gets a manual link, and the filename never
    // leaves the API — the browser only ever sees an opaque signed token.
    const trainings = found.map((training) => {
      const file = training.competent ? manualFileFor(training.courseName) : null;
      return { ...training, manualToken: file ? mintManualToken(file) : null };
    });
    return { status: 200, jsonBody: { trainings } };
  } catch (err) {
    context.error("trainings lookup failed", err);
    return { status: 502, jsonBody: { error: "Failed to search Dataverse" } };
  }
}

// Anonymous because there is nowhere safe to keep a key: this is called straight
// from the browser, so any key would be baked into the public JS bundle (GitHub's
// secret scanning rejects that, and DevTools would reveal it anyway). The real
// access control is the ID + certificate pair checked above. CORS limits browser
// callers to the portal's origin but does not stop a direct request.
app.http("trainings", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "trainings",
  handler: trainings,
});
