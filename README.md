# SickAI Agent Console

SickAI Agent Console is a deployable React/Vite product that demonstrates an AI-driven engineering workflow. It is designed as proof material for AI token or agent-access applications: the app includes an intake console, model/tool selection, multi-agent pipeline simulation, generated implementation plan, terminal-style execution logs, verification checklist, review scorecard, saved runs, JSON evidence export, and a ready-to-copy Xiaomi application answer.

## What It Demonstrates

- An AI intake form for entering a project request and selecting the agent tool stack.
- A generated plan that converts a vague request into implementation tasks.
- Long-chain reasoning stages: intake, repository scan, task decomposition, patch generation, test execution, and evidence packaging.
- Terminal-style logs and a deployment checklist for GitHub/Vercel proof screenshots.
- Operational metrics such as simulated token volume, time saved, verification gates, and deploy targets.
- A review scorecard that makes the product quality and submission readiness visible.
- Browser-only saved runs through localStorage, so reviewers can see repeatable workflow history without a backend.
- JSON evidence export for a portable artifact that includes prompt, tools, agents, logs, and submission text.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy To Vercel

1. Push this repository to GitHub.
2. Import it in Vercel as a Vite project.
3. Keep the default build command `npm run build` and output directory `dist`.

## Suggested Xiaomi Form Description

I built SickAI Agent Console, an AI-driven engineering workflow dashboard that demonstrates how I use agent tools such as Codex, Claude Code, Cursor, and OpenClaw to accelerate software delivery. The core pain point is that developers often lose time manually reading codebases, writing repetitive implementation plans, checking style consistency, and validating changes across tests. This project models a practical agent pipeline: a Planner agent converts a product request into scoped tasks, a Scanner agent analyzes repository risk and dependencies, a Builder agent prepares implementation patches, and a Verifier agent runs checks before producing a final human-readable report. The workflow includes long-chain reasoning, structured task decomposition, multi-agent collaboration, and closed-loop verification. In my normal workflow this style of agent orchestration helps me reduce manual code review and refactoring time, produce clearer implementation evidence, and prepare deployable demos faster.
