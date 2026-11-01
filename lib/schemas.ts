import { z } from "zod";

/** Front matter shape produced by the knowledge-base organizer. */
export const FrontMatterSchema = z.object({
  document_id: z.string().regex(/^NEXA-\d{3}$/),
  title: z.string().min(1),
  document_type: z.string().min(1),
  main_category: z.string().min(1),
  secondary_topics: z.array(z.string()),
  rag_tags: z.array(z.string()),
  version: z.string().min(1),
  status: z.string().min(1),
  last_updated: z.string().min(1),
  authoritative: z.string().min(1),
  supersedes: z.string().min(1),
  contains_outdated_information: z.enum(["Yes", "No"]),
  related_documents: z.array(z.string()),
  summary: z.string().min(1),
  key_topics: z.array(z.string()),
  use_when: z.string().min(1),
});
export type FrontMatter = z.infer<typeof FrontMatterSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(20),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const LoginRequestSchema = z.object({
  passcode: z.string().min(1).max(200),
});

/** A document the assistant actually opened while answering. */
export const SourceSchema = z.object({
  documentId: z.string(),
  filename: z.string(),
  path: z.string(),
  title: z.string(),
  category: z.string(),
  version: z.string(),
  status: z.string(),
  lastUpdated: z.string(),
  authoritative: z.string(),
  containsOutdated: z.boolean(),
  internalOnly: z.boolean(),
});
export type Source = z.infer<typeof SourceSchema>;

export const WarningSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string(),
  documents: z.array(z.string()),
});
export type Warning = z.infer<typeof WarningSchema>;

/** Server-sent events streamed to the browser. */
export const StreamEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("status"), text: z.string() }),
  z.object({ type: z.literal("text"), delta: z.string() }),
  // Clears any text streamed so far (used if the model wrote text before a tool call).
  z.object({ type: z.literal("reset") }),
  z.object({
    type: z.literal("sources"),
    sources: z.array(SourceSchema),
    warnings: z.array(WarningSchema),
  }),
  z.object({ type: z.literal("error"), message: z.string() }),
  z.object({ type: z.literal("done") }),
]);
export type StreamEvent = z.infer<typeof StreamEventSchema>;
