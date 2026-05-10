# Hugging Face Dataset Viewer Plugin

Query Hugging Face datasets through the Dataset Viewer API for splits, rows, search, filters, and parquet links.

## Overview

This plugin packages the `hugging-face-dataset-viewer` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install hugging-face-dataset-viewer@gakrcli-plugins-official
```

## Usage

### Command

```text
/hugging-face-dataset-viewer:use
```

### Agent

Ask GAKRCLI to launch `hugging-face-dataset-viewer-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/hugging-face-dataset-viewer/SKILL.md
```

## Plugin Structure

```text
hugging-face-dataset-viewer/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/hugging-face-dataset-viewer-agent.md
|-- skills/hugging-face-dataset-viewer/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/hugging-face-dataset-viewer/`.

## License

MIT License. See `LICENSE` for details.
