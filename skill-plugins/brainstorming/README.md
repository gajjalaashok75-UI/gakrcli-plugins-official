# Brainstorming Plugin

Use before creative or constructive work (features, architecture, behavior). Transforms vague ideas into validated designs through disciplined reasoning and collaboration.

## Overview

This plugin packages the `brainstorming` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install brainstorming@gakrcli-plugins-official
```

## Usage

### Command

```text
/brainstorming:use
```

### Agent

Ask GAKRCLI to launch `brainstorming-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/brainstorming/SKILL.md
```

## Plugin Structure

```text
brainstorming/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/brainstorming-agent.md
|-- skills/brainstorming/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/brainstorming/`.

## License

MIT License. See `LICENSE` for details.
