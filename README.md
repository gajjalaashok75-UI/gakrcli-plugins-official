# GAKRCLI Plugins Official

A curated directory of high-quality plugins for GAKRCLI - the next-generation AI-powered development environment.

> **⚠️ Important:** Make sure you trust a plugin before installing, updating, or using it. Always review plugin source code and verify the publisher. GAKRCLI does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change. See each plugin's homepage for more information.

## 📊 Marketplace Stats

- **0 Plugins** available
- **0 Internal Plugins** - Developed and maintained by GAKRCLI team
- **0 External Plugins** - Community and partner contributions
- **JSON Schema Validated** - All plugins follow strict validation rules

## 📁 Repository Structure

- **`/plugins`** - Internal plugins developed and maintained by GAKRCLI team
- **`/external_plugins`** - Third-party plugins from partners and the community
- **`/schemas`** - JSON Schema for marketplace validation
- **`.gakrcli-plugin/`** - Marketplace configuration and plugin registry

## 🚀 Installation

Plugins can be installed directly from this marketplace via GAKRCLI's plugin system.

### Install via Command
```bash
/plugin install {plugin-name}@gakrcli-plugins-official
```

### Install via UI
Browse and install plugins through the GAKRCLI interface:
```
/plugin > Discover > Search for plugin
```

## 🤝 Contributing

We welcome contributions from the community! 

### Internal Plugins

Internal plugins are developed by GAKRCLI team members. See `/plugins/example-plugin` for a reference implementation.

### External Plugins

Third-party developers can submit plugins for inclusion in the marketplace. External plugins must meet quality and security standards for approval.

**Submission Requirements:**
- Follow the standard plugin structure
- Include comprehensive documentation
- Pass JSON schema validation
- Provide clear installation instructions
- Include proper licensing information

To submit a plugin:
1. Fork this repository
2. Add your plugin to `/external_plugins/{your-plugin-name}`
3. Update `.gakrcli-plugin/marketplace.json`
4. Submit a pull request

### Development Resources

- **Plugin Development Guide**: `/plugins/plugin-dev`
- **Example Plugin**: `/plugins/example-plugin`
- **Schema Reference**: `/schemas/gakrcli-marketplace.schema.json`

## 📦 Plugin Structure

Each plugin follows a standard structure:

```
plugin-name/
├── .gakrcli-plugin/
│   └── plugin.json      # Plugin metadata (required)
├── .mcp.json            # MCP server configuration (optional)
├── commands/            # Slash commands (optional)
├── agents/              # Agent definitions (optional)
├── skills/              # Skill definitions (optional)
├── hooks/               # Event hooks (optional)
├── LICENSE              # License file (required)
└── README.md            # Documentation (required)
```

### Required Files

- **`.gakrcli-plugin/plugin.json`** - Plugin metadata and configuration
- **`README.md`** - Plugin documentation
- **`LICENSE`** - License information

### Optional Components

- **`commands/`** - Custom slash commands
- **`agents/`** - Specialized AI agents
- **`skills/`** - Reusable skill definitions
- **`hooks/`** - Event-driven automation
- **`.mcp.json`** - MCP server integration

## 📋 Marketplace Schema

This repository uses a JSON Schema to validate the marketplace configuration:

- **Schema Location**: `schemas/gakrcli-marketplace.schema.json`
- **Marketplace Config**: `.gakrcli-plugin/marketplace.json`

The schema validates:
- Plugin metadata (name, description, version)
- Source types (local, git URL, git subdirectory)
- Categories and tags
- Author information
- LSP server configurations

## 🔍 Plugin Categories

- **Development** - Development tools and workflows
- **Productivity** - Productivity enhancers and utilities
- **Security** - Security scanning and analysis
- **Database** - Database management and tools
- **Deployment** - Deployment and infrastructure
- **Monitoring** - Monitoring and observability
- **Design** - Design and UI tools
- **Learning** - Educational and learning resources

## 📚 Documentation

- **Plugin Development**: See `/plugins/plugin-dev` for comprehensive guides
- **MCP Integration**: See `/plugins/mcp-server-dev` for MCP server development
- **Skill Creation**: See `/plugins/skill-creator` for skill development
- **Example Plugin**: See `/plugins/example-plugin` for reference implementation

## 🔗 Links

- **Repository**: https://github.com/gajjalaashok75-UI/gakrcli-plugins-official
- **Issues**: https://github.com/gajjalaashok75-UI/gakrcli-plugins-official/issues
- **Discussions**: https://github.com/gajjalaashok75-UI/gakrcli-plugins-official/discussions

## 📄 License

Please see each plugin's LICENSE file for specific licensing information. Most plugins use MIT or Apache 2.0 licenses.

## 🆘 Support

For support and questions:
- **Email**: support@gakrcli.com
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check plugin-specific README files

---

**Made with ❤️ by the GAKRCLI Team**
