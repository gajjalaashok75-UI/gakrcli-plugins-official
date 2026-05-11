# Product Atlas Plugin

Comprehensive product management orchestrator. Covers product strategy, design, management, marketing, and launch. Use when working on product development and strategy.

## Overview

This plugin packages the `product-atlas` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install product-atlas@gakrcli-plugins-official
```

## Usage

### Command

```text
/product-atlas:use
```

### Agent

Ask GAKRCLI to launch `product-atlas-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/product-atlas/SKILL.md
```

## Plugin Structure

```text
product-atlas/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/product-atlas-agent.md
|-- skills/product-atlas/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/product-atlas/`.

## License

MIT License. See `LICENSE` for details.
