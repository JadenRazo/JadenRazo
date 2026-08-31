<div align="center">

# Jaden Razo

**Cloud & DevOps engineer building production AWS systems, developer tools, and the occasional
project that refuses to stay a weekend project. Founder of [RaizHost](https://raizhost.com), a web
hosting and automation business. Open to full-time cloud/DevOps roles and SRE or platform teams.**

[![Website](https://img.shields.io/badge/jadenrazo.dev-portfolio-2ea043?style=flat-square&logo=googlechrome&logoColor=white)](https://jadenrazo.dev/)
[![RaizHost](https://img.shields.io/badge/raizhost.com-founder-2ea043?style=flat-square&logo=rocket&logoColor=white)](https://raizhost.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Jaden_Razo-0a66c2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/JadenRazo)
[![Email](https://img.shields.io/badge/email-contact%40jadenrazo.dev-555555?style=flat-square&logo=gmail&logoColor=white)](mailto:contact@jadenrazo.dev)

</div>

**Current focus:** turning the Kubernetes/GitOps setup in
[`tts-raizhost`](https://github.com/JadenRazo/tts-raizhost) into measured operating evidence, not
merely an architecture diagram.

## What I'm building

| Project | What it does | Stack |
| :-- | :-- | :-- |
| **[llm-lint](https://github.com/JadenRazo/llm-lint)**<br>[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/llm-lint/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/JadenRazo/llm-lint/actions/workflows/ci.yml) [![Release](https://img.shields.io/github/v/release/JadenRazo/llm-lint?style=flat-square&color=2ea043)](https://github.com/JadenRazo/llm-lint/releases) [![npm](https://img.shields.io/npm/v/%40jadenrazo%2Fllm-lint?style=flat-square&color=2ea043)](https://www.npmjs.com/package/@jadenrazo/llm-lint) | CI gate for LLM-generated repository artifacts. Emits SARIF and ships native Go binaries through npm with zero postinstall scripts. Try it: `npx @jadenrazo/llm-lint scan` | Go, SARIF, GitHub Actions |
| **[CloudCostMCP](https://github.com/JadenRazo/CloudCostMCP)**<br>[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/CloudCostMCP/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/JadenRazo/CloudCostMCP/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/%40jadenrazo%2Fcloudcost-mcp?style=flat-square&color=2ea043)](https://www.npmjs.com/package/@jadenrazo/cloudcost-mcp) | Prices Terraform plans across AWS, Azure, and GCP. Its [pricing-drift incident review](https://github.com/JadenRazo/CloudCostMCP/blob/main/docs/incidents/2026-08-pricing-drift.md) keeps the defect, detection gap, live verification, and regression controls together. | TypeScript, MCP, SQLite |
| **[sre-reference-app](https://github.com/JadenRazo/sre-reference-app)** | Controlled ECS task-stop exercise with a measured 78-second recovery, SLO burn-rate alarms, a postmortem, a runbook, Terraform, and explicit limitations, including why FIS was not used. | Terraform, ECS, CloudWatch, AWS CLI |
| **[raizhost-architecture](https://github.com/JadenRazo/raizhost-architecture)**<br>[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/raizhost-architecture/ci.yml?branch=main&style=flat-square&label=docs)](https://github.com/JadenRazo/raizhost-architecture/actions/workflows/ci.yml) [![Live](https://img.shields.io/badge/raizhost.com-live-2ea043?style=flat-square&logo=amazonaws&logoColor=white)](https://raizhost.com) | Dated public record of a serverless-first AWS platform: what is live, what is changing, what it costs, how it deploys, and what still needs verification. | AWS, Cloudflare, Terraform, Lambda |
| **[llm-tracker](https://github.com/JadenRazo/llm-tracker)**<br>[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/llm-tracker/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/JadenRazo/llm-tracker/actions/workflows/ci.yml) [![Live](https://img.shields.io/badge/llm.raizhost.com-live-2ea043?style=flat-square&logo=amazonaws&logoColor=white)](https://llm.raizhost.com) | Tracks releases, model catalogs, CLI versions, and status across Claude, OpenAI, and Gemini. The repository documents its OIDC deployment and cache/deployment failure modes; automated test evidence is still being strengthened. | Next.js, Postgres, AWS Lambda |

<details>
<summary><strong>Full project directory</strong>: cloud &amp; SRE, tooling, web, game servers</summary>
<br>

<strong>Cloud & SRE</strong>

| Repository | Description |
| :-- | :-- |
| [sre-landing-zone](https://github.com/JadenRazo/sre-landing-zone) | AWS landing-zone lab modeling five accounts, Pilot Light DR, CloudFront/WAF/Cognito edge controls, and cross-account auto-stop. |
| [aws-supply-chain-security](https://github.com/JadenRazo/aws-supply-chain-security) | Container supply-chain stack with syft SBOMs, grype scans, and keyless cosign signing through GitHub OIDC. |
| [azure-hub-spoke-network](https://github.com/JadenRazo/azure-hub-spoke-network) | Archived Azure hub-and-spoke Terraform lab retained as a code-study reference, not represented as a live environment. |
| [initializing-ad](https://github.com/JadenRazo/initializing-ad) | Active Directory homelab documenting AD DS, DNS, user provisioning, domain join, and file sharing; Group Policy remains future work. |

<strong>Developer tooling</strong>

| Repository | Description |
| :-- | :-- |
| [job-scanner](https://github.com/JadenRazo/job-scanner) | ATS scanner and matcher with Claude-based scoring and cover-letter drafting. |

<strong>Web & apps</strong>

| Repository | Description |
| :-- | :-- |
| [Project-Website](https://github.com/JadenRazo/Project-Website) | The Go-powered portfolio behind [jadenrazo.dev](https://jadenrazo.dev/), including a URL shortener, messaging, and project pages. |
| [TicketHacker](https://github.com/JadenRazo/TicketHacker) | Helpdesk platform unifying Discord, Telegram, email, and live chat into one ticketing system. |
| [tts-raizhost](https://github.com/JadenRazo/tts-raizhost) | Self-hosted PDF reader-aloud using Kokoro TTS, Next.js, k3s, and GPU/CPU backends with circuit-breaker fallback. |
| [EzWeb](https://github.com/JadenRazo/EzWeb) | Earlier Go-based Docker site manager for deploying and monitoring containerized websites. |

<strong>Game servers & bots</strong>

| Repository | Description |
| :-- | :-- |
| [ServerPlugins](https://github.com/JadenRazo/ServerPlugins) | 24 interconnected Paper plugins covering claims, economy, events, administration, backpacks, arcade games, and parkour. |
| [SurvivalCore](https://github.com/JadenRazo/SurvivalCore) | Archived experimental Paper patch set: an unsupported code-study reference with no claimed verified build or benchmarks. |
| [Quiz-Bot](https://github.com/JadenRazo/Quiz-Bot) | Discord bot that turns LLM-generated questions into educational quiz games. |

</details>

## How I work

- Prefer Terraform, OIDC, least-privilege workflow permissions, and repeatable CI over stored
  deployment credentials or console-only changes.
- Treat cost, rollback, security, and operational ownership as design inputs, not cleanup after
  launch.
- Define the reliability target, instrument it, inject a controlled failure, and keep the
  measurement and corrective action beside the code.
- Publish limitations and failed hypotheses so architecture intent is never mistaken for measured
  evidence.

## Tech stack

<strong>Languages</strong>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=go%2Cpy%2Cts%2Cjava%2Cjs%2Cbash%2Cpowershell%2Chtml%2Ccss%2Cswift%2Clua%2Cmd&theme=dark">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=go%2Cpy%2Cts%2Cjava%2Cjs%2Cbash%2Cpowershell%2Chtml%2Ccss%2Cswift%2Clua%2Cmd&theme=light">
  <img alt="Go, Python, TypeScript, Java, JavaScript, Bash, PowerShell, HTML, CSS, Swift, Lua, and Markdown" src="https://skillicons.dev/icons?i=go,py,ts,java,js,bash,powershell,html,css,swift,lua,md">
</picture>

<strong>Cloud & infrastructure</strong>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=aws%2Cterraform%2Cdocker%2Ckubernetes%2Cgithubactions%2Clinux%2Cazure%2Cgcp%2Ccloudflare&theme=dark">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=aws%2Cterraform%2Cdocker%2Ckubernetes%2Cgithubactions%2Clinux%2Cazure%2Cgcp%2Ccloudflare&theme=light">
  <img alt="AWS, Terraform, Docker, Kubernetes, GitHub Actions, Linux, Azure, Google Cloud, and Cloudflare" src="https://skillicons.dev/icons?i=aws,terraform,docker,kubernetes,githubactions,linux,azure,gcp,cloudflare">
</picture>

<strong>Data & web</strong>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=postgres%2Credis%2Csqlite%2Cdynamodb%2Creact%2Cnextjs%2Cnodejs%2Castro%2Cvue%2Cexpress%2Cvite%2Ctailwind&theme=dark">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=postgres%2Credis%2Csqlite%2Cdynamodb%2Creact%2Cnextjs%2Cnodejs%2Castro%2Cvue%2Cexpress%2Cvite%2Ctailwind&theme=light">
  <img alt="PostgreSQL, Redis, SQLite, DynamoDB, React, Next.js, Node.js, Astro, Vue, Express, Vite, and Tailwind CSS" src="https://skillicons.dev/icons?i=postgres,redis,sqlite,dynamodb,react,nextjs,nodejs,astro,vue,express,vite,tailwind">
</picture>

<strong>Tooling</strong>

<img alt="Git, GitHub, npm, and VS Code" height="48" src="https://skillicons.dev/icons?i=git,github,npm,vscode"> <img alt="Claude Code, OpenAI Codex, and Gemini" height="48" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/ai-tools.svg">

## Stats

*Snapshot captured from GitHub data on 30 August 2026 and stored in this repository.*

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/stats-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/stats-light.svg">
  <img alt="GitHub stats for JadenRazo" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/stats-light.svg" height="165">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/top-langs-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/top-langs-light.svg">
  <img alt="Most used languages across public repositories" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/top-langs-light.svg" height="165">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/streak-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/streak-light.svg">
  <img alt="GitHub contribution streak" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/streak-light.svg" height="165">
</picture>

<details>
<summary><strong>More stats</strong>: lines of code across source repositories</summary>
<br>

<!-- LOC_START -->
**1,144,800** lines of code across **1,385,119** total lines in **38** repositories

| Language | Lines of Code | Share |
| :-- | --: | --: |
| Java | 278,128 | 24.3% |
| TypeScript | 196,378 | 17.2% |
| JSON | 190,182 | 16.6% |
| Go | 124,234 | 10.9% |
| HTML | 84,614 | 7.4% |
| Markdown | 76,256 | 6.7% |
| YAML | 39,256 | 3.4% |
| Python | 30,249 | 2.6% |
| JavaScript | 25,522 | 2.2% |
| Bourne Shell | 17,079 | 1.5% |
| Text | 15,763 | 1.4% |
| HCL | 13,286 | 1.2% |
<!-- LOC_END -->

*Counted daily across non-fork source repositories, including archived projects and excluding this profile repository, via
[GitHub Actions](.github/workflows/loc-counter.yml). A failed or incomplete scan is never published.*

</details>

## Contributions

A snake eats my contribution graph, counting up my real contributions as it goes. Its route changes
four times a day.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/output/github-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/output/github-snake.svg">
  <img alt="A snake eating Jaden Razo's GitHub contribution graph, with a running count of contributions consumed over the past year" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/output/github-snake.svg">
</picture>

## Production status

The public endpoints I currently maintain:

```text
SERVICE                       ROLE
------------------------------------------------------------
raizhost.com                  business website
app.raizhost.com              client editor
jadenrazo.dev                 portfolio
llm.raizhost.com              LLM release tracker
showersautodetail.com         client website
------------------------------------------------------------
```

[![raizhost.com availability](https://img.shields.io/website?url=https%3A%2F%2Fraizhost.com&label=raizhost.com&up_message=live&down_message=down&style=flat-square)](https://raizhost.com)
[![app.raizhost.com availability](https://img.shields.io/website?url=https%3A%2F%2Fapp.raizhost.com&label=client%20editor&up_message=live&down_message=down&style=flat-square)](https://app.raizhost.com)
[![jadenrazo.dev availability](https://img.shields.io/website?url=https%3A%2F%2Fjadenrazo.dev&label=portfolio&up_message=live&down_message=down&style=flat-square)](https://jadenrazo.dev)
[![llm.raizhost.com availability](https://img.shields.io/website?url=https%3A%2F%2Fllm.raizhost.com&label=LLM%20tracker&up_message=live&down_message=down&style=flat-square)](https://llm.raizhost.com)
[![showersautodetail.com availability](https://img.shields.io/website?url=https%3A%2F%2Fshowersautodetail.com&label=Showers%20Auto%20Detail&up_message=live&down_message=down&style=flat-square)](https://showersautodetail.com)

Fleet history and incident context live at [status.raizhost.com](https://status.raizhost.com).
