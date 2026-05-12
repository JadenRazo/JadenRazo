<a href="https://github.com/JadenRazo">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=22&duration=3000&pause=1000&color=39D353&background=0D1117&vCenter=true&width=600&lines=jaden%40dev%3A~+%24+whoami;full-stack+developer+%7C+infrastructure+nerd;if+it+runs+in+a+container%2C+i+can+ship+it" alt="Typing SVG" />
</a>

---

### `$ cat about.txt`

```
Full-stack developer building production systems from frontend to bare metal.
I design web platforms, deploy containerized services, and maintain custom
Minecraft server forks. Most of my work lives in Go, Java, TypeScript, and Python.
```

---

### `$ cat skills.txt`

```
LANGUAGES       Go · Java · TypeScript · Python · SQL · Shell
FRONTEND        React · Astro · Tailwind CSS · Redux · HTMX
BACKEND         Fiber · Node.js · Express · Discord.py · JDA
DATA            PostgreSQL · MariaDB · SQLite · Redis
INFRA           Docker · Caddy · Nginx · GitHub Actions · SSH · Terraform
CLOUD           AWS · Azure · GCP · Active Directory · Windows Server
MINECRAFT       Paper API · Velocity · ProtocolLib · NMS
```

---

### `$ tree projects/ -L 1`

```text
projects/
├── cloud-sre-infra/      # AWS, Terraform, observability, GitOps
├── dev-tooling/          # CLIs, MCP servers, automation
├── web-and-apps/         # Sites, dashboards, products
├── minecraft-and-bots/   # Game servers and Discord bots
└── labs/                 # Homelab experiments
```

#### `cloud-sre-infra/`

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [sre-reference-app](https://github.com/JadenRazo/sre-reference-app) | ECS Fargate reference — ALB, SLO burn-rate alarms, AWS FIS chaos, GHA OIDC CI/CD | Terraform, AWS, GitHub Actions |
| [sre-landing-zone](https://github.com/JadenRazo/sre-landing-zone) | Day-2 multi-account AWS landing zone — 5 accounts, Pilot Light DR, edge stack | Terraform, AWS Organizations |
| [aws-supply-chain-security](https://github.com/JadenRazo/aws-supply-chain-security) | Container supply chain — syft SBOM, grype scan, keyless cosign via GHA OIDC | Terraform, ECR, cosign |
| [aws-todo-api](https://github.com/JadenRazo/aws-todo-api) | Serverless reading list — API GW + Lambda + DynamoDB + Cognito + WAF + X-Ray | AWS SAM, Lambda, DynamoDB |
| [azure-hub-spoke-network](https://github.com/JadenRazo/azure-hub-spoke-network) | Azure hub-spoke topology with VNets, peering, and NSGs | Terraform, Azure |
| [EzWeb](https://github.com/JadenRazo/EzWeb) *(retired)* | Lightweight Docker site manager with web dashboard | Go, Docker |

#### `dev-tooling/`

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [llm-lint](https://github.com/JadenRazo/llm-lint) | Catch LLM-generated artifacts (`CLAUDE.md`, Co-authored-by trailers, `.cursorrules`) in CI | Go, pre-commit, SARIF |
| [CloudCostMCP](https://github.com/JadenRazo/CloudCostMCP) | MCP server for multi-cloud Terraform cost analysis across AWS, Azure, GCP | TypeScript, MCP, SQLite |
| [dependabot-automation](https://github.com/JadenRazo/dependabot-automation) | Reusable GHA workflow that auto-merges Dependabot PRs after an OSV.dev CVE diff | GitHub Actions, OSV |

#### `web-and-apps/`

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [Project-Website](https://github.com/JadenRazo/Project-Website) | Portfolio with URL shortener, real-time messaging, and dev panel | Go (Fiber), React, TypeScript |
| [TicketHacker](https://github.com/JadenRazo/TicketHacker) | Unified helpdesk — Discord, Telegram, email, live chat in one ticketing system | TypeScript, React, Node.js |
| [tts-raizhost](https://github.com/JadenRazo/tts-raizhost) | Self-hosted PDF reader-aloud with Kokoro v1.0 TTS, GPU/CPU dual-backend on k3s | Next.js, Kokoro, k3s |
| [job-scanner](https://github.com/JadenRazo/job-scanner) | 24/7 ATS scanner with Claude-based scoring and cover-letter drafting | TypeScript, Node.js, Redis |

#### `minecraft-and-bots/`

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [ServerPlugins](https://github.com/JadenRazo/ServerPlugins) | 24 interconnected Paper plugins — claims, economy, events, casino, arcade, admin | Java 21, Paper API, Maven |
| [SurvivalCore](https://github.com/JadenRazo/SurvivalCore) | Paper 1.21.8 fork — async entity tracking, SIMD math, hopper caching | Java, Paper |
| [Quiz-Bot](https://github.com/JadenRazo/Quiz-Bot) | Discord bot using LLMs to run educational quiz games | Python, discord.py |

#### `labs/`

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [initializing-ad](https://github.com/JadenRazo/initializing-ad) | Active Directory homelab — DC, DNS, group policy, and enterprise onboarding flow | Windows Server 2022, VirtualBox |

*Filter by language or domain via topics on the [repositories tab](https://github.com/JadenRazo?tab=repositories).*

---

### `$ cloc --by-language ~/repos/`

<!-- LOC_START -->
**636,588** lines of code across **780,320** total lines

| Language | Lines of Code | % |
|----------|-------------:|--:|
| Java | 169,576 | 26.6% |
| TypeScript | 138,804 | 21.8% |
| JSON | 89,033 | 14.0% |
| Go | 79,112 | 12.4% |
| YAML | 32,525 | 5.1% |
| Markdown | 31,848 | 5.0% |
| Python | 25,667 | 4.0% |
| Text | 13,182 | 2.1% |
| diff | 13,079 | 2.1% |
| HCL | 6,484 | 1.0% |
| Bourne Shell | 6,363 | 1.0% |
| Vuejs Component | 6,111 | 1.0% |
<!-- LOC_END -->

*Updated daily via [GitHub Actions](.github/workflows/loc-counter.yml)*

---

### `$ git log --oneline --graph`

<img src="./profile-3d-contrib/profile-night-green.svg" alt="3D Contribution Graph" width="720">
<img src="https://streak-stats.demolab.com?user=JadenRazo&theme=github-dark-blue&hide_border=true&background=0D1117&ring=39D353&fire=39D353&currStreakLabel=39D353" alt="GitHub Streak" />

*Generated daily via [GitHub Actions](.github/workflows/profile-3d.yml)*

---

### `$ deploy status`

<!-- DEPLOY_MONITOR_START -->
```
$ deploy status
SITE                           STATE      HTTP   LATENCY   
----------------------------------------------------------
raizhost.com                   up         200    39ms      
app.raizhost.com               up         307    33ms      
jadenrazo.dev                  up         200    30ms      
claude.raizhost.com            up         200    88ms      
showersautodetail.com          up         200    40ms      

Last check: 2026-05-12T08:30:01Z
```
<!-- DEPLOY_MONITOR_END -->

