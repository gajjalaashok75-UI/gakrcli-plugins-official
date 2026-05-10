# Mermaid Expert Plugin

Create Mermaid diagrams for flowcharts, sequences, ERDs, and architectures. Masters syntax for all diagram types and styling.

## Overview

This plugin packages the `mermaid-expert` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install mermaid-expert@gakrcli-plugins-official
```

## Usage

### Command

```text
/mermaid-expert:use
```

### Agent

Ask GAKRCLI to launch `mermaid-expert-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/mermaid-expert/SKILL.md
```

## Plugin Structure

```text
mermaid-expert/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/mermaid-expert-agent.md
|-- skills/mermaid-expert/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/mermaid-expert/`.

## License

MIT License. See `LICENSE` for details.
