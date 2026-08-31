import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import vm from "node:vm";

const root = resolve(import.meta.dirname, "..");
const page = await readFile(resolve(root, "wer-bin-ich.html"), "utf8");
const translationSource = await readFile(resolve(root, "assets/js/about-translations.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(translationSource, sandbox, { filename: "about-translations.js" });
const { aboutLanguages: languages, aboutTranslations: translations } = sandbox.window;
const keys = [...page.matchAll(/data-i18n(?:-alt|-aria-label)?="([^"]+)"/g)].map((match) => match[1]);
const required = ["pageTitle", "pageDescription", ...new Set(keys)];
const failures = [];
if (languages.length !== 6 || new Set(languages).size !== 6) failures.push("Expected exactly six unique languages.");
for (const language of languages) for (const key of required) if (typeof translations[language]?.[key] !== "string" || !translations[language][key].trim()) failures.push(`Missing translation: ${language}.${key}`);
for (const asset of ["assets/images/me/simon-dietz-portrait.jpg", "assets/images/me/MEDIA_MANIFEST.md"]) { try { await stat(resolve(root, asset)); } catch { failures.push(`Missing local asset: ${asset}`); } }
if (!page.includes('dir=activeLanguage==="ar"?"rtl":"ltr"')) failures.push("Arabic RTL handling is missing.");
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; } else console.log(`About-Me check passed: ${languages.length} languages, ${required.length} required keys.`);
