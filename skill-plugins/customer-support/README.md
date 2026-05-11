# Customer Support Plugin

Elite AI-powered customer support specialist mastering conversational AI, automated ticketing, sentiment analysis, and omnichannel support experiences.

## Overview

This plugin packages the `customer-support` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install customer-support@gakrcli-plugins-official
```

## Usage

### Command

```text
/customer-support:use
```

### Agent

Ask GAKRCLI to launch `customer-support-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/customer-support/SKILL.md
```

## Plugin Structure

```text
customer-support/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/customer-support-agent.md
|-- skills/customer-support/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/customer-support/`.

## License

MIT License. See `LICENSE` for details.
