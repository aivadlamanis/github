# NexaFlow Knowledge Base Chat (prototype)

A small web app that lets your team ask questions and get cited answers from the NexaFlow knowledge base in `content/kb`.

## How it answers
The server gives Claude two read-only tools, `read_index` and `read_document`, and follows the index-first procedure from the root `index.md`: root index, category index, then two to three full documents. The answer cites document ID, filename and section. The page shows every document the assistant opened, with status badges (authoritative, outdated content, internal only) and any known conflicts from the category indexes.

Document bodies are never modified. The app has no database and stores nothing.

## Run locally
```
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY and APP_PASSCODE
npm run dev                  # http://localhost:3000
```

## Environment variables
| Name | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Calls the model. Server side only. |
| `APP_PASSCODE` | Yes in production | Shared team passcode. Without it, production refuses to answer. |
| `SESSION_SECRET` | No | Signs the session cookie. Defaults to the passcode. |
| `NEXAFLOW_MODEL` | No | Defaults to `claude-sonnet-5-5`. |

## Checks
```
npm run typecheck   # strict TypeScript
npm run check:kb    # validates every document's front matter with Zod
npm run test:chat   # route test against a local mock of the Anthropic API
```
`test:chat` does not test real answer quality. That needs a real API key.

## Updating the knowledge base
Replace the files in `content/kb`, run `npm run check:kb`, then redeploy. The loader requires the standard front matter on every document.

## Known limits
- One shared passcode, no per-user accounts or audit trail of who asked what.
- Rate limiting is in memory and best effort on serverless hosting.
- `enterprise_pricing.md` and `discount_policy.md` are internal documents. Anyone with the passcode can see answers drawn from them.
- Answers can still be wrong. Check exact figures in the cited document before sending them to a customer.
