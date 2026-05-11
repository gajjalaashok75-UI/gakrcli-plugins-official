# Video Generation Plugin

Use this skill when the user requests to generate, create, or imagine videos. Supports structured prompts and reference image for guided generation.

## Overview

This plugin packages the `video-generation` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install video-generation@gakrcli-plugins-official
```

## Usage

### Command

```text
/video-generation:use
```

### Agent

Ask GAKRCLI to launch `video-generation-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/video-generation/SKILL.md
```

## Plugin Structure

```text
video-generation/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/video-generation-agent.md
|-- skills/video-generation/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/video-generation/`.

## License

MIT License. See `LICENSE` for details.
