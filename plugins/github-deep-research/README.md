# Github Deep Research Plugin

Conduct multi-round deep research on any GitHub Repo. Use when users request comprehensive analysis, timeline reconstruction, competitive analysis, or in-depth investigation of GitHub. Produces structured markdown reports with executive summaries, chronological timelines, metrics analysis, and Mermaid diagrams. Triggers on Github repository URL or open source projects.

## Overview

This plugin packages the `github-deep-research` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install github-deep-research@gakrcli-plugins-official
```

## Usage

### Command

```text
/github-deep-research:use
```

### Agent

Ask GAKRCLI to launch `github-deep-research-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/github-deep-research/SKILL.md
```

## Plugin Structure

```text
github-deep-research/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/github-deep-research-agent.md
|-- skills/github-deep-research/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/github-deep-research/`.

## License

MIT License. See `LICENSE` for details.
