# Vercel Deploy Plugin

Deploy applications and websites to Vercel. Use this skill when the user requests deployment actions such as "Deploy my app", "Deploy this to production", "Create a preview deployment", "Deploy and give me the link", or "Push this live". No authentication required - returns preview URL and claimable deployment link.

## Overview

This plugin packages the `vercel-deploy` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install vercel-deploy@gakrcli-plugins-official
```

## Usage

### Command

```text
/vercel-deploy:use
```

### Agent

Ask GAKRCLI to launch `vercel-deploy-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/vercel-deploy/SKILL.md
```

## Plugin Structure

```text
vercel-deploy/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/vercel-deploy-agent.md
|-- skills/vercel-deploy/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/vercel-deploy/`.

## License

MIT License. See `LICENSE` for details.
