# Jaden Razo

Cloud & DevOps engineer building reliable, secure, cost-aware systems with AWS,
Terraform, Go, and TypeScript.

I run [RaizHost](https://raizhost.com), a small hosting and automation business,
and I am open to full-time cloud/DevOps roles and SRE or platform teams.

[Portfolio](https://jadenrazo.dev) · [Architecture](https://github.com/JadenRazo/raizhost-architecture) ·
[Service status](https://status.raizhost.com) · [LinkedIn](https://linkedin.com/in/JadenRazo) ·
[Email](mailto:contact@jadenrazo.dev)

## Evidence I lead with

| Project | What you can inspect |
| --- | --- |
| [RaizHost architecture](https://github.com/JadenRazo/raizhost-architecture) | Public architecture and decision record for a one-person AWS platform documented at roughly 10 production sites and three web apps for about $50/month. The repository clearly separates public evidence from private application and Terraform source. |
| [SRE reference app](https://github.com/JadenRazo/sre-reference-app) | Controlled ECS failure exercise with a measured 78-second recovery, no burn-rate alarm breach, a GameDay, postmortem, SLO math, runbook, Terraform, and explicit limitations. |
| [llm-tracker](https://github.com/JadenRazo/llm-tracker) | AWS-hosted release tracker with an OIDC deployment path and documented cache and deployment failure modes. Its repository still needs stronger automated test evidence. |
| [llm-lint](https://github.com/JadenRazo/llm-lint) | Go policy and repository-boundary scanner shipped as native binaries and an npm package, with CodeQL, SARIF, release verification, SBOMs, and signed artifacts. |
| [CloudCostMCP](https://github.com/JadenRazo/CloudCostMCP) | Multi-IaC cost analysis for AWS, Azure, and GCP. Its [pricing-drift incident review](https://github.com/JadenRazo/CloudCostMCP/blob/main/docs/incidents/2026-08-pricing-drift.md) shows the defect, detection gap, live verification, and regression controls. |

## How I work

- Use Terraform, OIDC, least-privilege workflow permissions, and repeatable CI
  instead of long-lived deployment credentials.
- Define the reliability target, instrument it, inject a controlled failure, and
  keep the measurement and corrective action beside the code.
- Treat cost, rollback, security, and operational ownership as design inputs—not
  cleanup work after launch.
- Publish limitations and failed hypotheses so reviewers can distinguish
  measured evidence from architecture intent.

Current focus: strengthening public Kubernetes/GitOps operating evidence in
[`tts-raizhost`](https://github.com/JadenRazo/tts-raizhost) and moving from strong
SRE practices toward sustained reliability-program evidence.
