# Git Hooks Automation Plugin

Master Git hooks setup with Husky, lint-staged, pre-commit framework, and commitlint. Automate code quality gates, formatting, linting, and commit message enforcement before code reaches CI.

## Overview

This plugin packages the `git-hooks-automation` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install git-hooks-automation@gakrcli-plugins-official
```

## Usage

### Command

```text
/git-hooks-automation:use
```

### Agent

Ask GAKRCLI to launch `git-hooks-automation-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/git-hooks-automation/SKILL.md
```

## Plugin Structure

```text
git-hooks-automation/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/git-hooks-automation-agent.md
|-- skills/git-hooks-automation/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/git-hooks-automation/`.

## License

MIT License. See `LICENSE` for details.
