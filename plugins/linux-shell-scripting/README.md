# Linux Shell Scripting Plugin

Provide production-ready shell script templates for common Linux system administration tasks including backups, monitoring, user management, log analysis, and automation. These scripts serve as building blocks for security operations and penetration testing environments.

## Overview

This plugin packages the `linux-shell-scripting` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install linux-shell-scripting@gakrcli-plugins-official
```

## Usage

### Command

```text
/linux-shell-scripting:use
```

### Agent

Ask GAKRCLI to launch `linux-shell-scripting-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/linux-shell-scripting/SKILL.md
```

## Plugin Structure

```text
linux-shell-scripting/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/linux-shell-scripting-agent.md
|-- skills/linux-shell-scripting/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/linux-shell-scripting/`.

## License

MIT License. See `LICENSE` for details.
