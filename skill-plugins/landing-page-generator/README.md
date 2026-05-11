# Landing Page Generator Plugin

Generates high-converting Next.js/React landing pages with Tailwind CSS. Uses PAS, AIDA, and BAB frameworks for optimized copy/components (Heroes, Features, Pricing). Focuses on Core Web Vitals/SEO.

## Overview

This plugin packages the `landing-page-generator` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install landing-page-generator@gakrcli-plugins-official
```

## Usage

### Command

```text
/landing-page-generator:use
```

### Agent

Ask GAKRCLI to launch `landing-page-generator-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/landing-page-generator/SKILL.md
```

## Plugin Structure

```text
landing-page-generator/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/landing-page-generator-agent.md
|-- skills/landing-page-generator/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/landing-page-generator/`.

## License

MIT License. See `LICENSE` for details.
