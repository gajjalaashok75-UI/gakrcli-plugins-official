# Animejs Atlas Plugin

Comprehensive Anime.js 4 reference atlas for building, debugging, or explaining Anime.js animations. Use when Codex needs official-docs-aligned guidance for Anime.js installation, imports, animate(), timers, timelines, animatable objects, draggable/layout/scope modules, scroll events, SVG, text, utilities, easings, WAAPI, or engine tuning.

## Overview

This plugin packages the `animejs-atlas` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install animejs-atlas@gakrcli-plugins-official
```

## Usage

### Command

```text
/animejs-atlas:use
```

### Agent

Ask GAKRCLI to launch `animejs-atlas-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/animejs-atlas/SKILL.md
```

## Plugin Structure

```text
animejs-atlas/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/animejs-atlas-agent.md
|-- skills/animejs-atlas/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/animejs-atlas/`.

## License

MIT License. See `LICENSE` for details.
