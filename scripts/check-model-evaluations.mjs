import { readFileSync } from "node:fs";

const dataPath = new URL("../governance/model-evaluations.json", import.meta.url);
const schemaPath = new URL("../governance/model-evaluations.schema.json", import.meta.url);
const allowedStoryPoints = new Set([1, 2, 3, 5, 8, 13, 21]);
const allowedRiskClasses = new Set(["low", "medium", "high"]);
const allowedSources = new Set(["verified-metadata", "human-confirmed"]);
const allowedEnvironments = new Set(["hosted", "local"]);
const allowedAssessments = new Set(["fit", "oversized", "insufficient"]);
const allowedRework = new Set(["none", "minor", "material"]);

function fail(message) {
  throw new Error(message);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(value, name) {
  if (typeof value !== "string" || value.trim() === "") fail(`${name} must be a non-empty string.`);
}

function requireExactKeys(value, keys, name) {
  if (!isObject(value)) fail(`${name} must be an object.`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    fail(`${name} has unsupported or missing fields.`);
  }
}

function validateReasoning(value, name) {
  requireExactKeys(value, ["nativeSetting", "normalizedLevel"], name);
  requireString(value.nativeSetting, `${name}.nativeSetting`);
  if (value.normalizedLevel !== null && (!Number.isInteger(value.normalizedLevel) || value.normalizedLevel < 1 || value.normalizedLevel > 6)) {
    fail(`${name}.normalizedLevel must be null or an integer from 1 to 6.`);
  }
}

function validateModel(value, name) {
  requireExactKeys(value, ["provider", "model", "reasoning"], name);
  requireString(value.provider, `${name}.provider`);
  requireString(value.model, `${name}.model`);
  validateReasoning(value.reasoning, `${name}.reasoning`);
}

function validateMeasurement(value, name) {
  requireExactKeys(value, ["durationMinutes", "inputTokens", "outputTokens", "costUsd"], name);
  for (const [field, fieldValue] of Object.entries(value)) {
    if (fieldValue !== null && (typeof fieldValue !== "number" || fieldValue < 0 || !Number.isFinite(fieldValue))) {
      fail(`${name}.${field} must be null or a non-negative number.`);
    }
    if ((field === "inputTokens" || field === "outputTokens") && fieldValue !== null && !Number.isInteger(fieldValue)) {
      fail(`${name}.${field} must be an integer when present.`);
    }
  }
}

function validateEvaluation(record, index) {
  const name = `evaluations[${index}]`;
  requireExactKeys(record, ["issueNumber", "storyType", "storyPoints", "riskClass", "recommendation", "execution", "outcome", "assessment", "comparisonCandidate"], name);
  if (!Number.isInteger(record.issueNumber) || record.issueNumber < 1) fail(`${name}.issueNumber must be a positive integer.`);
  requireString(record.storyType, `${name}.storyType`);
  if (!allowedStoryPoints.has(record.storyPoints)) fail(`${name}.storyPoints must use the agreed Fibonacci scale.`);
  if (!allowedRiskClasses.has(record.riskClass)) fail(`${name}.riskClass is invalid.`);

  requireExactKeys(record.recommendation, ["model", "rationale"], `${name}.recommendation`);
  validateModel(record.recommendation.model, `${name}.recommendation.model`);
  requireString(record.recommendation.rationale, `${name}.recommendation.rationale`);

  requireExactKeys(record.execution, ["model", "environment", "metadataSource"], `${name}.execution`);
  validateModel(record.execution.model, `${name}.execution.model`);
  if (!allowedEnvironments.has(record.execution.environment)) fail(`${name}.execution.environment is invalid.`);
  if (!allowedSources.has(record.execution.metadataSource)) fail(`${name}.execution.metadataSource is invalid.`);

  requireExactKeys(record.outcome, ["mergedAt", "mergeGate", "acceptanceCriteria", "rework", "measurement"], `${name}.outcome`);
  requireString(record.outcome.mergedAt, `${name}.outcome.mergedAt`);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(record.outcome.mergedAt) || Number.isNaN(Date.parse(record.outcome.mergedAt))) {
    fail(`${name}.outcome.mergedAt must be an ISO date-time.`);
  }
  if (record.outcome.mergeGate !== "GO") fail(`${name}.outcome.mergeGate must be GO.`);
  if (record.outcome.acceptanceCriteria !== "passed") fail(`${name}.outcome.acceptanceCriteria must be passed.`);
  if (!allowedRework.has(record.outcome.rework)) fail(`${name}.outcome.rework is invalid.`);
  validateMeasurement(record.outcome.measurement, `${name}.outcome.measurement`);

  if (!allowedAssessments.has(record.assessment)) fail(`${name}.assessment is invalid.`);
  if (record.comparisonCandidate !== null) {
    requireExactKeys(record.comparisonCandidate, ["provider", "model", "reason"], `${name}.comparisonCandidate`);
    requireString(record.comparisonCandidate.provider, `${name}.comparisonCandidate.provider`);
    requireString(record.comparisonCandidate.model, `${name}.comparisonCandidate.model`);
    requireString(record.comparisonCandidate.reason, `${name}.comparisonCandidate.reason`);
  }
}

try {
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  if (schema.title !== "Model evaluation record") fail("The model evaluation schema is not available.");
  requireExactKeys(data, ["schemaVersion", "evaluations"], "root");
  if (data.schemaVersion !== "1.0") fail("root.schemaVersion must be 1.0.");
  if (!Array.isArray(data.evaluations)) fail("root.evaluations must be an array.");

  const issues = new Set();
  data.evaluations.forEach((record, index) => {
    validateEvaluation(record, index);
    if (issues.has(record.issueNumber)) fail(`Issue #${record.issueNumber} is recorded more than once.`);
    issues.add(record.issueNumber);
  });
  console.log(`Model evaluations are valid (${data.evaluations.length} record(s)).`);
} catch (error) {
  console.error(`Model evaluation validation failed: ${error.message}`);
  process.exitCode = 1;
}
