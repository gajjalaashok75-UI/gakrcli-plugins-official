# Docs Architect Plugin

Creates comprehensive technical documentation from existing codebases. Analyzes architecture, design patterns, and implementation details to produce long-form technical manuals and ebooks.

## Overview

This plugin packages the `docs-architect` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install docs-architect@gakrcli-plugins-official
```

## Usage

### Command

```text
/docs-architect:use
```

### Agent

Ask GAKRCLI to launch `docs-architect-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/docs-architect/SKILL.md
```

## Plugin Structure

```text
docs-architect/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/docs-architect-agent.md
|-- skills/docs-architect/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/docs-architect/`.

## License

MIT License. See `LICENSE` for details.
