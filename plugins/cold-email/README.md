# Cold Email Plugin

Write B2B cold emails and follow-up sequences that earn replies. Use when creating outbound prospecting emails, SDR outreach, personalized opening lines, subject lines, CTAs, and multi-touch follow-up sequences.

## Overview

This plugin packages the `cold-email` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install cold-email@gakrcli-plugins-official
```

## Usage

### Command

```text
/cold-email:use
```

### Agent

Ask GAKRCLI to launch `cold-email-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/cold-email/SKILL.md
```

## Plugin Structure

```text
cold-email/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/cold-email-agent.md
|-- skills/cold-email/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/cold-email/`.

## License

MIT License. See `LICENSE` for details.
