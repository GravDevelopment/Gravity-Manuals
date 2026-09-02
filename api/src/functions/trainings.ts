import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { searchTrainingsByLearnerId } from "../dataverse";
import { manualsFor } from "../manuals";
import { mintManualToken } from "../token";

export async function trainings(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const idNumber = request.query.get("idNumber")?.trim();
  if (!idNumber) {
    return { status: 400, jsonBody: { error: "idNumber is required" } };
  }

  try {
    const found = await searchTrainingsByLearnerId(idNumber);
    // Only a Competent enrolment gets manual links, one per available language.
    // Filenames never leave the API — the browser only sees opaque signed tokens.
    const trainings = found.map((training) => ({
      ...training,
      manuals: training.competent
        ? manualsFor(training.courseName).map(({ lang, label, file }) => ({
            lang,
            label,
            token: mintManualToken(file),
          }))
        : [],
    }));
    return { status: 200, jsonBody: { trainings } };
  } catch (err) {
    context.error("trainings lookup failed", err);
    return { status: 502, jsonBody: { error: "Failed to search Dataverse" } };
  }
}

// Anonymous, and there is no second factor: an ID number alone returns the
// learner's record. A function key can't help — this is called from the browser,
// so any key ends up in the public JS bundle. CORS limits browser callers to the
// portal's origins but does not stop a direct request, so treat this endpoint as
// world-readable given an ID number.
app.http("trainings", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "trainings",
  handler: trainings,
});
