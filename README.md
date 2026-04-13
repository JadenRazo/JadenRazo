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

### `$ ls -la projects/`

```
drwxr-xr-x  jaden  staff   projects/
```

| Repository | Description | Stack |
|:-----------|:------------|:------|
| [CloudCostMCP](https://github.com/JadenRazo/CloudCostMCP) | MCP server for multi-cloud Terraform cost analysis across AWS, Azure, and GCP | TypeScript, Node.js, SQLite |
| [EzWeb](https://github.com/JadenRazo/EzWeb) | Docker site deployment platform with Caddy, health checks, and SSE streaming | Go, Fiber, SQLite, HTMX, Docker |
| [Project-Website](https://github.com/JadenRazo/Project-Website) | Portfolio with URL shortener, real-time messaging, and dev panel | React, TypeScript, Go |
| [TicketHacker](https://github.com/JadenRazo/TicketHacker) | Unified helpdesk — Discord, Telegram, email, live chat in one ticketing system | TypeScript, React, Node.js |
| [SurvivalCore](https://github.com/JadenRazo/SurvivalCore) | Paper 1.21.8 fork with async entity tracking, SIMD math, hopper caching | Java, Paper API |
| [Showers Auto Detailing](https://github.com/JadenRazo/showersautodetail) | Business site with quote calculator, booking, and Square payments | Astro, React, Node.js, PostgreSQL |
| [ServerPlugins](https://github.com/JadenRazo/ServerPlugins) | 24 interconnected Minecraft plugins — claims, economy, events, casino, admin | Java 21, Maven, Paper API |
| [initializing-ad](https://github.com/JadenRazo/initializing-ad) | Active Directory lab — domain controller, DNS, group policy, and enterprise onboarding | Windows Server 2022, VirtualBox |
| [Quiz-Bot](https://github.com/JadenRazo/Quiz-Bot) | Discord bot using LLMs for educational quiz games | Python, Discord.py |

---

### `$ systemctl status ezweb-sites`

<!-- DEPLOY_MONITOR_START -->
```
$ ezweb status
SITE                           STATE      HTTP   LATENCY    CONTAINER   
----------------------------------------------------------------------
jadenrazo.dev                  running    403    137ms      not_found   
tickets.jadenrazo.dev          running    403    119ms      not_found   
client-site-1.example          running    —      —          not_found   
client-site-2.example          running    200    407ms      not_found   
client-site-3.example          running    200    523ms      not_found   
client-site-4.example          running    —      5009ms     not_found   

Last check: 2026-02-19T21:28:45Z
```
<!-- DEPLOY_MONITOR_END -->

*Refreshed every 30 minutes via [GitHub Actions](.github/workflows/deploy-monitor.yml)*

---

### `$ cloc --by-language ~/repos/`

<!-- LOC_START -->
**434,207** lines of code across **544,196** total lines

| Language | Lines of Code | % |
|----------|-------------:|--:|
| Java | 137,769 | 31.7% |
| TypeScript | 95,732 | 22.0% |
| Go | 65,682 | 15.1% |
| JSON | 35,392 | 8.2% |
| Python | 22,570 | 5.2% |
| Markdown | 19,523 | 4.5% |
| YAML | 18,966 | 4.4% |
| diff | 13,079 | 3.0% |
| Vuejs Component | 6,111 | 1.4% |
| Bourne Shell | 5,030 | 1.2% |
| SQL | 3,697 | 0.9% |
| CSS | 3,519 | 0.8% |
<!-- LOC_END -->

*Updated weekly + on every push via [GitHub Actions](.github/workflows/loc-counter.yml)*

---

### `$ git log --oneline --graph`

<img src="./profile-3d-contrib/profile-night-green.svg" alt="3D Contribution Graph" width="100%">

*Generated daily via [GitHub Actions](.github/workflows/profile-3d.yml)*

---

### `$ uptime`

<img src="https://streak-stats.demolab.com?user=JadenRazo&theme=github-dark-blue&hide_border=true&background=0D1117&ring=39D353&fire=39D353&currStreakLabel=39D353" alt="GitHub Streak" />
