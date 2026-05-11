# Matplotlib Plugin

Matplotlib is Python's foundational visualization library for creating static, animated, and interactive plots.

## Overview

This plugin packages the `matplotlib` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install matplotlib@gakrcli-plugins-official
```

## Usage

### Command

```text
/matplotlib:use
```

### Agent

Ask GAKRCLI to launch `matplotlib-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/matplotlib/SKILL.md
```

## Plugin Structure

```text
matplotlib/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/matplotlib-agent.md
|-- skills/matplotlib/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/matplotlib/`.

## License

MIT License. See `LICENSE` for details.
