# Chart Visualization Plugin

This skill should be used when the user wants to visualize data. It intelligently selects the most suitable chart type from 26 available options, extracts parameters based on detailed specifications, and generates a chart image using a JavaScript script.

## Overview

This plugin packages the `chart-visualization` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install chart-visualization@gakrcli-plugins-official
```

## Usage

### Command

```text
/chart-visualization:use
```

### Agent

Ask GAKRCLI to launch `chart-visualization-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/chart-visualization/SKILL.md
```

## Plugin Structure

```text
chart-visualization/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/chart-visualization-agent.md
|-- skills/chart-visualization/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/chart-visualization/`.

## License

MIT License. See `LICENSE` for details.
