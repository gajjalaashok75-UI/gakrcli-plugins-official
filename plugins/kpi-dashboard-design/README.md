# KPI Dashboard Design Plugin

Comprehensive patterns for designing effective Key Performance Indicator (KPI) dashboards that drive business decisions.

## Overview

This plugin packages the `kpi-dashboard-design` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install kpi-dashboard-design@gakrcli-plugins-official
```

## Usage

### Command

```text
/kpi-dashboard-design:use
```

### Agent

Ask GAKRCLI to launch `kpi-dashboard-design-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/kpi-dashboard-design/SKILL.md
```

## Plugin Structure

```text
kpi-dashboard-design/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/kpi-dashboard-design-agent.md
|-- skills/kpi-dashboard-design/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/kpi-dashboard-design/`.

## License

MIT License. See `LICENSE` for details.
