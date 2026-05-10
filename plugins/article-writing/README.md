# Article Writing Plugin

Write articles, guides, blog posts, tutorials, newsletter issues, and other long-form content in a distinctive voice derived from supplied examples or brand guidance. Use when the user wants polished written content longer than a paragraph, especially when voice consistency, structure, and credibility matter.

## Overview

This plugin packages the `article-writing` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install article-writing@gakrcli-plugins-official
```

## Usage

### Command

```text
/article-writing:use
```

### Agent

Ask GAKRCLI to launch `article-writing-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/article-writing/SKILL.md
```

## Plugin Structure

```text
article-writing/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/article-writing-agent.md
|-- skills/article-writing/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/article-writing/`.

## License

MIT License. See `LICENSE` for details.
