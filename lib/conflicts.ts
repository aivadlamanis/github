import type { Warning } from "./schemas";

/**
 * Known conflicts between documents, taken from the "Version Conflicts and
 * Precedence" sections of the category indexes. They are surfaced to the user
 * whenever the assistant opens one of the documents involved, because the
 * answer may depend on which side is right.
 */
type KnownConflict = Warning;

export const KNOWN_CONFLICTS: KnownConflict[] = [
  {
    id: "discount-approval",
    title: "Discount approval authority differs between documents",
    detail:
      "enterprise_pricing.md describes the tier floor as the lowest price a Sales Manager can approve. discount_policy.md has the Sales Manager approving 10.1 to 20% and the VP Sales 20.1 to 30%. The knowledge base treats discount_policy.md as the winner for approval authority. Flagged for human review.",
    documents: ["enterprise_pricing.md", "discount_policy.md"],
  },
  {
    id: "security-review-start",
    title: "Security review start time differs between documents",
    detail:
      "sales_playbook.md says the security review starts in sales Stage 4. enterprise_setup.md and implementation_timeline.md say it starts at contract signature. No winner is set. Flagged for human review.",
    documents: [
      "sales_playbook.md",
      "enterprise_setup.md",
      "implementation_timeline.md",
    ],
  },
  {
    id: "timeline-tiers",
    title: "Implementation timeline tiers differ between documents",
    detail:
      "enterprise_setup.md adds a 6 to 8 week scenario that implementation_timeline.md does not define (it uses 4 to 6 weeks standard and 8 to 12 weeks complex). The knowledge base treats implementation_timeline.md as the winner for duration and classification. Flagged for human review.",
    documents: ["enterprise_setup.md", "implementation_timeline.md"],
  },
  {
    id: "training-schedule",
    title: "Training schedule wording differs between documents",
    detail:
      "implementation_timeline.md places user training in week 5. training_and_adoption.md schedules admin training in week 2, builder training in weeks 2 to 3, and operator and approver training in week 5. The audiences differ, so this may not be a true contradiction. Flagged for human review.",
    documents: ["implementation_timeline.md", "training_and_adoption.md"],
  },
];

export function warningsForDocuments(filenames: string[]): Warning[] {
  const opened = new Set(filenames);
  return KNOWN_CONFLICTS.filter((c) =>
    c.documents.some((d) => opened.has(d)),
  );
}
