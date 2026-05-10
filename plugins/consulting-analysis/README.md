# Consulting Analysis Plugin

Use this skill when the user requests to generate, create, or write professional research reports including but not limited to market analysis, consumer insights, brand analysis, financial analysis, industry research, competitive intelligence, investment due diligence, or any consulting-grade analytical report. This skill operates in two phases - (1) generating a structured analysis framework with chapter skeleton, data query requirements, and analysis logic, and (2) after data collection by other skills, producing the final consulting-grade report with structured narratives, embedded charts, and strategic insights.

## Overview

This plugin packages the `consulting-analysis` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install consulting-analysis@gakrcli-plugins-official
```

## Usage

### Command

```text
/consulting-analysis:use
```

### Agent

Ask GAKRCLI to launch `consulting-analysis-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/consulting-analysis/SKILL.md
```

## Plugin Structure

```text
consulting-analysis/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/consulting-analysis-agent.md
|-- skills/consulting-analysis/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/consulting-analysis/`.

## License

MIT License. See `LICENSE` for details.
