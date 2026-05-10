# Mlops Engineer Plugin

Build comprehensive ML pipelines, experiment tracking, and model registries with MLflow, Kubeflow, and modern MLOps tools. Focuses on automation, scalability, and reliability in production ML systems.

## Overview

This plugin packages the `mlops-engineer` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install mlops-engineer@gakrcli-plugins-official
```

## Usage

### Command

```text
/mlops-engineer:use
```

### Agent

Ask GAKRCLI to launch `mlops-engineer-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/mlops-engineer/SKILL.md
```

## Plugin Structure

```text
mlops-engineer/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/mlops-engineer-agent.md
|-- skills/mlops-engineer/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/mlops-engineer/`.

## License

MIT License. See `LICENSE` for details.
