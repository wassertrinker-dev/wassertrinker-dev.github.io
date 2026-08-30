import { readFileSync } from "node:fs";

const dataPath = new URL("../governance/model-evaluations.json", import.meta.url);
const schemaPath = new URL("../governance/model-evaluations.schema.json", import.meta.url);
const allowedStoryPoints = new Set([1, 2, 3, 5, 8, 13, 21]);
const allowedRiskClasses = new Set(["low", "medium", "high"]);
const allowedSources = new Set(["verified-metadata", "human-confirmed"]);
const allowedEnvironments = new Set(["hosted", "local"]);

function fail(message) { throw new Error(message); }
function isObject(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function requireString(value, name) { if (typeof value !== "string" || value.trim() === "") fail(`${name} must be a non-empty string.`); }

function requireExactKeys(value, keys, name) {
  if (!isObject(value)) fail(`${name} must be an object.`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) fail(`${name} has unsupported or missing fields.`);
}

function validateReasoning(value, name) {
  requireExactKeys(value, ["nativeSetting", "normalizedLevel"], name);
  requireString(value.nativeSetting, `${name}.nativeSetting`);
  if (value.normalizedLevel !== null && (!Number.isInteger(value.normalizedLevel) || value.normalizedLevel < 1 || value.normalizedLevel > 6)) fail(`${name}.normalizedLevel must be null or an integer from 1 to 6.`);
}

function validateModel(value, name) {
  requireExactKeys(value, ["provider", "model", "reasoning"], name);
  requireString(value.provider, `${name}.provider`);
  requireString(value.model, `${name}.model`);
  validateReasoning(value.reasoning, `${name}.reasoning`);
}

function validateRecord(record, index) {
  const name = `modelRecords[${index}]`;
  requireExactKeys(record, ["issueNumber", "storyType", "storyPoints", "riskClass", "recommendation", "execution"], name);
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
}

try {
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  if (schema.title !== "Model decision record") fail("The model decision schema is not available.");
  requireExactKeys(data, ["schemaVersion", "modelRecords"], "root");
  if (data.schemaVersion !== "2.0") fail("root.schemaVersion must be 2.0.");
  if (!Array.isArray(data.modelRecords)) fail("root.modelRecords must be an array.");
  const issues = new Set();
  data.modelRecords.forEach((record, index) => {
    validateRecord(record, index);
    if (issues.has(record.issueNumber)) fail(`Issue #${record.issueNumber} is recorded more than once.`);
    issues.add(record.issueNumber);
  });
  console.log(`Model decision records are valid (${data.modelRecords.length} record(s)).`);
} catch (error) {
  console.error(`Model decision validation failed: ${error.message}`);
  process.exitCode = 1;
}
