import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { searchTrainingsByLearnerId } from "../dataverse";
import { manualFileFor } from "../manuals";
import { mintManualToken } from "../token";

export async function trainings(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const idNumber = request.query.get("idNumber")?.trim();
  if (!idNumber) {
    return { status: 400, jsonBody: { error: "idNumber query parameter is required" } };
  }

  try {
    const found = await searchTrainingsByLearnerId(idNumber);
    // Only a Competent enrollment gets a manual link, and the filename never
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

app.http("trainings", {
  methods: ["GET"],
  authLevel: "function",
  route: "trainings",
  handler: trainings,
});
