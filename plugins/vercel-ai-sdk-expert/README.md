# Vercel AI Sdk Expert Plugin

Expert in the Vercel AI SDK. Covers Core API (generateText, streamText), UI hooks (useChat, useCompletion), tool calling, and streaming UI components with React and Next.js.

## Overview

This plugin packages the `vercel-ai-sdk-expert` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install vercel-ai-sdk-expert@gakrcli-plugins-official
```

## Usage

### Command

```text
/vercel-ai-sdk-expert:use
```

### Agent

Ask GAKRCLI to launch `vercel-ai-sdk-expert-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/vercel-ai-sdk-expert/SKILL.md
```

## Plugin Structure

```text
vercel-ai-sdk-expert/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/vercel-ai-sdk-expert-agent.md
|-- skills/vercel-ai-sdk-expert/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/vercel-ai-sdk-expert/`.

## License

MIT License. See `LICENSE` for details.
