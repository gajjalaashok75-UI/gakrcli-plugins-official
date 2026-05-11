# Plotly Plugin

Interactive visualization library. Use when you need hover info, zoom, pan, or web-embeddable charts. Best for dashboards, exploratory analysis, and presentations. For static publication figures use matplotlib or scientific-visualization.

## Overview

This plugin packages the `plotly` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install plotly@gakrcli-plugins-official
```

## Usage

### Command

```text
/plotly:use
```

### Agent

Ask GAKRCLI to launch `plotly-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/plotly/SKILL.md
```

## Plugin Structure

```text
plotly/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/plotly-agent.md
|-- skills/plotly/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/plotly/`.

## License

MIT License. See `LICENSE` for details.
