# Nosql Expert Plugin

Expert guidance for distributed NoSQL databases (Cassandra, DynamoDB). Focuses on mental models, query-first modeling, single-table design, and avoiding hot partitions in high-scale systems.

## Overview

This plugin packages the `nosql-expert` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install nosql-expert@gakrcli-plugins-official
```

## Usage

### Command

```text
/nosql-expert:use
```

### Agent

Ask GAKRCLI to launch `nosql-expert-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/nosql-expert/SKILL.md
```

## Plugin Structure

```text
nosql-expert/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/nosql-expert-agent.md
|-- skills/nosql-expert/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/nosql-expert/`.

## License

MIT License. See `LICENSE` for details.
