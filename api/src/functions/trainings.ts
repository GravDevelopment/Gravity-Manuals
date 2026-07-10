import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { searchTrainingsByLearnerId } from "../dataverse";

export async function trainings(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const idNumber = request.query.get("idNumber")?.trim();
  if (!idNumber) {
    return { status: 400, jsonBody: { error: "idNumber query parameter is required" } };
  }

  try {
    const trainings = await searchTrainingsByLearnerId(idNumber);
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
