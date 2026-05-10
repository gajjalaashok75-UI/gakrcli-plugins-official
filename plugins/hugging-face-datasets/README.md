# Hugging Face Datasets Plugin

Create and manage datasets on Hugging Face Hub. Supports initializing repos, defining configs/system prompts, streaming row updates, and SQL-based dataset querying/transformation. Designed to work alongside HF MCP server for comprehensive dataset workflows.

## Overview

This plugin packages the `hugging-face-datasets` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install hugging-face-datasets@gakrcli-plugins-official
```

## Usage

### Command

```text
/hugging-face-datasets:use
```

### Agent

Ask GAKRCLI to launch `hugging-face-datasets-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/hugging-face-datasets/SKILL.md
```

## Plugin Structure

```text
hugging-face-datasets/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/hugging-face-datasets-agent.md
|-- skills/hugging-face-datasets/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/hugging-face-datasets/`.

## License

MIT License. See `LICENSE` for details.
