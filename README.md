# SickAI Agent Console

SickAI Agent Console is a deployable React/Vite project that demonstrates an AI-driven engineering workflow. It is designed as proof material for AI token or agent-access applications: the first screen shows the real project outcome, the core pain point, the multi-agent logic flow, token metrics, verification loop, and a ready-to-copy project description.

## What It Demonstrates

- A multi-agent workflow for turning product requests into implementation tasks.
- Long-chain reasoning stages: intake, repository scan, planning, patch generation, test execution, and summary.
- Operational metrics such as daily token volume, time saved, approval rate, and verification status.
- A visible evidence panel that can be used for screenshots when submitting proof of AI usage.

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
