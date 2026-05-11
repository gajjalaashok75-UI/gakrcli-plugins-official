# Vector Database Engineer Plugin

Expert in vector databases, embedding strategies, and semantic search implementation. Masters Pinecone, Weaviate, Qdrant, Milvus, and pgvector for RAG applications, recommendation systems, and similar

## Overview

This plugin packages the `vector-database-engineer` skill from the souls library as a first-class GAKRCLI marketplace plugin.

## Installation

```bash
/plugin install vector-database-engineer@gakrcli-plugins-official
```

## Usage

### Command

```text
/vector-database-engineer:use
```

### Agent

Ask GAKRCLI to launch `vector-database-engineer-agent` when you want focused help with this skill's workflow.

### Skill

The skill is available at:

```text
skills/vector-database-engineer/SKILL.md
```

## Plugin Structure

```text
vector-database-engineer/
|-- .gakrcli-plugin/plugin.json
|-- commands/use.md
|-- agents/vector-database-engineer-agent.md
|-- skills/vector-database-engineer/SKILL.md
|-- README.md
`-- LICENSE
```

Some skills include additional references, scripts, assets, or nested skill files under `skills/vector-database-engineer/`.

## License

MIT License. See `LICENSE` for details.
