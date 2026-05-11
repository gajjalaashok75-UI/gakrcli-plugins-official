# Network Engineer Plugin

Expert network engineer specializing in modern cloud networking, security architectures, and performance optimization.

## Overview

This plugin packages the `network-engineer` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install network-engineer@gakrcli-plugins-official
```

## Usage

### Command

```text
/network-engineer:use
```

### Agent

Ask GAKRCLI to launch `network-engineer-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/network-engineer/SKILL.md
```

## Plugin Structure

```text
network-engineer/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/network-engineer-agent.md
|-- skills/network-engineer/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/network-engineer/`.

## License

MIT License. See `LICENSE` for details.
