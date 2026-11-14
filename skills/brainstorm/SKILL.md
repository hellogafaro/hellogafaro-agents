---
name: |-
  brainstorm
description: |-
  Resolves unsettled product, design, or implementation decisions through short question rounds and concrete options. Use before committing to a direction, not for implementation or automatic plan publication.
notion_page_id: 3dffc798-2e43-81c0-8dda-dc51c65d63f2
---

# brainstorm

Return the resolved decision to the calling workflow. Do not resume implementation or persist the plan unless already authorized.

Help the user reach a decision, not endure an interview. Start with the desired outcome and the uncertainty that changes the next action.

1. Read the available context. Separate facts, assumptions, and genuine choices.
2. Map which choices depend on others, and ask only questions whose prerequisites are settled. Default to one consequential question; group up to three independent ones when that saves a turn.
3. Give each question a recommendation and the tradeoff that could change it. Use short options, not an essay. Skip questions whose answer would not change the work.
4. When the choice depends on appearance or interaction, use `artifacts` to compare two or three genuinely different options. When it depends on measurable behavior, propose the smallest safe experiment and run it within the authorized scope. Label sketches and prototypes as proposals, not implementation evidence.
5. Incorporate the answer, retire rejected branches, and resolve the next dependency. If new evidence invalidates a premise, say what changed instead of defending the earlier option.

Stop when the chosen direction, material constraints, and remaining uncertainty are clear enough for the next requested action. Return a short decision recap and the one next decision, if any. Do not explore every hypothetical edge case or repeat settled questions.

A brainstorming request authorizes discussion and read-only discovery, not production changes, external publication, or persistent planning records. Use `documents` or `tasks` only when saving or execution is authorized. Apply `write` to the conversation.
