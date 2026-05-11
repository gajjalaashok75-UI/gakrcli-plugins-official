# Cloudflare Workers Expert Plugin

Expert in Cloudflare Workers and the Edge Computing ecosystem. Covers Wrangler, KV, D1, Durable Objects, and R2 storage.

## Overview

This plugin packages the `cloudflare-workers-expert` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install cloudflare-workers-expert@gakrcli-plugins-official
```

## Usage

### Command

```text
/cloudflare-workers-expert:use
```

### Agent

Ask GAKRCLI to launch `cloudflare-workers-expert-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/cloudflare-workers-expert/SKILL.md
```

## Plugin Structure

```text
cloudflare-workers-expert/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/cloudflare-workers-expert-agent.md
|-- skills/cloudflare-workers-expert/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/cloudflare-workers-expert/`.

## License

MIT License. See `LICENSE` for details.
