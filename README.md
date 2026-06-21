# 🧪 Testing Hub

Centralized testing knowledge base + per-project test artifacts.

## Structure

```
testing-hub/
├── skills/                 # Testing patterns & methodology (knowledge)
│   ├── e2e-testing-patterns/      # Playwright & Cypress patterns (from wshobson/agents)
│   └── javascript-testing-patterns/  # JS/TS unit & integration testing
└── projects/               # Test artifacts per project
    └── stuudi/             # Stuudi (Arteri) — Next.js adaptive learning platform
        ├── e2e/            # Playwright E2E tests
        ├── unit/           # Vitest unit tests
        ├── playwright.config.ts
        ├── vitest.config.ts
        └── .github/workflows/e2e.yml
```

## Why this exists

- **Knowledge** (skills/) stays framework-agnostic and reusable across projects
- **Artifacts** (projects/) get copy-pasted from the actual project repos as snapshots
- **Onboarding** new contributors — one place to read testing standards + see real examples

## Adding a new project

```bash
mkdir -p projects/<name>/{e2e,unit}
# Copy e2e specs, unit tests, and config from the source repo
```

## Adding a new skill

```bash
mkdir -p skills/<skill-name>/references
# Drop SKILL.md (required) and references/*.md (optional)
```

## License

Project-specific test code follows each project's license. Skill knowledge is sourced from
[wshobson/agents](https://github.com/wshobson/agents) (MIT).
