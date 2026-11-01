# Implementation: Category Index

[Back to root index](../index.md)

## Category Description

What happens after a customer signs: the nine-phase onboarding process, week-by-week timelines for standard and complex projects, Enterprise technical setup (SSO, SCIM, workspaces, Relay), data migration, and user training and adoption.

This category contains 5 documents.

## Route Questions Here When

- How long does implementation or onboarding take, and when can a customer go live?
- What happens in each onboarding phase, and who is involved?
- How are SSO, SCIM, roles, workspaces, data residency or Relay set up?
- How is data migrated, validated and rolled back if needed?
- How are users trained, and how is adoption measured?

## Documents in This Category

| Document ID | Title | Document Type | Version | Status | Authoritative | Important Topics | Link |
|---|---|---|---|---|---|---|---|
| NEXA-007 | Data Migration Process | Process Guide | 2.2 | Current | Yes | Data mapping and cleansing; Test load and final load; Reconciliation and cutover; Rollback; Security during migration | [data_migration_process.md](data_migration_process.md) |
| NEXA-012 | Enterprise Setup Guide | Technical Setup Guide | 2.8 | Current | Yes | Security review; Tenant provisioning; SSO and SCIM configuration; Workspace and governance design; Relay installation; Go-live checklist | [enterprise_setup.md](enterprise_setup.md) |
| NEXA-014 | Implementation Timeline | Timeline and Planning Reference | 3.1 | Current | Yes | Standard 4 to 6 week timeline; Complex 8 to 12 week timeline; Classification criteria; Critical path and dependencies; Schedule risks; Communicating timelines | [implementation_timeline.md](implementation_timeline.md) |
| NEXA-018 | Customer Onboarding Guide | Process Guide | 3.1 | Current | Yes | Nine-phase onboarding; Onboarding paths by plan; Roles and responsibilities; Customer responsibilities; Governance; Causes of delay | [onboarding_guide.md](onboarding_guide.md) |
| NEXA-025 | Training and Adoption Program | Program Guide | 2.0 | Current | Yes | Role-based training; NexaFlow Academy certifications; Champions program; Change management; Adoption metrics; Hypercare and customer success | [training_and_adoption.md](training_and_adoption.md) |

## Search Terms and RAG Tags

**Search terms:** onboarding, implementation, timeline, 4-6 weeks, 8-12 weeks, go-live, hypercare, kickoff, discovery, UAT, SSO, SCIM, Relay, security review, single-tenant, data migration, cutover, rollback, training, NexaFlow Academy, champions, adoption

**RAG tags:** adoption, adoption-metrics, certification, champions-program, change-management, classification-criteria, complex-implementation, critical-path, csv-import, customer-success, cutover, data-cleansing, data-mapping, data-migration, data-quality, data-residency, discovery, enterprise-setup, go-live, go-live-checklist, hypercare, implementation-phases, implementation-timeline, kickoff, legacy-data, nexaflow-academy, onboarding, onboarding-process, onboarding-timeline, reconciliation, relay-installation, role-mapping, roles-responsibilities, rollback, schedule-risks, scim, security-review, single-tenant, solution-design, sso, standard-implementation, tenant-provisioning, test-load, training, uat, workspaces

## Overlaps With Other Categories

- Product: enterprise_capabilities.md says what the Enterprise plan can do, while enterprise_setup.md says how it is configured. Read both for a full enterprise answer.
- Product: integration_guide.md describes connectors and Relay; implementation_timeline.md schedules the integration work.
- Product: security_overview.md describes security controls; enterprise_setup.md describes the vendor security review process.
- Case Studies: example timelines appear in every case study, but they are not authoritative for general timelines.
- Pricing: implementation fees are defined in pricing_guide_v3.md, not here.
- Sales: sales_playbook.md and objection_handling.md quote the 4 to 6 and 8 to 12 week ranges and advise on when to start the security review.

## Version Conflicts and Precedence

- Timeline tiers: implementation_timeline.md classifies projects as standard (4 to 6 weeks) or complex (8 to 12 weeks). The scenario table in enterprise_setup.md adds a middle 6 to 8 week scenario for single-tenant or customer-managed keys. Winner: implementation_timeline.md for duration and classification. Flagged for human review.
- Training schedule: implementation_timeline.md places user training in week 5 of a standard project, while training_and_adoption.md schedules admin training in week 2 and builder training in weeks 2 to 3, with operator and approver training in week 5. The audiences differ, so this may not be a true contradiction. Winner: training_and_adoption.md for training detail, implementation_timeline.md for the overall project schedule. Flagged for human review.
- Security review start: enterprise_setup.md and implementation_timeline.md say the review starts at contract signature, while sales_playbook.md (Sales) says it starts in sales Stage 4. See the version-control section of the root index.

## Classification Notes and Uncertainty

- training_and_adoption.md could also fit a customer success or Sales category. It is placed here because it describes Phase 7 of onboarding and post-launch support.
- data_migration_process.md describes itself as supporting detail for onboarding_guide.md, implementation_timeline.md and enterprise_setup.md.

## Before You Answer

Open the underlying document before answering any question that needs exact figures, steps or timelines. The summaries and topic lists above are for routing only and are not a substitute for the document text.
