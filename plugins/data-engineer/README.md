# Data Engineer Plugin

Build scalable data pipelines, modern data warehouses, and real-time streaming architectures. Implements Apache Spark, dbt, Airflow, and cloud-native data platforms.

## Overview

This plugin packages the `data-engineer` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install data-engineer@gakrcli-plugins-official
```

## Usage

### Command

```text
/data-engineer:use
```

### Agent

Ask GAKRCLI to launch `data-engineer-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/data-engineer/SKILL.md
```

## Plugin Structure

```text
data-engineer/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/data-engineer-agent.md
|-- skills/data-engineer/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/data-engineer/`.

## License

MIT License. See `LICENSE` for details.
