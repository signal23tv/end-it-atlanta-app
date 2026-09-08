/**
 * Urgent-pathway detection for Todd (Section 9). This check runs
 * BEFORE any AI call and does not depend on the AI provider being
 * configured -- crisis routing must work even if Todd's model key
 * is missing. Keeps to well-established, non-org-specific public
 * safety resources; makes no drug-specific or dosing claims.
 */

export type UrgentCategory =
  | "possible_exposure"
  | "severe_reaction"
  | "immediate_danger"
  | "assault"
  | "mental_health_crisis";

const PATTERNS: { category: UrgentCategory; test: RegExp }[] = [
  {
    category: "possible_exposure",
    test: /\b(exposed|exposure|condom broke|might have hiv|think i (got|have) hiv|unprotected)\b/i,
  },
  {
    category: "severe_reaction",
    test: /\b(allergic reaction|can'?t breathe|throat (closing|swelling)|severe (reaction|side effect))\b/i,
  },
  {
    category: "immediate_danger",
    test: /\b(overdose|suicidal|kill myself|going to die|emergency|can'?t breathe)\b/i,
  },
  {
    category: "assault",
    test: /\b(assault(ed)?|raped|rape|sexual assault)\b/i,
  },
  {
    category: "mental_health_crisis",
    test: /\b(suicidal|want to die|self.?harm|hurt myself|kill myself)\b/i,
  },
];

export function detectUrgentCategory(message: string): UrgentCategory | null {
  for (const { category, test } of PATTERNS) {
    if (test.test(message)) return category;
  }
  return null;
}

export function urgentResponseFor(category: UrgentCategory): string {
  switch (category) {
    case "immediate_danger":
    case "mental_health_crisis":
      return "If you're in immediate danger, please call 911. If you're thinking about suicide or self-harm, you can call or text 988 (Suicide & Crisis Lifeline) anytime — free and confidential. I'm not able to handle emergencies myself, but a real person can help right now.";
    case "assault":
      return "I'm sorry this happened to you. If you're in immediate danger, call 911. You can also reach the National Sexual Assault Hotline at 800-656-4673, any time, for free and confidential support. When you're ready, our navigators can also help connect you to care.";
    case "possible_exposure":
      return "If you think you may have been recently exposed to HIV, same-day medical evaluation matters — please go to an emergency room, urgent care, or call a clinic right away rather than waiting. I can help you find nearby testing/care options once you're ready, but this isn't something to wait on Todd for.";
    case "severe_reaction":
      return "A severe or allergic reaction is a medical emergency — please call 911 or go to the nearest emergency room now. I'm not able to advise on symptoms myself.";
  }
}
