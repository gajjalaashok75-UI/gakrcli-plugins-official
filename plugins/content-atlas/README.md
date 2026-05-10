# Content Atlas Plugin

Comprehensive content creation orchestrator. Covers content strategy, creation, marketing, social media, and content optimization. Use when creating or managing content.

## Overview

This plugin packages the `content-atlas` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install content-atlas@gakrcli-plugins-official
```

## Usage

### Command

```text
/content-atlas:use
```

### Agent

Ask GAKRCLI to launch `content-atlas-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/content-atlas/SKILL.md
```

## Plugin Structure

```text
content-atlas/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/content-atlas-agent.md
|-- skills/content-atlas/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/content-atlas/`.

## License

MIT License. See `LICENSE` for details.
