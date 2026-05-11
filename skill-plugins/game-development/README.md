# Game Development Plugin

Game development orchestrator. Routes to platform-specific skills based on project needs.

## Overview

This plugin packages the `game-development` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install game-development@gakrcli-plugins-official
```

## Usage

### Command

```text
/game-development:use
```

### Agent

Ask GAKRCLI to launch `game-development-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/game-development/SKILL.md
```

## Plugin Structure

```text
game-development/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/game-development-agent.md
|-- skills/game-development/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/game-development/`.

## License

MIT License. See `LICENSE` for details.
