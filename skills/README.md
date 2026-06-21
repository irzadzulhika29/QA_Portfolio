# Testing Skills Index

Imported from [wshobson/agents](https://github.com/wshobson/agents) — battle-tested patterns from production projects.

## Available Skills

| Skill | Size | Stack | Use when |
|---|---|---|---|
| [`e2e-testing-patterns`](./e2e-testing-patterns/SKILL.md) | 4 KB + 10 KB refs | Playwright + Cypress | Writing E2E tests, debugging flaky tests, setting up CI |
| [`javascript-testing-patterns`](./javascript-testing-patterns/SKILL.md) | 15 KB | JavaScript / TypeScript | Unit + integration tests for JS/TS projects (Next.js, React, Node) |

## How to use

Each skill is a `SKILL.md` file with frontmatter (name, description, when to use) + a body of
patterns. `references/` subfolder contains deep-dive examples.

**To load a skill in a session**, point your AI agent at the path. For Hermes Agent:

```bash
/skill /home/ubuntu/testing-hub/skills/e2e-testing-patterns
/skill /home/ubuntu/testing-hub/skills/javascript-testing-patterns
```

**To install in any AI agent supporting skills.sh:**

```bash
# Original registry (e2e only)
npx skills add https://github.com/wshobson/agents --skill e2e-testing-patterns

# Or just point to the local folder
```

## When to import more skills

Drop a new `SKILL.md` in this folder when:
- You need a pattern not covered by existing skills
- You extract a pattern that worked well across multiple projects
- A new framework (e.g. Vitest best practices, Playwright Component Testing) is adopted

## Sources

- **e2e-testing-patterns**: `wshobson/agents/plugins/developer-essentials/skills/e2e-testing-patterns/`
- **javascript-testing-patterns**: `wshobson/agents/plugins/javascript-typescript/skills/javascript-testing-patterns/`
