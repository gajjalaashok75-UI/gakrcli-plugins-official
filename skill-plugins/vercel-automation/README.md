# Vercel Automation Plugin

Automate Vercel tasks via Rube MCP (Composio): manage deployments, domains, DNS, env vars, projects, and teams. Always search tools first for current schemas.

## Overview

This plugin packages the `vercel-automation` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install vercel-automation@gakrcli-plugins-official
```

## Usage

### Command

```text
/vercel-automation:use
```

### Agent

Ask GAKRCLI to launch `vercel-automation-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/vercel-automation/SKILL.md
```

## Plugin Structure

```text
vercel-automation/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/vercel-automation-agent.md
|-- skills/vercel-automation/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/vercel-automation/`.

## License

MIT License. See `LICENSE` for details.
