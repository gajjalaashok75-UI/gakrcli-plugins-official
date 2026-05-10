# Market Research Plugin

Conduct market research, competitive analysis, investor due diligence, and industry intelligence with source attribution and decision-oriented summaries. Use when the user wants market sizing, competitor comparisons, fund research, technology scans, or research that informs business decisions.

## Overview

This plugin packages the `market-research` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install market-research@gakrcli-plugins-official
```

## Usage

### Command

```text
/market-research:use
```

### Agent

Ask GAKRCLI to launch `market-research-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/market-research/SKILL.md
```

## Plugin Structure

```text
market-research/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/market-research-agent.md
|-- skills/market-research/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/market-research/`.

## License

MIT License. See `LICENSE` for details.
