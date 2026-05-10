# Seaborn Plugin

Seaborn is a Python visualization library for creating publication-quality statistical graphics. Use this skill for dataset-oriented plotting, multivariate analysis, automatic statistical estimation, and complex multi-panel figures with minimal code.

## Overview

This plugin packages the `seaborn` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install seaborn@gakrcli-plugins-official
```

## Usage

### Command

```text
/seaborn:use
```

### Agent

Ask GAKRCLI to launch `seaborn-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/seaborn/SKILL.md
```

## Plugin Structure

```text
seaborn/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/seaborn-agent.md
|-- skills/seaborn/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/seaborn/`.

## License

MIT License. See `LICENSE` for details.
