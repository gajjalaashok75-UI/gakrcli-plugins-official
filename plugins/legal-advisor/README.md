# Legal Advisor Plugin

Draft privacy policies, terms of service, disclaimers, and legal notices. Creates GDPR-compliant texts, cookie policies, and data processing agreements.

## Overview

This plugin packages the `legal-advisor` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install legal-advisor@gakrcli-plugins-official
```

## Usage

### Command

```text
/legal-advisor:use
```

### Agent

Ask GAKRCLI to launch `legal-advisor-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/legal-advisor/SKILL.md
```

## Plugin Structure

```text
legal-advisor/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/legal-advisor-agent.md
|-- skills/legal-advisor/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/legal-advisor/`.

## License

MIT License. See `LICENSE` for details.
