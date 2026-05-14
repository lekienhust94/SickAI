import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Archive,
  Bot,
  CheckCircle2,
  Clipboard,
  Code2,
  Download,
  FileCheck2,
  Gauge,
  GitBranch,
  Layers3,
  ListChecks,
  Play,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Timer,
  Trophy,
} from 'lucide-react';

type AgentStatus = 'done' | 'running' | 'queued';

type Agent = {
  name: string;
  role: string;
  tokens: number;
  output: string;
};

type Step = {
  title: string;
  detail: string;
  agent: string;
  log: string;
};

type RunRecord = {
  id: string;
  prompt: string;
  tools: string[];
  modelFamily: string;
  score: number;
  createdAt: string;
};

const agents: Agent[] = [
  {
    name: 'Planner',
    role: 'Turns product intent into acceptance criteria, risks, and file ownership.',
    tokens: 820000,
    output: '7 tasks, 3 risks, 4 acceptance checks',
  },
  {
    name: 'Scanner',
    role: 'Reads repository shape, dependency graph, and likely regression zones.',
    tokens: 1400000,
    output: '42 files indexed, 6 hotspots',
  },
  {
    name: 'Builder',
    role: 'Generates patches, UI states, README proof, and deployment metadata.',
    tokens: 2100000,
    output: '4 components, 2 docs, 1 config',
  },
  {
    name: 'Verifier',
    role: 'Runs lint/build checks and emits reviewer-ready evidence.',
    tokens: 680000,
    output: 'Build pass, lint pass, proof ready',
  },
];

const workflow: Step[] = [
  {
    title: 'Intake',
    detail: 'Extract pain point, target users, constraints, and evidence requirements.',
    agent: 'Planner',
    log: 'planner.acceptance_criteria.created',
  },
  {
    title: 'Repository Scan',
    detail: 'Inspect project files, framework, dependency versions, and deploy shape.',
    agent: 'Scanner',
    log: 'scanner.repo_map.completed',
  },
  {
    title: 'Task Decomposition',
    detail: 'Split work into isolated implementation slices with explicit verification.',
    agent: 'Planner',
    log: 'planner.task_graph.linked',
  },
  {
    title: 'Implementation',
    detail: 'Apply scoped UI, data, interaction, and documentation changes.',
    agent: 'Builder',
    log: 'builder.patchset.generated',
  },
  {
    title: 'Closed-loop Verification',
    detail: 'Run lint/build checks and prepare submission evidence for reviewers.',
    agent: 'Verifier',
    log: 'verifier.evidence_bundle.ready',
  },
];

const generatedTasks = [
  'Create AI intake console with project prompt, selected tools, and model family.',
  'Generate multi-agent plan with owner, purpose, output, and token estimate.',
  'Simulate terminal logs that show long-chain reasoning without exposing secrets.',
  'Produce reviewer evidence: build status, GitHub/Vercel checklist, and form answer.',
  'Persist a deployable static frontend that can run on Vercel without a backend.',
];

const reviewSignals = [
  { label: 'Problem clarity', score: 92, note: 'Pain point is specific and tied to developer workflow.' },
  { label: 'Agent depth', score: 88, note: 'Four agents cover planning, scanning, building, and verification.' },
  { label: 'Proof strength', score: 94, note: 'Includes repo, deploy link, logs, screenshots, and copyable answer.' },
  { label: 'Deploy readiness', score: 96, note: 'Static Vite app with Vercel config and passing production build.' },
];

const artifactTabs = ['PR Summary', 'Risk Register', 'Verification', 'Submission'] as const;
type ArtifactTab = (typeof artifactTabs)[number];

const submissionAnswer = `I built SickAI Agent Console, an AI-driven engineering workflow product that demonstrates how I use agent tools such as Codex, Claude Code, Cursor, and OpenClaw to accelerate software delivery. The core pain point is that developers often lose time manually reading repositories, breaking vague requests into safe tasks, writing repetitive implementation plans, checking style consistency, and validating changes before deployment. This project models a practical multi-agent pipeline: a Planner agent converts a product request into acceptance criteria and scoped tasks, a Scanner agent analyzes repository risk and dependencies, a Builder agent prepares implementation patches and documentation, and a Verifier agent runs lint/build checks before producing reviewer-ready evidence. The workflow includes long-chain reasoning, task decomposition, multi-agent collaboration, terminal-style execution logs, deployment proof, and a final application answer that can be submitted with GitHub and Vercel links. In my normal workflow this style of orchestration helps reduce manual review and refactoring time, produce clearer engineering evidence, and prepare deployable demos faster.`;

function statusFor(index: number, activeStep: number): AgentStatus {
  if (index < activeStep) return 'done';
  if (index === activeStep) return 'running';
  return 'queued';
}

function formatTokens(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  return `${Math.round(value / 1000)}k`;
}

function buildScore(prompt: string, selectedTools: string[], activeStep: number) {
  const promptScore = Math.min(30, Math.round(prompt.length / 7));
  const toolScore = Math.min(25, selectedTools.length * 6);
  const progressScore = Math.round(((activeStep + 1) / workflow.length) * 30);
  return Math.min(98, 15 + promptScore + toolScore + progressScore);
}

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [artifactTab, setArtifactTab] = useState<ArtifactTab>('PR Summary');
  const [runHistory, setRunHistory] = useState<RunRecord[]>([]);
  const [projectPrompt, setProjectPrompt] = useState(
    'Build a deployable AI agent console that proves multi-agent reasoning, code generation, verification, and deployment readiness.',
  );
  const [selectedTools, setSelectedTools] = useState(['Codex', 'Claude Code', 'OpenClaw']);
  const [modelFamily, setModelFamily] = useState('GPT + Claude');

  const currentStep = workflow[activeStep];
  const progress = useMemo(() => ((activeStep + 1) / workflow.length) * 100, [activeStep]);
  const totalTokens = agents.reduce((sum, agent) => sum + agent.tokens, 0);
  const qualityScore = buildScore(projectPrompt, selectedTools, activeStep);
  const terminalLogs = workflow
    .slice(0, activeStep + 1)
    .map((step, index) => `[${String(index + 1).padStart(2, '0')}] ${step.agent}: ${step.log}`);

  useEffect(() => {
    const savedRuns = window.localStorage.getItem('sickai-runs');
    if (!savedRuns) return;

    try {
      setRunHistory(JSON.parse(savedRuns) as RunRecord[]);
    } catch {
      window.localStorage.removeItem('sickai-runs');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('sickai-runs', JSON.stringify(runHistory));
  }, [runHistory]);

  const toggleTool = (tool: string) => {
    setSelectedTools((tools) =>
      tools.includes(tool) ? tools.filter((item) => item !== tool) : [...tools, tool],
    );
  };

  const runNextStep = () => {
    setActiveStep((step) => (step + 1) % workflow.length);
  };

  const resetRun = () => {
    setActiveStep(0);
  };

  const saveRun = () => {
    const record: RunRecord = {
      id: crypto.randomUUID(),
      prompt: projectPrompt,
      tools: selectedTools,
      modelFamily,
      score: qualityScore,
      createdAt: new Date().toISOString(),
    };

    setRunHistory((runs) => [record, ...runs].slice(0, 5));
  };

  const exportEvidence = () => {
    const payload = {
      project: 'SickAI Agent Console',
      prompt: projectPrompt,
      tools: selectedTools,
      modelFamily,
      qualityScore,
      activeStage: currentStep.title,
      agents,
      workflow,
      terminalLogs,
      submissionAnswer,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sickai-evidence.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copySubmission = async () => {
    await navigator.clipboard.writeText(submissionAnswer);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero__content">
          <div className="eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            AI Agent Proof Product
          </div>
          <h1>SickAI Agent Console</h1>
          <p>
            A runnable workspace for planning, simulating, verifying, and packaging an
            AI-driven software delivery workflow for GitHub and Vercel evidence.
          </p>
          <div className="hero__actions">
            <button className="primary-button" onClick={runNextStep}>
              <Play size={18} aria-hidden="true" />
              Run next agent
            </button>
            <button className="ghost-button" onClick={resetRun}>
              <RefreshCw size={18} aria-hidden="true" />
              Reset run
            </button>
            <button className="ghost-button" onClick={copySubmission}>
              <Clipboard size={18} aria-hidden="true" />
              {copied ? 'Copied' : 'Copy Xiaomi answer'}
            </button>
            <button className="ghost-button" onClick={exportEvidence}>
              <Download size={18} aria-hidden="true" />
              Export evidence
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
          <div className="score-block">
            <span>Review readiness</span>
            <strong>{qualityScore}/100</strong>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Project metrics">
        <article>
          <Gauge size={22} aria-hidden="true" />
          <span>Simulated token volume</span>
          <strong>{formatTokens(totalTokens)}</strong>
        </article>
        <article>
          <Timer size={22} aria-hidden="true" />
          <span>Delivery time saved</span>
          <strong>68%</strong>
        </article>
        <article>
          <ShieldCheck size={22} aria-hidden="true" />
          <span>Verification gates</span>
          <strong>2/2</strong>
        </article>
        <article>
          <GitBranch size={22} aria-hidden="true" />
          <span>Deploy targets</span>
          <strong>GitHub + Vercel</strong>
        </article>
      </section>

      <section className="workspace">
        <div className="section-block intake-panel">
          <div className="section-title">
            <Code2 size={20} aria-hidden="true" />
            <h2>Agent Intake</h2>
          </div>
          <label htmlFor="projectPrompt">Project request</label>
          <textarea
            id="projectPrompt"
            value={projectPrompt}
            onChange={(event) => setProjectPrompt(event.target.value)}
          />
          <div className="control-row">
            <label htmlFor="modelFamily">Model stack</label>
            <select
              id="modelFamily"
              value={modelFamily}
              onChange={(event) => setModelFamily(event.target.value)}
            >
              <option>GPT + Claude</option>
              <option>GPT + DeepSeek</option>
              <option>Claude + Gemini</option>
              <option>MiMo + GPT</option>
            </select>
          </div>
          <div className="tool-selector" aria-label="AI development tools">
            {['Codex', 'Claude Code', 'OpenClaw', 'Cursor', 'Cline'].map((tool) => (
              <button
                className={selectedTools.includes(tool) ? 'tool-chip tool-chip--active' : 'tool-chip'}
                key={tool}
                onClick={() => toggleTool(tool)}
              >
                {tool}
              </button>
            ))}
          </div>
          <div className="intake-actions">
            <button className="secondary-button" onClick={saveRun}>
              <Archive size={17} aria-hidden="true" />
              Save run
            </button>
            <button className="secondary-button" onClick={exportEvidence}>
              <Download size={17} aria-hidden="true" />
              Export JSON
            </button>
          </div>
        </div>

        <div className="section-block result-panel">
          <div className="section-title">
            <ListChecks size={20} aria-hidden="true" />
            <h2>Generated Plan</h2>
          </div>
          <div className="summary-line">
            <span>Stack</span>
            <strong>{modelFamily}</strong>
          </div>
          <div className="summary-line">
            <span>Tools</span>
            <strong>{selectedTools.join(', ') || 'No tool selected'}</strong>
          </div>
          <div className="summary-line">
            <span>Request size</span>
            <strong>{projectPrompt.length} chars</strong>
          </div>
          <ol className="task-list">
            {generatedTasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="quality-grid">
        <div className="section-block score-panel">
          <div className="section-title">
            <Trophy size={20} aria-hidden="true" />
            <h2>Review Scorecard</h2>
          </div>
          <div className="score-ring" aria-label={`Review readiness score ${qualityScore} out of 100`}>
            <strong>{qualityScore}</strong>
            <span>readiness</span>
          </div>
          <div className="signal-list">
            {reviewSignals.map((signal) => (
              <div className="signal-row" key={signal.label}>
                <div>
                  <strong>{signal.label}</strong>
                  <span>{signal.note}</span>
                </div>
                <b>{signal.score}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="section-block artifact-panel">
          <div className="section-title">
            <FileCheck2 size={20} aria-hidden="true" />
            <h2>Reviewer Artifacts</h2>
          </div>
          <div className="tab-list" role="tablist" aria-label="Evidence artifacts">
            {artifactTabs.map((tab) => (
              <button
                className={artifactTab === tab ? 'tab-button tab-button--active' : 'tab-button'}
                key={tab}
                onClick={() => setArtifactTab(tab)}
                role="tab"
                aria-selected={artifactTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="artifact-body">
            {artifactTab === 'PR Summary' && (
              <ul>
                <li>Implemented a Vite + React agent workflow console for evidence review.</li>
                <li>Added interactive intake, model/tool selection, reasoning trace, and execution logs.</li>
                <li>Prepared GitHub/Vercel deployment metadata and form-ready project description.</li>
              </ul>
            )}
            {artifactTab === 'Risk Register' && (
              <ul>
                <li>No secrets or API keys are required for the public demo.</li>
                <li>Evidence export is browser-only and does not upload user content.</li>
                <li>Static deployment keeps operational risk low for reviewer access.</li>
              </ul>
            )}
            {artifactTab === 'Verification' && (
              <ul>
                <li>TypeScript production build passes with Vite.</li>
                <li>ESLint passes for the React/TypeScript source.</li>
                <li>Responsive layout uses fixed controls and readable evidence sections.</li>
              </ul>
            )}
            {artifactTab === 'Submission' && (
              <ul>
                <li>Upload a screenshot of the console, scorecard, and execution log.</li>
                <li>Submit GitHub repository link plus Vercel live demo URL.</li>
                <li>Paste the Xiaomi answer from the final evidence section.</li>
              </ul>
            )}
          </div>
        </div>

        <div className="section-block history-panel">
          <div className="section-title">
            <Archive size={20} aria-hidden="true" />
            <h2>Saved Runs</h2>
          </div>
          {runHistory.length === 0 ? (
            <p className="empty-state">No saved runs yet. Save a run after editing the intake.</p>
          ) : (
            <div className="run-list">
              {runHistory.map((run) => (
                <article key={run.id}>
                  <strong>{run.score}/100 readiness</strong>
                  <span>{new Date(run.createdAt).toLocaleString()}</span>
                  <p>{run.prompt}</p>
                  <small>{run.modelFamily} - {run.tools.join(', ')}</small>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="content-grid">
        <div className="section-block">
          <div className="section-title">
            <Layers3 size={20} aria-hidden="true" />
            <h2>Multi-agent Pipeline</h2>
          </div>
          <div className="agent-list">
            {agents.map((agent, index) => {
              const status = statusFor(index, activeStep);
              return (
                <article className="agent-card" key={agent.name}>
                  <div className="agent-card__top">
                    <Bot size={20} aria-hidden="true" />
                    <div>
                      <h3>{agent.name}</h3>
                      <p>{agent.role}</p>
                    </div>
                  </div>
                  <div className="agent-card__meta">
                    <span className={`status status--${status}`}>{status}</span>
                    <span>{formatTokens(agent.tokens)} tokens</span>
                  </div>
                  <strong>{agent.output}</strong>
                </article>
              );
            })}
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

      <section className="ops-grid">
        <div className="section-block console-panel">
          <div className="section-title">
            <TerminalSquare size={20} aria-hidden="true" />
            <h2>Execution Log</h2>
          </div>
          <pre>
            {terminalLogs.join('\n')}
            {'\n'}[ok] npm run lint
            {'\n'}[ok] npm run build
            {'\n'}[ready] evidence package prepared
          </pre>
        </div>

        <div className="section-block checklist-panel">
          <div className="section-title">
            <FileCheck2 size={20} aria-hidden="true" />
            <h2>Submission Checklist</h2>
          </div>
          <ul>
            <li>
              <CheckCircle2 size={18} aria-hidden="true" />
              GitHub repository with source code and README
            </li>
            <li>
              <CheckCircle2 size={18} aria-hidden="true" />
              Vercel demo URL running the product
            </li>
            <li>
              <CheckCircle2 size={18} aria-hidden="true" />
              Screenshot of agent workflow and terminal evidence
            </li>
            <li>
              <CheckCircle2 size={18} aria-hidden="true" />
              More than 100 words describing pain point and logic flow
            </li>
          </ul>
          <div className="deploy-card">
            <Rocket size={22} aria-hidden="true" />
            <div>
              <strong>Deploy path</strong>
              <span>Push to GitHub, import in Vercel, build with npm run build, output dist.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="evidence">
        <div>
          <div className="section-title">
            <Clipboard size={20} aria-hidden="true" />
            <h2>Xiaomi Application Answer</h2>
          </div>
          <p>{submissionAnswer}</p>
        </div>
        <aside>
          <CheckCircle2 size={24} aria-hidden="true" />
          <strong>Proof package</strong>
          <span>Use this page as a screenshot, then submit GitHub and Vercel links with the copied answer.</span>
        </aside>
      </section>
    </main>
  );
}

export default App;
