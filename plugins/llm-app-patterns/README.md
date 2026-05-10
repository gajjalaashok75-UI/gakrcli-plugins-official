# LLM App Patterns Plugin

Production-ready patterns for building LLM applications, inspired by [Dify](https://github.com/langgenius/dify) and industry best practices.

## Overview

This plugin packages the `llm-app-patterns` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install llm-app-patterns@gakrcli-plugins-official
```

## Usage

### Command

```text
/llm-app-patterns:use
```

### Agent

Ask GAKRCLI to launch `llm-app-patterns-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/llm-app-patterns/SKILL.md
```

## Plugin Structure

```text
llm-app-patterns/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/llm-app-patterns-agent.md
|-- skills/llm-app-patterns/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/llm-app-patterns/`.

## License

MIT License. See `LICENSE` for details.
