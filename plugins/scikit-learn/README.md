# Scikit Learn Plugin

Machine learning in Python with scikit-learn. Use for classification, regression, clustering, model evaluation, and ML pipelines.

## Overview

This plugin packages the `scikit-learn` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install scikit-learn@gakrcli-plugins-official
```

## Usage

### Command

```text
/scikit-learn:use
```

### Agent

Ask GAKRCLI to launch `scikit-learn-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/scikit-learn/SKILL.md
```

## Plugin Structure

```text
scikit-learn/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/scikit-learn-agent.md
|-- skills/scikit-learn/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/scikit-learn/`.

## License

MIT License. See `LICENSE` for details.
