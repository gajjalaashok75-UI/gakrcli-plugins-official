# AI Engineer Plugin

Build production-ready LLM applications, advanced RAG systems, and intelligent agents. Implements vector search, multimodal AI, agent orchestration, and enterprise AI integrations.

## Overview

This plugin packages the `ai-engineer` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install ai-engineer@gakrcli-plugins-official
```

## Usage

### Command

```text
/ai-engineer:use
```

### Agent

Ask GAKRCLI to launch `ai-engineer-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/ai-engineer/SKILL.md
```

## Plugin Structure

```text
ai-engineer/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/ai-engineer-agent.md
|-- skills/ai-engineer/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/ai-engineer/`.

## License

MIT License. See `LICENSE` for details.
