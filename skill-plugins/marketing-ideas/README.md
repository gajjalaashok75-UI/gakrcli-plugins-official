# Marketing Ideas Plugin

Provide proven marketing strategies and growth ideas for SaaS and software products, prioritized using a marketing feasibility scoring system.

## Overview

This plugin packages the `marketing-ideas` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install marketing-ideas@gakrcli-plugins-official
```

## Usage

### Command

```text
/marketing-ideas:use
```

### Agent

Ask GAKRCLI to launch `marketing-ideas-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/marketing-ideas/SKILL.md
```

## Plugin Structure

```text
marketing-ideas/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/marketing-ideas-agent.md
|-- skills/marketing-ideas/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/marketing-ideas/`.

## License

MIT License. See `LICENSE` for details.
