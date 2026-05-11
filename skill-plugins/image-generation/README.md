# Image Generation Plugin

Use this skill when the user requests to generate, create, imagine, or visualize images including characters, scenes, products, or any visual content. Supports structured prompts and reference images for guided generation.

## Overview

This plugin packages the `image-generation` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install image-generation@gakrcli-plugins-official
```

## Usage

### Command

```text
/image-generation:use
```

### Agent

Ask GAKRCLI to launch `image-generation-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/image-generation/SKILL.md
```

## Plugin Structure

```text
image-generation/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/image-generation-agent.md
|-- skills/image-generation/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/image-generation/`.

## License

MIT License. See `LICENSE` for details.
