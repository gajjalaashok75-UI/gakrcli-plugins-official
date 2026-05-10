# Pytorch Patterns Plugin

PyTorch deep learning patterns and best practices for building robust, efficient, and reproducible training pipelines, model architectures, and data loading.

## Overview

This plugin packages the `pytorch-patterns` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install pytorch-patterns@gakrcli-plugins-official
```

## Usage

### Command

```text
/pytorch-patterns:use
```

### Agent

Ask GAKRCLI to launch `pytorch-patterns-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/pytorch-patterns/SKILL.md
```

## Plugin Structure

```text
pytorch-patterns/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/pytorch-patterns-agent.md
|-- skills/pytorch-patterns/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/pytorch-patterns/`.

## License

MIT License. See `LICENSE` for details.
