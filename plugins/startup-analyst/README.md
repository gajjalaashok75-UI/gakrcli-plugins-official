# Startup Analyst Plugin

Expert startup business analyst specializing in market sizing, financial modeling, competitive analysis, and strategic planning for early-stage companies.

## Overview

This plugin packages the `startup-analyst` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install startup-analyst@gakrcli-plugins-official
```

## Usage

### Command

```text
/startup-analyst:use
```

### Agent

Ask GAKRCLI to launch `startup-analyst-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/startup-analyst/SKILL.md
```

## Plugin Structure

```text
startup-analyst/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/startup-analyst-agent.md
|-- skills/startup-analyst/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/startup-analyst/`.

## License

MIT License. See `LICENSE` for details.
