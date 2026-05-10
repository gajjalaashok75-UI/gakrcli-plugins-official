# Coding Standards Plugin

Universal coding standards, best practices, and patterns for TypeScript, JavaScript, React, and Node.js development.

## Overview

This plugin packages the `coding-standards` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install coding-standards@gakrcli-plugins-official
```

## Usage

### Command

```text
/coding-standards:use
```

### Agent

Ask GAKRCLI to launch `coding-standards-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/coding-standards/SKILL.md
```

## Plugin Structure

```text
coding-standards/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/coding-standards-agent.md
|-- skills/coding-standards/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/coding-standards/`.

## License

MIT License. See `LICENSE` for details.
