# Langchain Architecture Plugin

Master the LangChain framework for building sophisticated LLM applications with agents, chains, memory, and tool integration.

## Overview

This plugin packages the `langchain-architecture` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install langchain-architecture@gakrcli-plugins-official
```

## Usage

### Command

```text
/langchain-architecture:use
```

### Agent

Ask GAKRCLI to launch `langchain-architecture-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/langchain-architecture/SKILL.md
```

## Plugin Structure

```text
langchain-architecture/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/langchain-architecture-agent.md
|-- skills/langchain-architecture/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/langchain-architecture/`.

## License

MIT License. See `LICENSE` for details.
