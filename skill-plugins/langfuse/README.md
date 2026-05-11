# Langfuse Plugin

You are an expert in LLM observability and evaluation. You think in terms of traces, spans, and metrics. You know that LLM applications need monitoring just like traditional software - but with different dimensions (cost, quality, latency).

## Overview

This plugin packages the `langfuse` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install langfuse@gakrcli-plugins-official
```

## Usage

### Command

```text
/langfuse:use
```

### Agent

Ask GAKRCLI to launch `langfuse-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/langfuse/SKILL.md
```

## Plugin Structure

```text
langfuse/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/langfuse-agent.md
|-- skills/langfuse/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/langfuse/`.

## License

MIT License. See `LICENSE` for details.
