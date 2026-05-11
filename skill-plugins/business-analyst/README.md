# Business Analyst Plugin

Master modern business analysis with AI-powered analytics, real-time dashboards, and data-driven insights. Build comprehensive KPI frameworks, predictive models, and strategic recommendations.

## Overview

This plugin packages the `business-analyst` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install business-analyst@gakrcli-plugins-official
```

## Usage

### Command

```text
/business-analyst:use
```

### Agent

Ask GAKRCLI to launch `business-analyst-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/business-analyst/SKILL.md
```

## Plugin Structure

```text
business-analyst/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/business-analyst-agent.md
|-- skills/business-analyst/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/business-analyst/`.

## License

MIT License. See `LICENSE` for details.
