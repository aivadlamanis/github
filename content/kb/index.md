# NexaFlow Technologies Knowledge Base

## About This Knowledge Base

This knowledge base organizes the internal documents of NexaFlow Technologies, a B2B SaaS company selling a workflow automation and AI operations platform. The documents cover product, pricing, implementation, case studies and sales. It is built for index-first retrieval: read this root index, route to a category index, then open only the documents needed.

Every document begins with YAML front matter (document ID, category, version, status, last updated date, authoritative flag, outdated-information flag, related documents, summary, key topics and a use_when statement). The original document text follows the front matter unchanged.

- **Total documents:** 25
- **Categories:** 5

## Category Routing Table

| Category | Purpose | Example Questions | Documents | Category Index |
|---|---|---|---|---|
| Case Studies | Customer results, proof points and reference examples | Has NexaFlow helped a manufacturer? What did HealthPlus achieve? | 5 | [case-studies/index.md](case-studies/index.md) |
| Implementation | Onboarding process, timelines, enterprise setup, data migration and training | How long does onboarding take? How is data migrated? How is SSO set up? | 5 | [implementation/index.md](implementation/index.md) |
| Pricing | List prices, licensing, Enterprise quoting, discounts and legacy pricing | What does Enterprise cost? Who approves a 25% discount? Who needs a license? | 5 | [pricing/index.md](pricing/index.md) |
| Product | Platform modules, plan features, enterprise capabilities, integrations and security | Which plan includes SCIM? Which systems integrate? What certifications exist? | 5 | [product/index.md](product/index.md) |
| Sales | Playbook, demo, objection handling, proposals and the prospect FAQ | How do I answer 'too expensive'? How do I run a demo? How do I write a proposal? | 5 | [sales/index.md](sales/index.md) |

## Document Directory

| Document ID | Title | Category | Status | Authoritative | Location |
|---|---|---|---|---|---|
| NEXA-001 | Case Study: Acme Consulting Group | Case Studies | Current | Yes | [case-studies/case_study_acme.md](case-studies/case_study_acme.md) |
| NEXA-002 | Case Study: FinServe Capital | Case Studies | Current | Yes | [case-studies/case_study_finserve.md](case-studies/case_study_finserve.md) |
| NEXA-003 | Case Study: HealthPlus Medical Group | Case Studies | Current | Yes | [case-studies/case_study_healthplus.md](case-studies/case_study_healthplus.md) |
| NEXA-004 | Case Study: ManufacturingCo Industries | Case Studies | Current | Yes | [case-studies/case_study_manufacturingco.md](case-studies/case_study_manufacturingco.md) |
| NEXA-005 | Case Study: RetailMax | Case Studies | Current | Yes | [case-studies/case_study_retailmax.md](case-studies/case_study_retailmax.md) |
| NEXA-006 | Customer FAQ | Sales | Current | No | [sales/customer_faq.md](sales/customer_faq.md) |
| NEXA-007 | Data Migration Process | Implementation | Current | Yes | [implementation/data_migration_process.md](implementation/data_migration_process.md) |
| NEXA-008 | Demo Script | Sales | Current | Yes | [sales/demo_script.md](sales/demo_script.md) |
| NEXA-009 | Discount Policy | Pricing | Current | Yes | [pricing/discount_policy.md](pricing/discount_policy.md) |
| NEXA-010 | Enterprise Capabilities | Product | Current | Yes | [product/enterprise_capabilities.md](product/enterprise_capabilities.md) |
| NEXA-011 | Enterprise Pricing and Negotiation Guidelines | Pricing | Current | Yes | [pricing/enterprise_pricing.md](pricing/enterprise_pricing.md) |
| NEXA-012 | Enterprise Setup Guide | Implementation | Current | Yes | [implementation/enterprise_setup.md](implementation/enterprise_setup.md) |
| NEXA-013 | Feature Matrix by Plan | Product | Current | Yes | [product/feature_matrix.md](product/feature_matrix.md) |
| NEXA-014 | Implementation Timeline | Implementation | Current | Yes | [implementation/implementation_timeline.md](implementation/implementation_timeline.md) |
| NEXA-015 | Integration Guide | Product | Current | Yes | [product/integration_guide.md](product/integration_guide.md) |
| NEXA-016 | Licensing Model | Pricing | Current | Yes | [pricing/licensing_model.md](pricing/licensing_model.md) |
| NEXA-017 | Objection Handling Guide | Sales | Current | Yes | [sales/objection_handling.md](sales/objection_handling.md) |
| NEXA-018 | Customer Onboarding Guide | Implementation | Current | Yes | [implementation/onboarding_guide.md](implementation/onboarding_guide.md) |
| NEXA-019 | Pricing FAQ | Pricing | Current | No | [pricing/pricing_faq.md](pricing/pricing_faq.md) |
| NEXA-020 | Pricing Guide v3 | Pricing | Current | Yes | [pricing/pricing_guide_v3.md](pricing/pricing_guide_v3.md) |
| NEXA-021 | NexaFlow Platform: Product Overview | Product | Current | Yes | [product/product_overview.md](product/product_overview.md) |
| NEXA-022 | Proposal Template | Sales | Current | Yes | [sales/proposal_template.md](sales/proposal_template.md) |
| NEXA-023 | Sales Playbook | Sales | Current | Yes | [sales/sales_playbook.md](sales/sales_playbook.md) |
| NEXA-024 | Security Overview | Product | Current | Yes | [product/security_overview.md](product/security_overview.md) |
| NEXA-025 | Training and Adoption Program | Implementation | Current | Yes | [implementation/training_and_adoption.md](implementation/training_and_adoption.md) |

## Cross-Category Routing Guidance

Many questions need documents from more than one category. Use these patterns, then follow the retrieval procedure below.

| Question Pattern | Categories | Start With |
|---|---|---|
| How much does a plan or Enterprise deal cost? | Pricing | pricing_guide_v3.md, then enterprise_pricing.md for Enterprise structure |
| What is included in a plan, and what does it cost? | Product and Pricing | feature_matrix.md for features, pricing_guide_v3.md for cost |
| How long does implementation take? | Implementation | implementation_timeline.md, then onboarding_guide.md; case studies are examples only |
| Does NexaFlow integrate with a system, and how long does that integration take? | Product and Implementation | integration_guide.md, then implementation_timeline.md |
| A prospect raises price, discount or budget concerns | Sales and Pricing | objection_handling.md, then discount_policy.md for limits and approvers |
| A prospect or security team asks about security or compliance | Product, Sales and Implementation | security_overview.md, objection_handling.md, and enterprise_setup.md for the review process |
| Proof points or references for a prospect in a given industry | Case Studies and Sales | the matching case study, plus demo_script.md or sales_playbook.md for how to use it |
| Writing a proposal | Sales, Pricing and Implementation | proposal_template.md, pricing_guide_v3.md, discount_policy.md, implementation_timeline.md |
| Who needs a license, or how are users counted? | Pricing | licensing_model.md |
| A customer asks about legacy or v2 prices | Pricing | pricing_faq.md (historical section) for context, pricing_guide_v3.md for current prices |
| How are users trained and adoption measured? | Implementation | training_and_adoption.md, with onboarding_guide.md for phase context |
| What does the Enterprise plan add for large organizations? | Product and Implementation | enterprise_capabilities.md for capability, enterprise_setup.md for configuration |

## Version Control

Where documents disagree or contain retired figures, use the authoritative source below. Items marked FLAGGED are unresolved differences that a human should confirm.

| Topic | Authoritative Source | Other Documents and Differences |
|---|---|---|
| List prices, usage allowances, overage, implementation fees, add-ons | pricing_guide_v3.md (NEXA-020) | pricing_faq.md has a HISTORICAL section of retired Pricing Guide v2 prices; enterprise_pricing.md has a historical note on the retired $85 Enterprise price; feature_matrix.md notes a retired v2 Professional run allowance. All v2 figures are outdated since 2026-07-01. Never quote them as current. |
| Enterprise deal structure, volume tiers, negotiation levers | enterprise_pricing.md (NEXA-011), with list prices taken from pricing_guide_v3.md | Internal only. Not for customers. |
| Discount approval authority and special programs | discount_policy.md (NEXA-009) | enterprise_pricing.md describes its price floor as the lowest price a Sales Manager can approve, which does not line up with the discount_policy.md approval matrix. FLAGGED for human review. |
| Licensing, user counts, true-ups, upgrades and downgrades | licensing_model.md (NEXA-016) | customer_faq.md and pricing_faq.md summarize this; defer to licensing_model.md. |
| Implementation duration and standard versus complex classification | implementation_timeline.md (NEXA-014) | Case studies show example timelines only. enterprise_setup.md adds a 6 to 8 week scenario that the timeline document does not use. FLAGGED for human review. |
| Onboarding phases, roles and customer responsibilities | onboarding_guide.md (NEXA-018) | implementation_timeline.md and enterprise_setup.md add schedule and technical detail. |
| Enterprise tenant, SSO, SCIM, Relay and go-live checklist | enterprise_setup.md (NEXA-012) | enterprise_capabilities.md describes what is possible, not the setup steps. |
| Training tracks, certifications and adoption targets | training_and_adoption.md (NEXA-025) | implementation_timeline.md shows the overall project schedule; its training week differs in wording. FLAGGED for human review. |
| Security review start timing | For post-signature implementation planning: implementation_timeline.md and enterprise_setup.md (start at contract signature). For the sales process: sales_playbook.md (start in Stage 4). | The documents describe different start points. FLAGGED for human review before giving a single answer. |
| Plan-by-plan features and limits | feature_matrix.md (NEXA-013) | Cost questions go to pricing_guide_v3.md. |
| Security, compliance and AI data handling | security_overview.md (NEXA-024) | customer_faq.md and objection_handling.md summarize this. |
| Customer results and references | The individual case study for that customer (NEXA-001 to NEXA-005) | Each case study is authoritative only for its own customer. |
| Quick, general prospect answers | customer_faq.md (NEXA-006) is NOT authoritative | Use the source linked in each FAQ answer for exact figures. |

**Documents that contain outdated or historical figures** (contains_outdated_information is Yes): pricing_faq.md (NEXA-019), enterprise_pricing.md (NEXA-011) and feature_matrix.md (NEXA-013). In each case the current authoritative source is named in the document's front matter summary.

**Documents that are not authoritative** (authoritative is No): customer_faq.md (NEXA-006) and pricing_faq.md (NEXA-019). Use the sources they link to for exact answers.

## Retrieval Procedure

1. Read the root index.md.
2. Select the most relevant category or categories.
3. Read the selected category index.md.
4. Select the smallest relevant set of documents (usually 2 to 3).
5. Prefer documents that are authoritative and current.
6. Read the selected documents.
7. Answer using document-supported facts and cite the document ID, filename, and relevant section.
8. If the answer is not in the knowledge base, say so instead of guessing.

## Important Warning

Index summaries, key topic lists and routing tables are navigation aids only. They are not a substitute for the document text. Always open the underlying document before answering any question that needs exact figures, steps or timelines, and never present historical or outdated information as current.

## Handling Notes

- enterprise_pricing.md (NEXA-011) and discount_policy.md (NEXA-009) are internal documents. They state that internal price floors, approval rules and the policy itself must not be shared with customers.
- The original, unmodified source files remain in the nexaflow_docs folder. Nothing was deleted.
