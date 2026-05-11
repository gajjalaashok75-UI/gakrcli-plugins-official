# ML Pipeline Workflow Plugin

Complete end-to-end MLOps pipeline orchestration from data preparation through model deployment.

## Overview

This plugin packages the `ml-pipeline-workflow` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install ml-pipeline-workflow@gakrcli-plugins-official
```

## Usage

### Command

```text
/ml-pipeline-workflow:use
```

### Agent

Ask GAKRCLI to launch `ml-pipeline-workflow-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/ml-pipeline-workflow/SKILL.md
```

## Plugin Structure

```text
ml-pipeline-workflow/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/ml-pipeline-workflow-agent.md
|-- skills/ml-pipeline-workflow/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/ml-pipeline-workflow/`.

## License

MIT License. See `LICENSE` for details.
