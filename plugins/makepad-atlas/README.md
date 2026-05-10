# Makepad Atlas Plugin

Comprehensive Makepad framework orchestrator. Covers Makepad DSL, widgets, layout, animation, shaders, and Makepad development. Use when building Makepad applications.

## Overview

This plugin packages the `makepad-atlas` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install makepad-atlas@gakrcli-plugins-official
```

## Usage

### Command

```text
/makepad-atlas:use
```

### Agent

Ask GAKRCLI to launch `makepad-atlas-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/makepad-atlas/SKILL.md
```

## Plugin Structure

```text
makepad-atlas/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/makepad-atlas-agent.md
|-- skills/makepad-atlas/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/makepad-atlas/`.

## License

MIT License. See `LICENSE` for details.
