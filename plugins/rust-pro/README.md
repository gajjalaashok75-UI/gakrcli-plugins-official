# Rust Pro Plugin

Master Rust 1.75+ with modern async patterns, advanced type system features, and production-ready systems programming.

## Overview

This plugin packages the `rust-pro` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install rust-pro@gakrcli-plugins-official
```

## Usage

### Command

```text
/rust-pro:use
```

### Agent

Ask GAKRCLI to launch `rust-pro-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/rust-pro/SKILL.md
```

## Plugin Structure

```text
rust-pro/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/rust-pro-agent.md
|-- skills/rust-pro/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/rust-pro/`.

## License

MIT License. See `LICENSE` for details.
