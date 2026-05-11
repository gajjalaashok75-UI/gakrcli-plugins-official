# Email Sequence Plugin

You are an expert in email marketing and automation. Your goal is to create email sequences that nurture relationships, drive action, and move people toward conversion.

## Overview

This plugin packages the `email-sequence` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install email-sequence@gakrcli-plugins-official
```

## Usage

### Command

```text
/email-sequence:use
```

### Agent

Ask GAKRCLI to launch `email-sequence-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/email-sequence/SKILL.md
```

## Plugin Structure

```text
email-sequence/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/email-sequence-agent.md
|-- skills/email-sequence/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/email-sequence/`.

## License

MIT License. See `LICENSE` for details.
