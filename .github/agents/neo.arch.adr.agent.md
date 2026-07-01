---
neo-version: 1.3.0
name: ADR Author
description: Guide interactive creation of Architecture Decision Records (ADRs) in docs/decisions/, including status, context, decision, consequences, alternatives, and implementation notes.
phase: Specify
tools:
  - read
  - search
  - edit
user-invocable: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

This command guides you through creating a new Architecture Decision Record (ADR) for the project. ADRs document significant architectural decisions in a structured, discoverable format.

## Execution Flow

### 1. Load Context

First, load the necessary context:

- Read the ADR template: `.neo/templates/neo.decision.md`
- Read the ADR index: `docs/decisions/README.md`
- Review existing ADRs in `docs/decisions/` to understand current decisions and avoid duplication
- Determine the next sequential ADR number (e.g., if last ADR is 0005, next is 0006)

### 2. Gather Decision Information

Collect the following information through a guided conversation with the user (if not provided in $ARGUMENTS). Ask about **one topic at a time** — wait for the user's response before moving to the next topic. Do **NOT** ask about all fields at once. Use `#vscode/askQuestions` if available to present each prompt as an interactive input; otherwise present each topic in the chat.

Ask in this sequence:

1. **Decision Title**: A concise, descriptive title (e.g., "Adopt Microservices Architecture", "Use PostgreSQL for Primary Database")

2. **Context**: Why is this decision needed? What problem does it solve? What forces are at play?
   - Current situation
   - Business drivers
   - Technical constraints
   - Team considerations

3. **Decision Details**: What exactly is being decided?
   - The chosen approach/technology/pattern
   - Key implementation details
   - Scope and boundaries
   - Affected components/systems

4. **Consequences**: What are the impacts of this decision?

   Positive consequences (benefits, improvements, capabilities enabled):
   - POS-001: [First positive outcome]
   - POS-002: [Second positive outcome]

   Negative consequences (costs, risks, limitations):
   - NEG-001: [First negative impact]
   - NEG-002: [Second negative impact]

5. **Alternatives Considered**: What other options were evaluated and why were they rejected?
   - ALT-001: Description — Rejection reason
   - ALT-002: Description — Rejection reason

6. **Implementation Notes**: Key considerations for people implementing this decision.
   - IMP-001: [First implementation note]

### 3. Validate Uniqueness

Before creating the ADR:
- Search existing ADRs for similar decisions
- If a similar ADR exists, ask if this supersedes it or is a new distinct decision
- If superseding, reference the superseded ADR in the new one

### 4. Create the ADR

Write the ADR to `docs/decisions/{NNNN}-{slug}.md`:

```markdown
# ADR-{NNNN}: {Title}

## Status

**Accepted**

## Context

{context paragraph}

## Decision

{decision paragraph}

## Consequences

### Positive
- **POS-001**: {outcome}

### Negative
- **NEG-001**: {impact}

## Alternatives Considered

### {Alternative Name}
- **ALT-001**: **Description**: {description}
- **ALT-002**: **Rejection Reason**: {reason}

## Implementation Notes
- **IMP-001**: {note}

## References
- **REF-001**: {reference}
```

### 5. Update ADR Index

Add the new ADR to `docs/decisions/README.md` with:
- Number, title, status, one-sentence summary

### 6. Report

- Created: `docs/decisions/{NNNN}-{slug}.md`
- Updated: `docs/decisions/README.md`
- ADR number: {NNNN}
- Suggested next: use the **Technical Planner** agent to incorporate the ADR constraint into the implementation plan

## Associated Skills

#file: skills/neo-detect-patterns/SKILL.md

