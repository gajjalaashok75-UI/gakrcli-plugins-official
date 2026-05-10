# GAKRCLI Plugins Official

A curated directory of high-quality plugins for GAKRCLI, the next-generation AI-powered development environment.

> Important: Make sure you trust a plugin before installing, updating, or using it. Always review plugin source code and verify the publisher.

## What Is GAKRCLI?

GAKRCLI is a terminal-first AI coding agent for running powerful LLM workflows directly from your command line. It supports OpenAI, Anthropic, Gemini, DeepSeek, Ollama, GitHub Models, and many OpenAI-compatible providers while keeping one workflow for prompts, tools, agents, MCP servers, slash commands, skills, plugins, and streaming output.

The packaged command is `gakrcli`, and the recommended install is:

```bash
npm install -g @gakr-gakr/gakrcli
```

Then start it with:

```bash
gakrcli
```

Requirements: Node.js 20 or newer, plus `ripgrep` / `rg` in your PATH. The main GAKRCLI source repository is [gajjalaashok75-UI/GakrCLI](https://github.com/gajjalaashok75-UI/GakrCLI).

## Marketplace Stats

- **66 plugins** available
- **66 internal plugins** maintained in this repository
- **0 external plugins** currently listed
- Marketplace metadata is tracked in `.gakrcli-plugin/marketplace.json`

## How To Use

Install any plugin from this marketplace with:

```bash
/plugin install {plugin-name}@gakrcli-plugins-official
```

Examples:

```bash
/plugin install example-plugin@gakrcli-plugins-official
/plugin install ai-engineer@gakrcli-plugins-official
/plugin install vercel-deploy@gakrcli-plugins-official
```

Most generated skill plugins include the same entry points:

- Command: `/{plugin-name}:use`
- Agent: `{plugin-name}-agent`
- Skill file: `skills/{plugin-name}/SKILL.md`

Example after installing `ai-engineer`:

```text
/ai-engineer:use
```

You can also ask GAKRCLI to use the installed skill or launch the matching agent by name.

## Repository Structure

- `/plugins` - Internal plugins and generated skill plugins
- `/schemas` - JSON Schema for marketplace validation
- `.gakrcli-plugin/` - Marketplace configuration and plugin registry
- `/souls` - Source material used to generate the skill plugins

Each plugin follows this layout:

```text
plugin-name/
|-- .gakrcli-plugin/
|   `-- plugin.json
|-- commands/
|-- agents/
|-- skills/
|-- hooks/
|-- .mcp.json
|-- LICENSE
`-- README.md
```

Required files are `.gakrcli-plugin/plugin.json`, `README.md`, and `LICENSE`. Commands, agents, skills, hooks, and MCP configuration are optional.

## Plugin Catalog

### Development

- `example-plugin` - Reference implementation showing the complete plugin structure.
- `ai-engineer`
- `blockchain-developer`
- `coding-standards`
- `data-engineer`
- `data-storytelling`
- `game-development`
- `hugging-face-cli`
- `hugging-face-dataset-viewer`
- `landing-page-generator`
- `langchain-architecture`
- `llm-app-patterns`
- `llm-prompt-optimizer`
- `makepad-atlas`
- `pytorch-patterns`
- `rust-pro`
- `scikit-learn`

### Documentation And Content

- `animejs-atlas`
- `article-writing`
- `cold-email`
- `content-atlas`
- `customer-support`
- `docs-architect`
- `email-sequence`
- `email-systems`
- `graphify-windows`
- `image-generation`
- `marketing-ideas`
- `marketing-psychology`
- `plotly`
- `podcast-generation`
- `ppt-generation`
- `product-atlas`
- `video-generation`

### Design And Visualization

- `brainstorming`
- `chart-visualization`
- `consulting-analysis`
- `gakrcli-d3js-skill`
- `github-deep-research`
- `kpi-dashboard-design`
- `langgraph`
- `matplotlib`
- `mermaid-expert`
- `seaborn`
- `stitch-ui-design`
- `threejs-atlas`

### Deployment And Automation

- `cloudflare-workers-expert`
- `git-hooks-automation`
- `mlops-engineer`
- `ml-pipeline-workflow`
- `vercel-ai-sdk-expert`
- `vercel-automation`
- `vercel-deploy`

### Security

- `ethical-hacking-methodology`
- `linux-shell-scripting`
- `malware-analyst`
- `network-engineer`

### Database And Data Platforms

- `hugging-face-datasets`
- `nosql-expert`
- `vector-database-engineer`

### Monitoring

- `business-analyst`
- `langfuse`

### Productivity And Business

- `data-scientist`
- `legal-advisor`
- `market-research`
- `startup-analyst`

For full plugin descriptions, source paths, keywords, and categories, see `.gakrcli-plugin/marketplace.json`.

## Contributing

1. Fork this repository.
2. Add your plugin under `/plugins/{plugin-name}` or `/external_plugins/{plugin-name}`.
3. Include `.gakrcli-plugin/plugin.json`, `README.md`, and `LICENSE`.
4. Update `.gakrcli-plugin/marketplace.json`.
5. Validate the marketplace JSON against `schemas/gakrcli-marketplace.schema.json`.
6. Submit a pull request.

Use `/plugins/example-plugin` as the reference implementation.

## License

Please see each plugin's `LICENSE` file for specific licensing information.

## Support

- Repository: https://github.com/gajjalaashok75-UI/gakrcli-plugins-official
- Issues: https://github.com/gajjalaashok75-UI/gakrcli-plugins-official/issues
- Discussions: https://github.com/gajjalaashok75-UI/gakrcli-plugins-official/discussions
