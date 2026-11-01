/**
 * Validates the bundled knowledge base the same way the app loads it.
 * Run with: npm run check:kb
 */
import { KNOWN_CONFLICTS } from "../lib/conflicts";
import { categoryKeys, getKb } from "../lib/kb";

const errors: string[] = [];
const kb = getKb();

if (kb.documents.size !== 25) {
  errors.push(`Expected 25 documents, found ${kb.documents.size}`);
}
if (categoryKeys(kb).length !== 5) {
  errors.push(`Expected 5 category indexes, found ${categoryKeys(kb).length}`);
}
if (!kb.indexes.has("root")) errors.push("Missing root index");

const ids = new Set<string>();
for (const doc of kb.documents.values()) {
  const fm = doc.frontMatter;
  if (ids.has(fm.document_id)) errors.push(`Duplicate document_id ${fm.document_id}`);
  ids.add(fm.document_id);
  for (const rel of fm.related_documents) {
    if (!kb.documents.has(rel)) errors.push(`${doc.filename}: related document not found: ${rel}`);
  }
}

for (const c of KNOWN_CONFLICTS) {
  for (const f of c.documents) {
    if (!kb.documents.has(f)) errors.push(`Conflict ${c.id} references missing file ${f}`);
  }
}

if (errors.length) {
  console.error(`KB check failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `KB OK: ${kb.documents.size} documents, ${categoryKeys(kb).length} categories, ${KNOWN_CONFLICTS.length} known conflicts mapped.`,
);
