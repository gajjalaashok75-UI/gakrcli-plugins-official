# Stitch UI Design Plugin

Expert guidance for crafting effective prompts in Google Stitch, the AI-powered UI design tool by Google Labs. This skill helps create precise, actionable prompts that generate high-quality UI designs for web and mobile applications.

## Overview

This plugin packages the `stitch-ui-design` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install stitch-ui-design@gakrcli-plugins-official
```

## Usage

### Command

```text
/stitch-ui-design:use
```

### Agent

Ask GAKRCLI to launch `stitch-ui-design-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/stitch-ui-design/SKILL.md
```

## Plugin Structure

```text
stitch-ui-design/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/stitch-ui-design-agent.md
|-- skills/stitch-ui-design/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/stitch-ui-design/`.

## License

MIT License. See `LICENSE` for details.
