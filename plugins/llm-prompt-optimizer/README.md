# LLM Prompt Optimizer Plugin

Optimizes prompts for any LLM using proven engineering techniques. Reduces hallucinations, improves consistency, and cuts token usage. Use when prompts fail or need refinement.

## Overview

This plugin packages the `llm-prompt-optimizer` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install llm-prompt-optimizer@gakrcli-plugins-official
```

## Usage

### Command

```text
/llm-prompt-optimizer:use
```

### Agent

Ask GAKRCLI to launch `llm-prompt-optimizer-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/llm-prompt-optimizer/SKILL.md
```

## Plugin Structure

```text
llm-prompt-optimizer/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/llm-prompt-optimizer-agent.md
|-- skills/llm-prompt-optimizer/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/llm-prompt-optimizer/`.

## License

MIT License. See `LICENSE` for details.
