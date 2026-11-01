import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { FrontMatterSchema, type FrontMatter, type Source } from "./schemas";

/**
 * Read-only access to the organized knowledge base in content/kb.
 * Nothing in this module writes to disk. Document bodies are returned exactly
 * as stored.
 */

export const KB_ROOT = path.join(process.cwd(), "content", "kb");

export type KbDocument = {
  frontMatter: FrontMatter;
  filename: string; // e.g. security_overview.md
  relPath: string; // e.g. product/security_overview.md
  raw: string; // full file text, front matter included
};

export type KbIndex = {
  key: string; // "root" or the category folder name
  relPath: string;
  raw: string;
};

export type Kb = {
  documents: Map<string, KbDocument>; // keyed by filename
  indexes: Map<string, KbIndex>; // keyed by "root" or category folder
};

const FM_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

export function parseFrontMatter(raw: string, where: string): FrontMatter {
  const match = FM_PATTERN.exec(raw);
  if (!match || match[1] === undefined) {
    throw new Error(`No front matter found in ${where}`);
  }
  const parsed = FrontMatterSchema.safeParse(parseYaml(match[1]));
  if (!parsed.success) {
    throw new Error(
      `Invalid front matter in ${where}: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    );
  }
  return parsed.data;
}

function loadKb(root: string): Kb {
  const documents = new Map<string, KbDocument>();
  const indexes = new Map<string, KbIndex>();

  const rootIndex = path.join(root, "index.md");
  indexes.set("root", {
    key: "root",
    relPath: "index.md",
    raw: fs.readFileSync(rootIndex, "utf8"),
  });

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(root, entry.name);
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const relPath = `${entry.name}/${file}`;
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      if (file === "index.md") {
        indexes.set(entry.name, { key: entry.name, relPath, raw });
        continue;
      }
      if (documents.has(file)) {
        throw new Error(`Duplicate document filename: ${file}`);
      }
      documents.set(file, {
        frontMatter: parseFrontMatter(raw, relPath),
        filename: file,
        relPath,
        raw,
      });
    }
  }
  return { documents, indexes };
}

let cached: Kb | undefined;
export function getKb(): Kb {
  cached ??= loadKb(KB_ROOT);
  return cached;
}

/** Documents flagged as internal by tag or by their own summary text. */
export function isInternalOnly(fm: FrontMatter): boolean {
  return (
    fm.rag_tags.includes("internal-only") ||
    /must not be shared with customers/i.test(fm.summary)
  );
}

export function toSource(doc: KbDocument): Source {
  const fm = doc.frontMatter;
  return {
    documentId: fm.document_id,
    filename: doc.filename,
    path: doc.relPath,
    title: fm.title,
    category: fm.main_category,
    version: fm.version,
    status: fm.status,
    lastUpdated: fm.last_updated,
    authoritative: fm.authoritative,
    containsOutdated: fm.contains_outdated_information === "Yes",
    internalOnly: isInternalOnly(fm),
  };
}

export function categoryKeys(kb: Kb): string[] {
  return [...kb.indexes.keys()].filter((k) => k !== "root").sort();
}
