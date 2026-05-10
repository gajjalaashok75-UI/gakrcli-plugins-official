# Data Scientist Plugin

Expert data scientist for advanced analytics, machine learning, and statistical modeling. Handles complex data analysis, predictive modeling, and business intelligence.

## Overview

This plugin packages the `data-scientist` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install data-scientist@gakrcli-plugins-official
```

## Usage

### Command

```text
/data-scientist:use
```

### Agent

Ask GAKRCLI to launch `data-scientist-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/data-scientist/SKILL.md
```

## Plugin Structure

```text
data-scientist/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/data-scientist-agent.md
|-- skills/data-scientist/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/data-scientist/`.

## License

MIT License. See `LICENSE` for details.
