# Threejs Atlas Plugin

Comprehensive Three.js orchestrator. Covers 3D graphics, WebGL, animations, materials, shaders, and Three.js development. Use when building 3D web experiences.

## Overview

This plugin packages the `threejs-atlas` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install threejs-atlas@gakrcli-plugins-official
```

## Usage

### Command

```text
/threejs-atlas:use
```

### Agent

Ask GAKRCLI to launch `threejs-atlas-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/threejs-atlas/SKILL.md
```

## Plugin Structure

```text
threejs-atlas/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/threejs-atlas-agent.md
|-- skills/threejs-atlas/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/threejs-atlas/`.

## License

MIT License. See `LICENSE` for details.
