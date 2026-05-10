# PPT Generation Plugin

Use this skill when the user requests to generate, create, or make presentations (PPT/PPTX). Creates visually rich slides by generating images for each slide and composing them into a PowerPoint file.

## Overview

This plugin packages the `ppt-generation` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install ppt-generation@gakrcli-plugins-official
```

## Usage

### Command

```text
/ppt-generation:use
```

### Agent

Ask GAKRCLI to launch `ppt-generation-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/ppt-generation/SKILL.md
```

## Plugin Structure

```text
ppt-generation/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/ppt-generation-agent.md
|-- skills/ppt-generation/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/ppt-generation/`.

## License

MIT License. See `LICENSE` for details.
