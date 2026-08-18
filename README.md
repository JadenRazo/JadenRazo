<div align="center">

# Jaden Razo

**Software engineer building developer tools and cloud infrastructure — founder of [RaizHost](https://raizhost.com), a web agency shipping client sites and a client portal.**

[![Website](https://img.shields.io/badge/jadenrazo.dev-portfolio-2ea043?style=flat-square&logo=googlechrome&logoColor=white)](https://jadenrazo.dev/)
[![RaizHost](https://img.shields.io/badge/raizhost.com-agency-2ea043?style=flat-square&logo=rocket&logoColor=white)](https://raizhost.com)
[![Email](https://img.shields.io/badge/email-jrazo17%40wgu.edu-555555?style=flat-square&logo=gmail&logoColor=white)](mailto:jrazo17@wgu.edu)

</div>

## What I'm building

| Project | What it does | Stack |
|:--------|:-------------|:------|
| **[llm-lint](https://github.com/JadenRazo/llm-lint)**<br>[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/llm-lint/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/JadenRazo/llm-lint/actions/workflows/ci.yml) [![Release](https://img.shields.io/github/v/release/JadenRazo/llm-lint?style=flat-square&color=2ea043)](https://github.com/JadenRazo/llm-lint/releases) [![npm](https://img.shields.io/npm/v/%40jadenrazo%2Fllm-lint?style=flat-square&color=2ea043)](https://www.npmjs.com/package/@jadenrazo/llm-lint) | CI gate that catches LLM-generated artifacts — stray `CLAUDE.md`, `Co-authored-by` trailers, `.cursorrules`, and friends. Emits SARIF, ships native Go binaries through npm with zero postinstall scripts. Try it: `npx @jadenrazo/llm-lint scan` | Go, SARIF, pre-commit |
| **[CloudCostMCP](https://github.com/JadenRazo/CloudCostMCP)**<br>[![CI](https://img.shields.io/github/actions/workflow/status/JadenRazo/CloudCostMCP/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/JadenRazo/CloudCostMCP/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/%40jadenrazo%2Fcloudcost-mcp?style=flat-square&color=2ea043)](https://www.npmjs.com/package/@jadenrazo/cloudcost-mcp) | MCP server that prices Terraform plans before you apply them — multi-cloud cost analysis across AWS, Azure, and GCP. | TypeScript, MCP, SQLite |
| **[sre-reference-app](https://github.com/JadenRazo/sre-reference-app)** | Production ECS Fargate blueprint: SLO burn-rate alarms, AWS FIS chaos drills, and OIDC-authenticated GitHub Actions deploys. | Terraform, AWS, GitHub Actions |
| **[tts-raizhost](https://github.com/JadenRazo/tts-raizhost)** | Self-hosted PDF reader-aloud on Kokoro TTS with a GPU/CPU dual-backend on k3s and circuit-breaker fallback. | Next.js, Kokoro, k3s |

<details>
<summary><strong>Full project directory</strong> — cloud &amp; SRE, tooling, web, game servers</summary>
<br>

**Cloud & SRE**

| Repository | Description |
|:-----------|:------------|
| [sre-landing-zone](https://github.com/JadenRazo/sre-landing-zone) | Five-account AWS landing zone with Pilot Light DR and a CloudFront/WAF/Cognito edge, built on a $120 credit budget. |
| [aws-supply-chain-security](https://github.com/JadenRazo/aws-supply-chain-security) | Container supply-chain stack: syft SBOMs, grype scans, keyless cosign signing via GitHub OIDC. |
| [aws-todo-api](https://github.com/JadenRazo/aws-todo-api) | Serverless reading list on API Gateway, Lambda, DynamoDB, Cognito, WAF, and X-Ray. |
| [azure-hub-spoke-network](https://github.com/JadenRazo/azure-hub-spoke-network) | Azure hub-and-spoke topology with VNets, peering, and NSGs, all in Terraform. |
| [initializing-ad](https://github.com/JadenRazo/initializing-ad) | Active Directory homelab: domain controller, DNS, group policy, and a full enterprise onboarding flow. |

**Developer tooling**

| Repository | Description |
|:-----------|:------------|
| [job-scanner](https://github.com/JadenRazo/job-scanner) | 24/7 ATS scanner that scores postings with Claude and drafts cover letters. |

**Web & apps**

| Repository | Description |
|:-----------|:------------|
| [Project-Website](https://github.com/JadenRazo/Project-Website) | Portfolio behind [jadenrazo.dev](https://jadenrazo.dev/) with a URL shortener, real-time messaging, and a hidden dev panel. |
| [TicketHacker](https://github.com/JadenRazo/TicketHacker) | Helpdesk platform unifying Discord, Telegram, email, and live chat into one ticketing system. |
| [EzWeb](https://github.com/JadenRazo/EzWeb) | Lightweight Docker site manager with a web dashboard (retired). |

**Game servers & bots**

| Repository | Description |
|:-----------|:------------|
| [ServerPlugins](https://github.com/JadenRazo/ServerPlugins) | 24 interconnected Paper plugins covering claims, economy, events, arcade games, and admin. |
| [SurvivalCore](https://github.com/JadenRazo/SurvivalCore) | Paper 1.21.8 fork with async entity tracking, SIMD math, and hopper caching. |
| [Quiz-Bot](https://github.com/JadenRazo/Quiz-Bot) | Discord bot that runs LLM-generated educational quiz games. |

</details>

## Tech stack

**Languages**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=go,ts,py,java,bash&theme=dark">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=go,ts,py,java,bash&theme=light">
  <img alt="Go, TypeScript, Python, Java, Bash" src="https://skillicons.dev/icons?i=go,ts,py,java,bash">
</picture>

**Cloud & infrastructure**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=aws,azure,terraform,docker,kubernetes,githubactions&theme=dark">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=aws,azure,terraform,docker,kubernetes,githubactions&theme=light">
  <img alt="AWS, Azure, Terraform, Docker, Kubernetes, GitHub Actions" src="https://skillicons.dev/icons?i=aws,azure,terraform,docker,kubernetes,githubactions">
</picture>

**Data & web**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=postgres,redis,react,nextjs,nodejs&theme=dark">
  <source media="(prefers-color-scheme: light)" srcset="https://skillicons.dev/icons?i=postgres,redis,react,nextjs,nodejs&theme=light">
  <img alt="PostgreSQL, Redis, React, Next.js, Node.js" src="https://skillicons.dev/icons?i=postgres,redis,react,nextjs,nodejs">
</picture>

## Stats

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/stats-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/stats-light.svg">
  <img alt="GitHub stats for JadenRazo" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/stats-light.svg" height="165">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/top-langs-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/top-langs-light.svg">
  <img alt="Most used languages" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/top-langs-light.svg" height="165">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/streak-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/streak-light.svg">
  <img alt="GitHub contribution streak" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated/streak-light.svg" height="165">
</picture>

<details>
<summary><strong>More stats</strong> — 3D contribution graph and lines of code across all repos</summary>
<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/profile-3d-contrib/profile-night-green.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/profile-3d-contrib/profile-green.svg">
  <img alt="3D contribution graph" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/profile-3d-contrib/profile-green.svg" width="720">
</picture>

<!-- LOC_START -->
**1,037,652** lines of code across **1,273,591** total lines

| Language | Lines of Code | % |
|----------|-------------:|--:|
| Java | 278,127 | 26.8% |
| TypeScript | 183,791 | 17.7% |
| JSON | 125,808 | 12.1% |
| Go | 124,234 | 12.0% |
| HTML | 75,029 | 7.2% |
| Markdown | 71,996 | 6.9% |
| YAML | 38,702 | 3.7% |
| Python | 30,188 | 2.9% |
| JavaScript | 19,373 | 1.9% |
| Text | 13,840 | 1.3% |
| Bourne Shell | 13,332 | 1.3% |
| HCL | 13,286 | 1.3% |
<!-- LOC_END -->

*Counted daily across all source repos via [GitHub Actions](.github/workflows/loc-counter.yml).*

</details>

## Recent activity

<!--START_SECTION:activity-->
1. 💪 Opened PR [#8](https://github.com/JadenRazo/JadenRazo/pull/8) in [JadenRazo/JadenRazo](https://github.com/JadenRazo/JadenRazo)
2. 💪 Opened PR [#49](https://github.com/JadenRazo/llm-lint/pull/49) in [JadenRazo/llm-lint](https://github.com/JadenRazo/llm-lint)
3. 🎉 Merged PR [#48](https://github.com/JadenRazo/llm-lint/pull/48) in [JadenRazo/llm-lint](https://github.com/JadenRazo/llm-lint)
4. 💪 Opened PR [#48](https://github.com/JadenRazo/llm-lint/pull/48) in [JadenRazo/llm-lint](https://github.com/JadenRazo/llm-lint)
5. 🎉 Merged PR [#47](https://github.com/JadenRazo/llm-lint/pull/47) in [JadenRazo/llm-lint](https://github.com/JadenRazo/llm-lint)
<!--END_SECTION:activity-->

## Contributions

A snake eats my contribution graph, counting up my real contributions as it goes. It takes a
different route every couple of hours.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/output/github-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/JadenRazo/JadenRazo/output/github-snake.svg">
  <img alt="A snake eating my GitHub contribution graph, with a running counter of contributions consumed over the past year" src="https://raw.githubusercontent.com/JadenRazo/JadenRazo/output/github-snake.svg">
</picture>

## Production status

Live uptime for the sites I run, checked every 30 minutes.

<!-- DEPLOY_MONITOR_START -->
```
$ deploy status
SITE                           STATE      HTTP   AVG LATENCY 
------------------------------------------------------------
raizhost.com                   up         200    66ms        
app.raizhost.com               up         307    146ms       
jadenrazo.dev                  up         200    67ms        
llm.raizhost.com               up         200    43ms        
showersautodetail.com          up         200    243ms       
------------------------------------------------------------
fleet average                                    113ms       

Last check: 2026-08-18T11:32:00Z (3 probes per site, averaged)
```
<!-- DEPLOY_MONITOR_END -->
