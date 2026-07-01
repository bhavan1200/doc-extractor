<!-- NEO:BEGIN version=1.4.1 -->
<!-- ⚠️  AUTO-MANAGED by Neo Coding extension — do not edit this block manually. -->
<!-- Run "Neo: Rebuild Orchestrator Instructions" to regenerate. -->

## Neo Agent Registry

The following Neo SDLC workflow agents are installed in this workspace.
When routing requests, prefer the most specific agent for the task.

### Neo Workflow Agents

- **ADR Author**: Guide interactive creation of Architecture Decision Records (ADRs) in docs/decisions/, including status, context, decision, consequences, alternatives, and implementation notes.
- **ADR Recovery**: Handles ADR violation recovery by running a max-2-round correction loop and escalating to the user with Options A/B/C if unresolved.
- **Architecture Reviewer**: Use when reviewing architecture, evaluating design proposals, checking ADR consistency, analyzing system structure, or identifying architecturally significant decisions. Specializes in distributed event-driven systems on Azure with Microsoft Aspire.
- **Build Implementer**: Execute tasks.md phase by phase—setup, tests, core logic, integration, polish—checking prerequisites and checklists before starting, and marking each task complete in tasks.md.
- **Build Verifier**: Use when: validating that code changes build, pass tests, pass lint/format checks, and meet quality gates. Runs verification commands and reports a pass/fail summary with failure details. Trigger phrases: verify, validate, run tests, run build, lint, quality check, QA, check my changes, does it compile, do the tests pass.
- **Business Engineer**: Use when orchestrating full product development analysis — combining product viability, human-centered design, and systems thinking into a unified workflow. Routes work to Product Coach (viability), Design Thinking Facilitator (desirability), and System Thinking Facilitator (feasibility/dynamics). Use when: evaluating a new feature end-to-end, running a full product discovery cycle, coordinating business analysis across viability-desirability-feasibility, synthesizing insights across product strategy and system dynamics, or when the user says &#x27;business engineer&#x27;.
- **Checklist Generator**: Generate domain-specific requirement-quality checklists (UX, security, accessibility, performance) that validate requirements are complete and clear, not that code is correct.
- **Clean Coder**: Use when: writing, refactoring, or reviewing application code and tests — especially .NET Web APIs, React frontends, Entity Framework Core data access, unit/integration tests, or Playwright end-to-end tests. Produces simple, maintainable, idiomatic code that follows SOLID and Clean Code principles. Trigger phrases: clean code, idiomatic, SOLID, refactor, .NET API, ASP.NET Core, React component, EF Core, DbContext, write tests, unit test, integration test, e2e test, Playwright, maintainable code.
- **Code Critic**: Use when: reviewing code changes produced by the Clean Coder (or any teammate) before they land. Performs a focused, read-only code review against Clean Code, SOLID, and the project&#x27;s skills (.NET Web API, React, EF Core, Testing). Returns actionable findings grouped by severity. Trigger phrases: code review, review my changes, review this PR, review the diff, critique, feedback on code, is this idiomatic, does this follow SOLID, review Clean Coder&#x27;s work.
- **Design Thinking Facilitator**: Use when facilitating human-centered design sessions, running empathy mapping, defining problem statements, ideating solutions, prototyping concepts, or testing assumptions with users. Applies design thinking methodology (empathize, define, ideate, prototype, test) to product development and business processes. Collaborates with system-designer and product-coach to translate user insights into system-level inputs.
- **DevOps Engineer**: Use when: authoring or reviewing Azure Infrastructure as Code (Bicep), GitHub Actions CI/CD pipelines, or Git commit messages and PR titles. Handles IaC creation, pipelines as code, and commit/PR conventions. Trigger phrases: bicep, iac, infra, azure resources, main.bicep, bicepparam, AVM, azd, github actions, workflow, CI, CD, pipeline, deploy, OIDC, reusable workflow, commit message, conventional commit, PR title.
- **Feature Brief Author**: Decompose a Feature Brief from a PRD for a single discrete feature with prioritized requirements, testable acceptance criteria, and scope boundaries, producing a feature-brief.md artifact.
- **Feature Capture**: Convert a natural language feature description or feature brief into a structured spec.md with user stories, acceptance scenarios, requirements, and edge cases, and check out the feature git branch.
- **GitHub Issues**: Convert tasks.md entries into GitHub Issues with proper labels, assignees, and milestones, using the GitHub API or gh CLI.
- **Infrastructure Designer**: Use when designing, provisioning, or managing Azure infrastructure. Covers Bicep authoring, resource topology, networking, identity, tagging, cost, and compliance. Expert in Azure Well-Architected Framework and Cloud Adoption Framework. Works with the architecture agent to translate design decisions into deployable infrastructure. Specializes in platform engineering for the claims processing system.
- **Product Coach**: Use when evaluating whether to build a feature, validating product-market fit, assessing system purpose, defining value propositions, creating product requirements documents, running Business Model Canvas exercises, or coaching on product lifecycle decisions. Helps answer: why does this system exist, how does it provide value, should we build this.
- **Researcher**: Use when: answering questions about the codebase, investigating how something works, gathering facts before coding, or looking up external documentation. Read-only. Trigger phrases: how does, where is, find all, investigate, research, look up, explain, locate, trace, what uses.
- **Spec Clarifier**: Identify underspecified areas in the active spec.md by asking up to 5 targeted clarification questions, then encode user answers directly back into spec.md.
- **Spec Closer**: Close and archive completed specs by gating on tasks, generating summary, updating CHANGELOG, and moving to archive.
- **Spec Orchestrator**: Orchestrate the spec-driven SDLC workflow by routing user intent to the correct workflow phase and coordinating all spec-pod agents without implementing anything directly.
- **Spec Validator**: Perform non-destructive cross-artifact consistency checks and ADR compliance analysis across spec.md, plan.md, and tasks.md, reporting violations with severity (CRITICAL blocks implementation).
- **Systems Thinking Facilitator**: Use when mapping system dynamics, identifying feedback loops, analyzing stocks and flows, finding leverage points, understanding upstream and downstream dependencies, synthesizing cross-platform knowledge, or facilitating systems thinking sessions. Applies systems thinking methodology to reveal constraints, emergent behavior, and intervention opportunities in complex sociotechnical systems.
- **Task Sequencer**: Break the technical plan into a dependency-ordered task list (tasks.md) with phase groupings and parallel-safe task markers, without modifying the plan or spec.
- **Technical Planner**: Produce the technical implementation plan (plan.md, data-model.md, contracts/) from a validated spec.md, including ADR compliance validation during planning.
- **UX Designer**: Create UI/UX designs, component styling, design tokens, and design systems with full creative autonomy over aesthetic decisions, ensuring WCAG AA accessibility compliance.

### Orchestration

Use the **Spec Orchestrator** agent to start the Neo SDLC orchestrator.
The orchestrator routes your request to the appropriate Neo agent above.

If you are the Copilot Coding Agent executing an issue autonomously, read `.github/neo-coding-agent-playbook.md` before proceeding.

<!-- NEO:END -->

