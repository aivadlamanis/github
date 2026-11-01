import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { categoryKeys, getKb, type KbDocument } from "./kb";

/** Tool definitions given to the model. Read-only access to the knowledge base. */
export function toolDefinitions(): Anthropic.Tool[] {
  const kb = getKb();
  const categories = ["root", ...categoryKeys(kb)];
  const filenames = [...kb.documents.keys()].sort();
  return [
    {
      name: "read_index",
      description:
        "Read an index file. Use category 'root' first to see all categories and the retrieval rules, then a category folder name to see its documents. Indexes are for routing only; open the documents themselves before answering.",
      input_schema: {
        type: "object",
        properties: {
          category: { type: "string", enum: categories },
        },
        required: ["category"],
      },
    },
    {
      name: "read_document",
      description:
        "Read one full knowledge base document (front matter and body) by filename. Use this to get exact figures, steps and sections before answering.",
      input_schema: {
        type: "object",
        properties: {
          filename: {
            type: "string",
            enum: filenames,
            description: "Document filename, for example pricing_guide_v3.md",
          },
        },
        required: ["filename"],
      },
    },
  ];
}

const ReadIndexInput = z.object({ category: z.string() });
const ReadDocumentInput = z.object({ filename: z.string() });

export type ToolOutcome =
  | { ok: true; text: string; opened?: KbDocument; label: string }
  | { ok: false; text: string; label: string };

/** Execute a tool call. Input is validated; lookups use exact map keys, never raw paths. */
export function runTool(name: string, input: unknown): ToolOutcome {
  const kb = getKb();

  if (name === "read_index") {
    const parsed = ReadIndexInput.safeParse(input);
    if (!parsed.success) {
      return { ok: false, label: "Invalid index request", text: "Error: category is required." };
    }
    const index = kb.indexes.get(parsed.data.category);
    if (!index) {
      return {
        ok: false,
        label: `Unknown category ${parsed.data.category}`,
        text: `Error: unknown category. Valid values: root, ${categoryKeys(kb).join(", ")}.`,
      };
    }
    return {
      ok: true,
      label: `Reading ${index.relPath}`,
      text: `<index path="${index.relPath}">\n${index.raw}\n</index>`,
    };
  }

  if (name === "read_document") {
    const parsed = ReadDocumentInput.safeParse(input);
    if (!parsed.success) {
      return { ok: false, label: "Invalid document request", text: "Error: filename is required." };
    }
    const doc = kb.documents.get(parsed.data.filename);
    if (!doc) {
      return {
        ok: false,
        label: `Unknown document ${parsed.data.filename}`,
        text: "Error: no such document. Check the category index for the exact filename.",
      };
    }
    return {
      ok: true,
      opened: doc,
      label: `Reading ${doc.relPath}`,
      text: `<document id="${doc.frontMatter.document_id}" filename="${doc.filename}" path="${doc.relPath}">\n${doc.raw}\n</document>`,
    };
  }

  return { ok: false, label: `Unknown tool ${name}`, text: `Error: unknown tool ${name}.` };
}
