<div align="center">

# Hey, I'm Jaden 👋

**Cloud & DevOps engineer building production AWS systems, developer tools, and the occasional
project that refuses to stay a weekend project.**

I run [RaizHost](https://raizhost.com), a small web hosting and automation business, and I am open
to full-time cloud/DevOps roles and SRE or platform teams.

[![Portfolio](https://img.shields.io/badge/jadenrazo.dev-portfolio-2ea043?style=flat-square&logo=googlechrome&logoColor=white)](https://jadenrazo.dev/)
[![RaizHost](https://img.shields.io/badge/raizhost.com-founder-2ea043?style=flat-square&logo=rocket&logoColor=white)](https://raizhost.com)
[![Architecture](https://img.shields.io/badge/AWS-architecture-ff9900?style=flat-square&logo=amazonwebservices&logoColor=white)](https://github.com/JadenRazo/raizhost-architecture)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Jaden_Razo-0a66c2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/JadenRazo)
[![Email](https://img.shields.io/badge/email-contact%40jadenrazo.dev-555555?style=flat-square&logo=gmail&logoColor=white)](mailto:contact@jadenrazo.dev)

</div>

> **Current rabbit hole:** turning the Kubernetes/GitOps setup in
> [`tts-raizhost`](https://github.com/JadenRazo/tts-raizhost) into measured operating evidence—not
> merely an architecture diagram.

## 🚀 Featured projects

### [RaizHost architecture](https://github.com/JadenRazo/raizhost-architecture)

[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/raizhost-architecture/ci.yml?branch=main&style=flat-square&label=docs)](https://github.com/JadenRazo/raizhost-architecture/actions/workflows/ci.yml)
[![Live](https://img.shields.io/badge/raizhost.com-live-2ea043?style=flat-square&logo=amazonaws&logoColor=white)](https://raizhost.com)

Dated public record of a serverless-first AWS platform: what is live, what is changing, what it
costs, how it deploys, and what still needs verification.

**Stack:** AWS · Cloudflare · Terraform · Lambda

### [SRE reference app](https://github.com/JadenRazo/sre-reference-app)

Controlled ECS task-stop exercise with a measured 78-second recovery, SLO burn-rate alarms, a
postmortem, a runbook, Terraform, and explicit limitations—including why FIS was not used.

**Stack:** Terraform · ECS · CloudWatch · AWS CLI

### [llm-lint](https://github.com/JadenRazo/llm-lint)

[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/llm-lint/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/JadenRazo/llm-lint/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/JadenRazo/llm-lint?style=flat-square&color=2ea043)](https://github.com/JadenRazo/llm-lint/releases)
[![npm](https://img.shields.io/npm/v/%40jadenrazo%2Fllm-lint?style=flat-square&color=2ea043)](https://www.npmjs.com/package/@jadenrazo/llm-lint)

CI gate for LLM-generated repository artifacts. Emits SARIF and ships native Go binaries through
npm with zero postinstall scripts. Try it: `npx @jadenrazo/llm-lint scan`

**Stack:** Go · SARIF · GitHub Actions

### [CloudCostMCP](https://github.com/JadenRazo/CloudCostMCP)

[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/CloudCostMCP/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/JadenRazo/CloudCostMCP/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40jadenrazo%2Fcloudcost-mcp?style=flat-square&color=2ea043)](https://www.npmjs.com/package/@jadenrazo/cloudcost-mcp)

Prices Terraform plans across AWS, Azure, and GCP. Its
[pricing-drift incident review](https://github.com/JadenRazo/CloudCostMCP/blob/main/docs/incidents/2026-08-pricing-drift.md)
keeps the defect, detection gap, live verification, and regression controls together.

**Stack:** TypeScript · MCP · SQLite

### [llm-tracker](https://github.com/JadenRazo/llm-tracker)

[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/llm-tracker/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/JadenRazo/llm-tracker/actions/workflows/ci.yml)
[![Live](https://img.shields.io/badge/llm.raizhost.com-live-2ea043?style=flat-square&logo=amazonaws&logoColor=white)](https://llm.raizhost.com)

Tracks releases, model catalogs, CLI versions, and status across Claude, OpenAI, and Gemini. The
repository documents its OIDC deployment and cache/deployment failure modes; automated test evidence
is still being strengthened.

**Stack:** Next.js · Postgres · AWS Lambda

<details>
<summary><strong>Open the full project directory</strong> — cloud, tooling, web, game servers, and a few experiments</summary>
<br>

### Cloud & SRE

| Repository | Description |
| :-- | :-- |
| [sre-landing-zone](https://github.com/JadenRazo/sre-landing-zone) | Five-account AWS landing zone with Pilot Light DR, CloudFront/WAF/Cognito edge controls, and cross-account auto-stop. |
| [aws-supply-chain-security](https://github.com/JadenRazo/aws-supply-chain-security) | Container supply-chain stack with syft SBOMs, grype scans, and keyless cosign signing through GitHub OIDC. |
| [azure-hub-spoke-network](https://github.com/JadenRazo/azure-hub-spoke-network) | Archived Azure hub-and-spoke Terraform lab; retained as a code-study reference, not represented as a live environment. |
| [initializing-ad](https://github.com/JadenRazo/initializing-ad) | Active Directory homelab documenting AD DS, DNS, user provisioning, domain join, and file sharing; Group Policy remains future work. |

### Developer tooling

| Repository | Description |
| :-- | :-- |
| [job-scanner](https://github.com/JadenRazo/job-scanner) | ATS scanner and matcher with Claude-based scoring and cover-letter drafting. |

### Web & apps

| Repository | Description |
| :-- | :-- |
| [Project-Website](https://github.com/JadenRazo/Project-Website) | The Go-powered portfolio behind [jadenrazo.dev](https://jadenrazo.dev/), including a URL shortener, messaging, and project pages. |
| [TicketHacker](https://github.com/JadenRazo/TicketHacker) | Helpdesk platform unifying Discord, Telegram, email, and live chat into one ticketing system. |
| [tts-raizhost](https://github.com/JadenRazo/tts-raizhost) | Self-hosted PDF reader-aloud using Kokoro TTS, Next.js, k3s, and GPU/CPU backends with circuit-breaker fallback. |
| [EzWeb](https://github.com/JadenRazo/EzWeb) | Earlier Go-based Docker site manager for deploying and monitoring containerized websites. |

### Game servers & bots

| Repository | Description |
| :-- | :-- |
| [ServerPlugins](https://github.com/JadenRazo/ServerPlugins) | 24 interconnected Paper plugins covering claims, economy, events, administration, backpacks, arcade games, and parkour. |
| [SurvivalCore](https://github.com/JadenRazo/SurvivalCore) | Archived experimental Paper patch set—an unsupported code-study reference with no claimed verified build or benchmarks. |
| [Quiz-Bot](https://github.com/JadenRazo/Quiz-Bot) | Discord bot that turns LLM-generated questions into educational quiz games. |

</details>

## 🧭 How I work

- Prefer Terraform, OIDC, least-privilege workflow permissions, and repeatable CI over stored
  deployment credentials or console-only changes.
- Treat cost, rollback, security, and operational ownership as design inputs—not cleanup after
  launch.
- Define the reliability target, instrument it, inject a controlled failure, and keep the
  measurement and corrective action beside the code.
- Publish limitations and failed hypotheses so architecture intent is never mistaken for measured
  evidence.

## 🧰 Toolbox

### Core stack

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=go%2Cpy%2Cts%2Cbash%2Caws%2Cterraform%2Cdocker%2Ckubernetes%2Cgithubactions%2Clinux&amp;theme=dark&amp;perline=5">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=go%2Cpy%2Cts%2Cbash%2Caws%2Cterraform%2Cdocker%2Ckubernetes%2Cgithubactions%2Clinux&amp;theme=light&amp;perline=5">
  <img alt="Go, Python, TypeScript, Bash, AWS, Terraform, Docker, Kubernetes, GitHub Actions, and Linux" src="https://skillicons.dev/icons?i=go,py,ts,bash,aws,terraform,docker,kubernetes,githubactions,linux&amp;perline=5">
</picture>

<details>
<summary><strong>Open the extended toolbox</strong> — languages, data, web, platforms, and daily drivers</summary>
<br>

### More languages & shells

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=java%2Cjs%2Cpowershell%2Chtml%2Ccss%2Cswift%2Clua%2Cmd&amp;theme=dark&amp;perline=4">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=java%2Cjs%2Cpowershell%2Chtml%2Ccss%2Cswift%2Clua%2Cmd&amp;theme=light&amp;perline=4">
  <img alt="Java, JavaScript, PowerShell, HTML, CSS, Swift, Lua, and Markdown" src="https://skillicons.dev/icons?i=java,js,powershell,html,css,swift,lua,md&amp;perline=4">
</picture>

### Data & web

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=postgres%2Credis%2Csqlite%2Cdynamodb%2Creact%2Cnextjs%2Cnodejs%2Castro%2Cvue%2Cexpress%2Cvite%2Ctailwind&amp;theme=dark&amp;perline=6">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=postgres%2Credis%2Csqlite%2Cdynamodb%2Creact%2Cnextjs%2Cnodejs%2Castro%2Cvue%2Cexpress%2Cvite%2Ctailwind&amp;theme=light&amp;perline=6">
  <img alt="PostgreSQL, Redis, SQLite, DynamoDB, React, Next.js, Node.js, Astro, Vue, Express, Vite, and Tailwind CSS" src="https://skillicons.dev/icons?i=postgres,redis,sqlite,dynamodb,react,nextjs,nodejs,astro,vue,express,vite,tailwind&amp;perline=6">
</picture>

### Platforms & everyday tools

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=azure%2Cgcp%2Ccloudflare%2Cgit%2Cgithub%2Cnpm%2Cvscode&amp;theme=dark&amp;perline=7">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=azure%2Cgcp%2Ccloudflare%2Cgit%2Cgithub%2Cnpm%2Cvscode&amp;theme=light&amp;perline=7">
  <img alt="Azure, Google Cloud, Cloudflare, Git, GitHub, npm, and VS Code" src="https://skillicons.dev/icons?i=azure,gcp,cloudflare,git,github,npm,vscode&amp;perline=7">
</picture>

<img alt="Claude Code, OpenAI Codex, and Gemini" height="48" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/ai-tools.svg">

</details>

## 📊 GitHub snapshot — 30 August 2026

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/stats-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/stats-light.svg">
    <img alt="GitHub stats for JadenRazo" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/stats-light.svg" width="420">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/top-langs-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/top-langs-light.svg">
    <img alt="Most used languages across public repositories" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/top-langs-light.svg" width="420">
  </picture>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/streak-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/streak-light.svg">
    <img alt="GitHub contribution streak" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/streak-light.svg" width="420">
  </picture>
</p>

*Kept local so the profile does not depend on a public stats-card host or hand a personal token to
third-party runtime code.*

## 🐍 Contributions

A snake eats my contribution graph and counts the real contributions it consumes. Its route changes
throughout the day, because a contribution graph is more fun when something is chasing it.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/output/github-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/output/github-snake.svg">
  <img alt="A snake eating Jaden Razo's GitHub contribution graph, with a running count of contributions consumed over the past year" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/output/github-snake.svg" width="100%">
</picture>

## 🟢 Things I keep running

<p align="center">
  <a href="https://raizhost.com"><img alt="raizhost.com availability" src="https://img.shields.io/website?url=https%3A%2F%2Fraizhost.com&label=raizhost.com&up_message=live&down_message=down&style=flat-square"></a>
  <a href="https://app.raizhost.com"><img alt="app.raizhost.com availability" src="https://img.shields.io/website?url=https%3A%2F%2Fapp.raizhost.com&label=client%20editor&up_message=live&down_message=down&style=flat-square"></a>
  <a href="https://jadenrazo.dev"><img alt="jadenrazo.dev availability" src="https://img.shields.io/website?url=https%3A%2F%2Fjadenrazo.dev&label=portfolio&up_message=live&down_message=down&style=flat-square"></a>
  <a href="https://llm.raizhost.com"><img alt="llm.raizhost.com availability" src="https://img.shields.io/website?url=https%3A%2F%2Fllm.raizhost.com&label=LLM%20tracker&up_message=live&down_message=down&style=flat-square"></a>
  <a href="https://showersautodetail.com"><img alt="showersautodetail.com availability" src="https://img.shields.io/website?url=https%3A%2F%2Fshowersautodetail.com&label=Showers%20Auto%20Detail&up_message=live&down_message=down&style=flat-square"></a>
</p>

Fleet history and incident context live at [status.raizhost.com](https://status.raizhost.com).
