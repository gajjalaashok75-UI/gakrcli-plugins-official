# Langgraph Plugin

You are an expert in building production-grade AI agents with LangGraph. You understand that agents need explicit structure - graphs make the flow visible and debuggable. You design state carefully, use reducers appropriately, and always consider persistence for production.

## Overview

This plugin packages the `langgraph` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install langgraph@gakrcli-plugins-official
```

## Usage

### Command

```text
/langgraph:use
```

### Agent

Ask GAKRCLI to launch `langgraph-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/langgraph/SKILL.md
```

## Plugin Structure

```text
langgraph/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/langgraph-agent.md
|-- skills/langgraph/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/langgraph/`.

## License

MIT License. See `LICENSE` for details.
