---
document_id: "NEXA-013"
title: "Feature Matrix by Plan"
document_type: "Feature Comparison Matrix"
main_category: "Product"
secondary_topics:
  - "Plan comparison"
  - "AI agent limits"
  - "Integration and API limits"
  - "Security and identity features"
  - "Support and SLA by plan"
rag_tags:
  - "feature-matrix"
  - "plan-comparison"
  - "starter"
  - "professional"
  - "enterprise"
  - "sso"
  - "scim"
  - "rbac"
  - "audit-logs"
  - "api-limits"
  - "ai-agents"
  - "sla"
version: "3.0"
status: "Current"
last_updated: "2026-07-01"
authoritative: "Yes"
supersedes: "Earlier v2 feature matrices"
contains_outdated_information: "Yes"
related_documents:
  - "product_overview.md"
  - "security_overview.md"
  - "pricing_guide_v3.md"
  - "enterprise_capabilities.md"
summary: "Lists which capabilities are included in the Starter, Professional and Enterprise plans, aligned with Pricing Guide v3 effective 2026-07-01. It notes that the Professional run allowance of 25,000 shown in earlier v2 matrices is retired; pricing_guide_v3.md is the authoritative source for prices and usage allowances."
key_topics:
  - "SSO on Professional and Enterprise; SCIM is Enterprise-only"
  - "Audit logs: none on Starter, 90 days on Professional, 1 year (up to 7) on Enterprise"
  - "Included runs per month: 5,000, 50,000 and 500,000"
  - "API rate limits of 60, 600 and 3,000 requests per minute"
  - "Uptime SLA 99.5% on Professional and 99.9% on Enterprise"
use_when: "Questions about which plan includes a feature or whether a capability (SSO, audit logs, API access, custom roles, AI agent limits) is available on a plan."
---

# Feature Matrix by Plan

## Metadata

- Category: Product
- Document Type: Feature Comparison Matrix
- Version: 3.0
- Status: Current
- Last Updated: 2026-07-01
- Authoritative: Yes
- Keywords: feature comparison, Starter, Professional, Enterprise, plan features, SSO, SCIM, RBAC, audit logs, API limits, AI agents, workflow runs, SLA
- Use When: Someone asks which features are included in which plan, or whether a specific capability (SSO, audit logs, API access, custom roles) is available on a plan.

## Summary

This matrix lists which NexaFlow capabilities are included in the Starter, Professional and Enterprise plans. It is aligned with `pricing_guide_v3.md` (effective 2026-07-01), which is the authoritative source for prices and usage allowances. Use this document for "is feature X included?" questions and the pricing guide for "what does it cost?" questions.

## Main Content

### Plan Positioning

- **Starter** — small teams automating departmental workflows. Self-serve.
- **Professional** — growing mid-sized companies automating cross-department processes with SSO and more integrations.
- **Enterprise** — large organisations needing advanced security, governance, scale, dedicated support and guided implementation.

### Core Workflow Features

| Feature | Starter | Professional | Enterprise |
|---|---|---|---|
| Flow Builder (visual canvas) | Yes | Yes | Yes |
| Workflow templates | 30 | 120+ | 120+ plus custom template library |
| Active workflows | 20 | 200 | Unlimited |
| Workflow runs included / month | 5,000 | 50,000 | 500,000 |
| Environments | Production only | Dev + Production | Dev + Staging + Production |
| Flow version history | 30 days | 1 year | Unlimited |
| Human approval steps | Yes | Yes | Yes |
| Parallel branches and loops | No | Yes | Yes |

### AI Agent Features

| Feature | Starter | Professional | Enterprise |
|---|---|---|---|
| Agent Studio | Yes | Yes | Yes |
| Active AI agents | 2 | 15 | Unlimited |
| Document extraction agents | No | Yes | Yes |
| Knowledge sources per agent | 1 | 10 | Unlimited |
| Bring-your-own LLM key | No | No | Yes |
| Agent confidence thresholds and approval gates | Basic | Yes | Yes, with policy templates |
| Agent decision logs | 30 days | 90 days | 1 year (extendable to 7 years) |

### Integrations and API

| Feature | Starter | Professional | Enterprise |
|---|---|---|---|
| Pre-built connectors | 25 standard | All 200+ | All 200+ |
| Premium connectors (SAP, Oracle, Workday) | No | Add-on | Included |
| Generic REST connector | No | Yes | Yes |
| NexaFlow Relay (on-premise agent) | No | No | Yes |
| Nexa API (REST) | Read-only | Full | Full |
| GraphQL API | No | Yes | Yes |
| Webhooks | 5 | 100 | Unlimited |
| API rate limit | 60 req/min | 600 req/min | 3,000 req/min (raisable) |

### Security, Identity and Governance

| Feature | Starter | Professional | Enterprise |
|---|---|---|---|
| Email + MFA login | Yes | Yes | Yes |
| SSO (SAML 2.0 / OIDC) | No | Yes | Yes |
| SCIM user provisioning | No | No | Yes |
| Role-based access control | 3 fixed roles | 5 default roles | 5 default roles + custom roles |
| Audit logs | No | 90-day retention | 1-year retention (extendable to 7 years) |
| Audit log export / SIEM streaming | No | CSV export | SIEM streaming (Splunk, Datadog, Sentinel) |
| IP allowlisting | No | No | Yes |
| Data residency choice | US only | US or EU | US, EU or APAC |
| Single-tenant deployment | No | No | Optional |
| Customer-managed encryption keys | No | No | Yes |
| HIPAA BAA | No | No | Yes |

### Dashboards and Reporting

| Feature | Starter | Professional | Enterprise |
|---|---|---|---|
| Command Center standard dashboards | Yes | Yes | Yes |
| Custom dashboards | No | 10 | Unlimited |
| Hours-saved / ROI tracking | No | Yes | Yes |
| BI export (Snowflake, BigQuery) | No | No | Yes |

### Support and Services

| Feature | Starter | Professional | Enterprise |
|---|---|---|---|
| Support channel | Email | Email + chat | 24/7 phone, chat, email |
| Target first response (P1) | 1 business day | 4 hours | 1 hour |
| Uptime SLA | None | 99.5% | 99.9% |
| Customer Success Manager | No | Pooled | Named CSM |
| Implementation | Self-serve | Optional Quick Start | Guided implementation (required) |
| Training | Online academy | Academy + 2 live sessions | Role-based training program |

### Notes

- Usage allowances above match `pricing_guide_v3.md`. Earlier matrices (v2) showed Professional with 25,000 runs; that figure is retired.
- Custom roles, SCIM and SIEM streaming are Enterprise-only and are the most common reason Professional customers upgrade.

## Key Facts

- SSO is available on Professional and Enterprise; SCIM is Enterprise-only.
- Audit logs: none on Starter, 90 days on Professional, 1 year (up to 7) on Enterprise.
- Enterprise includes 500,000 workflow runs per month and unlimited AI agents.
- Uptime SLA: 99.5% Professional, 99.9% Enterprise.
- Enterprise implementation is guided and required.

## Related Documents

- product_overview.md
- security_overview.md
- pricing_guide_v3.md
- enterprise_capabilities.md

## Retrieval Notes

Retrieve for "which plan includes X", "does Professional have SSO/audit logs", "API rate limits", "how many AI agents/workflows per plan" questions. Pair with `security_overview.md` for how a security feature works, and with `pricing_guide_v3.md` if the question also asks about cost.
