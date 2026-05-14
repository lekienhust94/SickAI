import { useMemo, useState } from 'react';
import {
  Activity,
  Bot,
  CheckCircle2,
  Clipboard,
  Code2,
  Gauge,
  GitBranch,
  Layers3,
  Play,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Timer,
} from 'lucide-react';

type AgentStatus = 'done' | 'running' | 'queued';

type Agent = {
  name: string;
  role: string;
  status: AgentStatus;
  tokens: string;
  output: string;
};

type Step = {
  title: string;
  detail: string;
  agent: string;
};

const agents: Agent[] = [
  {
    name: 'Planner',
    role: 'Breaks product goals into implementation tasks',
    status: 'done',
    tokens: '820k',
    output: '7 scoped tasks, 3 risk notes',
  },
  {
    name: 'Scanner',
    role: 'Reads repository structure and detects dependencies',
    status: 'done',
    tokens: '1.4M',
    output: '42 files indexed, 6 hotspots',
  },
  {
    name: 'Builder',
    role: 'Generates patches and UI implementation',
    status: 'running',
    tokens: '2.1M',
    output: '4 components updated',
  },
  {
    name: 'Verifier',
    role: 'Runs tests, builds, and produces evidence logs',
    status: 'queued',
    tokens: '680k',
    output: 'Build + lint waiting',
  },
];

const workflow: Step[] = [
  {
    title: 'Intake',
    detail: 'Convert a rough product request into acceptance criteria and risk boundaries.',
    agent: 'Planner',
  },
  {
    title: 'Repository Scan',
    detail: 'Map code ownership, dependencies, likely breakpoints, and missing tests.',
    agent: 'Scanner',
  },
  {
    title: 'Implementation',
    detail: 'Generate focused code changes and keep the UI aligned with the project domain.',
    agent: 'Builder',
  },
  {
    title: 'Closed-loop Verification',
    detail: 'Run build checks, summarize failures, and prepare proof for review.',
    agent: 'Verifier',
  },
];

const description = `I built SickAI Agent Console, an AI-driven engineering workflow dashboard that demonstrates how I use agent tools such as Codex, Claude Code, Cursor, and OpenClaw to accelerate software delivery. The core pain point is that developers often lose time manually reading codebases, writing repetitive implementation plans, checking style consistency, and validating changes across tests. This project models a practical agent pipeline: a Planner agent converts a product request into scoped tasks, a Scanner agent analyzes repository risk and dependencies, a Builder agent prepares implementation patches, and a Verifier agent runs checks before producing a final human-readable report. The workflow includes long-chain reasoning, structured task decomposition, multi-agent collaboration, and closed-loop verification. In my normal workflow this style of agent orchestration helps me reduce manual code review and refactoring time, produce clearer implementation evidence, and prepare deployable demos faster.`;

function statusLabel(status: AgentStatus) {
  if (status === 'done') return 'Done';
  if (status === 'running') return 'Running';
  return 'Queued';
}

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentStep = workflow[activeStep];
  const progress = useMemo(() => ((activeStep + 1) / workflow.length) * 100, [activeStep]);

  const runNextStep = () => {
    setActiveStep((step) => (step + 1) % workflow.length);
  };

  const copyDescription = async () => {
    await navigator.clipboard.writeText(description);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero__content">
          <div className="eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            AI Agent Proof Project
          </div>
          <h1>SickAI Agent Console</h1>
          <p>
            A deployable operations dashboard for demonstrating long-chain AI reasoning,
            multi-agent collaboration, token usage, and closed-loop verification.
          </p>
          <div className="hero__actions">
            <button className="primary-button" onClick={runNextStep}>
              <Play size={18} aria-hidden="true" />
              Run agent step
            </button>
            <button className="ghost-button" onClick={copyDescription}>
              <Clipboard size={18} aria-hidden="true" />
              {copied ? 'Copied' : 'Copy form answer'}
            </button>
          </div>
        </div>
        <div className="hero__panel" aria-label="Current workflow step">
          <div className="panel-header">
            <span>{currentStep.agent}</span>
            <strong>{Math.round(progress)}%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <h2>{currentStep.title}</h2>
          <p>{currentStep.detail}</p>
          <div className="terminal">
            <TerminalSquare size={18} aria-hidden="true" />
            <span>agent run --stage {currentStep.title.toLowerCase().replaceAll(' ', '-')}</span>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Project metrics">
        <article>
          <Gauge size={22} aria-hidden="true" />
          <span>Daily token volume</span>
          <strong>5.0M</strong>
        </article>
        <article>
          <Timer size={22} aria-hidden="true" />
          <span>Delivery time saved</span>
          <strong>68%</strong>
        </article>
        <article>
          <ShieldCheck size={22} aria-hidden="true" />
          <span>Verified runs</span>
          <strong>124</strong>
        </article>
        <article>
          <GitBranch size={22} aria-hidden="true" />
          <span>Generated PR drafts</span>
          <strong>31</strong>
        </article>
      </section>

      <section className="content-grid">
        <div className="section-block">
          <div className="section-title">
            <Layers3 size={20} aria-hidden="true" />
            <h2>Multi-agent Pipeline</h2>
          </div>
          <div className="agent-list">
            {agents.map((agent) => (
              <article className="agent-card" key={agent.name}>
                <div className="agent-card__top">
                  <Bot size={20} aria-hidden="true" />
                  <div>
                    <h3>{agent.name}</h3>
                    <p>{agent.role}</p>
                  </div>
                </div>
                <div className="agent-card__meta">
                  <span className={`status status--${agent.status}`}>{statusLabel(agent.status)}</span>
                  <span>{agent.tokens} tokens</span>
                </div>
                <strong>{agent.output}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="section-block">
          <div className="section-title">
            <Activity size={20} aria-hidden="true" />
            <h2>Reasoning Trace</h2>
          </div>
          <div className="timeline">
            {workflow.map((step, index) => (
              <button
                className={index === activeStep ? 'timeline-item timeline-item--active' : 'timeline-item'}
                key={step.title}
                onClick={() => setActiveStep(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="evidence">
        <div>
          <div className="section-title">
            <Code2 size={20} aria-hidden="true" />
            <h2>Xiaomi Application Answer</h2>
          </div>
          <p>{description}</p>
        </div>
        <aside>
          <CheckCircle2 size={24} aria-hidden="true" />
          <strong>Proof checklist</strong>
          <span>Deploy URL, GitHub repository, terminal build log, and screenshot of this dashboard.</span>
        </aside>
      </section>
    </main>
  );
}

export default App;
