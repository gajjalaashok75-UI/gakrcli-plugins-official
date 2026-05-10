# Hugging Face Cli Plugin

Use the Hugging Face Hub CLI (`hf`) to download, upload, and manage models, datasets, and Spaces.

## Overview

This plugin packages the `hugging-face-cli` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install hugging-face-cli@gakrcli-plugins-official
```

## Usage

### Command

```text
/hugging-face-cli:use
```

### Agent

Ask GAKRCLI to launch `hugging-face-cli-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/hugging-face-cli/SKILL.md
```

## Plugin Structure

```text
hugging-face-cli/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/hugging-face-cli-agent.md
|-- skills/hugging-face-cli/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/hugging-face-cli/`.

## License

MIT License. See `LICENSE` for details.
