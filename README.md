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
| [sre-reference-app](https://github.com/JadenRazo/sre-reference-app) | Production ECS Fargate blueprint with SLO burn-rate alarms, FIS chaos drills, and OIDC-authed GitHub Actions. | Terraform, AWS, GitHub Actions |
| [sre-landing-zone](https://github.com/JadenRazo/sre-landing-zone) | Five-account AWS landing zone with Pilot Light DR and a CloudFront/WAF/Cognito edge, all on a $120 credit budget. | Terraform, AWS Organizations |
| [aws-supply-chain-security](https://github.com/JadenRazo/aws-supply-chain-security) | Container supply-chain stack on AWS: syft SBOMs, grype scans, keyless cosign signing via GitHub OIDC. | Terraform, ECR, cosign |
| [aws-todo-api](https://github.com/JadenRazo/aws-todo-api) | Live serverless reading list on API Gateway, Lambda, DynamoDB, Cognito, WAF, and X-Ray. | AWS SAM, Lambda, DynamoDB |
| [azure-hub-spoke-network](https://github.com/JadenRazo/azure-hub-spoke-network) | Azure hub-and-spoke topology with VNets, peering, and NSGs, all in Terraform. | Terraform, Azure |
| [EzWeb](https://github.com/JadenRazo/EzWeb) *(retired)* | Lightweight Docker site manager with a web dashboard. | Go, Docker |

#### `dev-tooling/`

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [llm-lint](https://github.com/JadenRazo/llm-lint) | CI gate that catches LLM artifacts: stray `CLAUDE.md`, `Co-authored-by` trailers, `.cursorrules`, and friends. Emits SARIF. | Go, pre-commit, SARIF |
| [CloudCostMCP](https://github.com/JadenRazo/CloudCostMCP) | MCP server that prices Terraform plans across AWS, Azure, and GCP. | TypeScript, MCP, SQLite |
| [dependabot-automation](https://github.com/JadenRazo/dependabot-automation) | Drop-in GitHub Actions workflow that auto-merges Dependabot PRs after an OSV.dev CVE diff. | GitHub Actions, OSV |

#### `web-and-apps/`

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [Project-Website](https://github.com/JadenRazo/Project-Website) | Portfolio with a URL shortener, real-time messaging, and a hidden dev panel. | Go (Fiber), React, TypeScript |
| [TicketHacker](https://github.com/JadenRazo/TicketHacker) | One ticketing system that unifies Discord, Telegram, email, and live chat. | TypeScript, React, Node.js |
| [tts-raizhost](https://github.com/JadenRazo/tts-raizhost) | Self-hosted PDF reader-aloud powered by Kokoro v1.0 with a GPU/CPU dual-backend on k3s and circuit-breaker fallback. | Next.js, Kokoro, k3s |
| [job-scanner](https://github.com/JadenRazo/job-scanner) | 24/7 ATS scanner that scores postings with Claude and drafts cover letters. | TypeScript, Node.js, Redis |

#### `minecraft-and-bots/`

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [ServerPlugins](https://github.com/JadenRazo/ServerPlugins) | 24 interconnected Paper plugins covering claims, economy, events, arcade games, and admin. | Java 21, Paper API, Maven |
| [SurvivalCore](https://github.com/JadenRazo/SurvivalCore) | Paper 1.21.8 fork with async entity tracking, SIMD math, and hopper caching. | Java, Paper |
| [Quiz-Bot](https://github.com/JadenRazo/Quiz-Bot) | Discord bot that runs LLM-generated educational quiz games. | Python, discord.py |

#### `labs/`

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [initializing-ad](https://github.com/JadenRazo/initializing-ad) | Active Directory homelab covering a domain controller, DNS, group policy, and a full enterprise onboarding flow. | Windows Server 2022, VirtualBox |

*Filter by language or domain via topics on the [repositories tab](https://github.com/JadenRazo?tab=repositories).*

---

### `$ cloc --by-language ~/repos/`

<!-- LOC_START -->
**643,120** lines of code across **788,629** total lines

| Language | Lines of Code | % |
|----------|-------------:|--:|
| Java | 169,576 | 26.4% |
| TypeScript | 140,024 | 21.8% |
| JSON | 89,408 | 13.9% |
| Go | 79,112 | 12.3% |
| Markdown | 33,314 | 5.2% |
| YAML | 32,794 | 5.1% |
| Python | 25,667 | 4.0% |
| Text | 13,182 | 2.0% |
| diff | 13,079 | 2.0% |
| Swift | 8,042 | 1.3% |
| Bourne Shell | 6,677 | 1.0% |
| HCL | 6,499 | 1.0% |
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
raizhost.com                   up         200    45ms      
app.raizhost.com               up         307    50ms      
jadenrazo.dev                  up         200    39ms      
claude.raizhost.com            up         301    36ms      
showersautodetail.com          up         200    45ms      

Last check: 2026-05-22T23:00:01Z
```
<!-- DEPLOY_MONITOR_END -->

