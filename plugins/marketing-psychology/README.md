# Marketing Psychology Plugin

Apply behavioral science and mental models to marketing decisions, prioritized using a psychological leverage and feasibility scoring system.

## Overview

This plugin packages the `marketing-psychology` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install marketing-psychology@gakrcli-plugins-official
```

## Usage

### Command

```text
/marketing-psychology:use
```

### Agent

Ask GAKRCLI to launch `marketing-psychology-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/marketing-psychology/SKILL.md
```

## Plugin Structure

```text
marketing-psychology/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/marketing-psychology-agent.md
|-- skills/marketing-psychology/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/marketing-psychology/`.

## License

MIT License. See `LICENSE` for details.
