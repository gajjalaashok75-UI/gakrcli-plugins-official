# Podcast Generation Plugin

Use this skill when the user requests to generate, create, or produce podcasts from text content. Converts written content into a two-host conversational podcast audio format with natural dialogue.

## Overview

This plugin packages the `podcast-generation` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install podcast-generation@gakrcli-plugins-official
```

## Usage

### Command

```text
/podcast-generation:use
```

### Agent

Ask GAKRCLI to launch `podcast-generation-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/podcast-generation/SKILL.md
```

## Plugin Structure

```text
podcast-generation/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/podcast-generation-agent.md
|-- skills/podcast-generation/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/podcast-generation/`.

## License

MIT License. See `LICENSE` for details.
