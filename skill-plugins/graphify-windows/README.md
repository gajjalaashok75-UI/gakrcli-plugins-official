# Graphify Windows Plugin

any input (code, docs, papers, images) -> knowledge graph -> clustered communities -> HTML + JSON + audit report

## Overview

This plugin packages the `graphify-windows` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install graphify-windows@gakrcli-plugins-official
```

## Usage

### Command

```text
/graphify-windows:use
```

### Agent

Ask GAKRCLI to launch `graphify-windows-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/graphify-windows/SKILL.md
```

## Plugin Structure

```text
graphify-windows/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/graphify-windows-agent.md
|-- skills/graphify-windows/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/graphify-windows/`.

## License

MIT License. See `LICENSE` for details.
