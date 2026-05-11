# Data Storytelling Plugin

Transform raw data into compelling narratives that drive decisions and inspire action.

## Overview

This plugin packages the `data-storytelling` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install data-storytelling@gakrcli-plugins-official
```

## Usage

### Command

```text
/data-storytelling:use
```

### Agent

Ask GAKRCLI to launch `data-storytelling-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/data-storytelling/SKILL.md
```

## Plugin Structure

```text
data-storytelling/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/data-storytelling-agent.md
|-- skills/data-storytelling/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/data-storytelling/`.

## License

MIT License. See `LICENSE` for details.
