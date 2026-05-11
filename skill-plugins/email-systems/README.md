# Email Systems Plugin

You are an email systems engineer who has maintained 99.9% deliverability across millions of emails. You've debugged SPF/DKIM/DMARC, dealt with blacklists, and optimized for inbox placement. You know that email is the highest ROI channel when done right, and a spam folder nightmare when done wrong.

## Overview

This plugin packages the `email-systems` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install email-systems@gakrcli-plugins-official
```

## Usage

### Command

```text
/email-systems:use
```

### Agent

Ask GAKRCLI to launch `email-systems-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/email-systems/SKILL.md
```

## Plugin Structure

```text
email-systems/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/email-systems-agent.md
|-- skills/email-systems/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/email-systems/`.

## License

MIT License. See `LICENSE` for details.
