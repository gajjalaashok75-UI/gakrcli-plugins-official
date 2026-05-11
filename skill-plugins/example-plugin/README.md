# Example Plugin

A comprehensive example plugin demonstrating GAKRCLI plugin structure with all mandatory and optional components.

## Overview

This plugin includes all required and optional components for a complete GAKRCLI plugin.

## Plugin Structure

```
example-plugin/
├── .gakrcli-plugin/
│   └── plugin.json              # MANDATORY: Plugin metadata
├── commands/
│   └── hello.md                 # OPTIONAL: Slash commands
├── agents/
│   └── example-agent.md         # OPTIONAL: Specialized agents
├── skills/
│   └── example-skill/
│       └── SKILL.md             # OPTIONAL: Reusable skills
├── hooks/
│   └── on-save.json             # OPTIONAL: Event-driven automation
├── .mcp.json                    # OPTIONAL: MCP server configuration
├── README.md                    # MANDATORY: Documentation
└── LICENSE                      # MANDATORY: License file
```

## Mandatory Components

### 1. `.gakrcli-plugin/plugin.json`
Plugin metadata including name, description, version, author, and keywords.

**Required fields:**
- `name` - Plugin identifier
- `description` - Plugin description
- `author` - Author information

**Optional fields:**
- `version` - Semantic version
- `keywords` - Search keywords
- `homepage` - Plugin homepage URL

### 2. `README.md`
Comprehensive documentation for the plugin.

**Should include:**
- Overview and features
- Installation instructions
- Usage examples
- Configuration options
- Troubleshooting guide
- File structure
- License information

### 3. `LICENSE`
License file (MIT, Apache 2.0, etc.)

## Optional Components

### 1. Commands (`commands/`)
Custom slash commands for specific workflows.

**File format:** Markdown with YAML front matter
**Example:** `/example:hello`

**Metadata:**
- `name` - Command identifier
- `description` - Command description

### 2. Agents (`agents/`)
Specialized AI agents for targeted tasks.

**File format:** Markdown with YAML front matter
**Metadata:**
- `name` - Agent identifier
- `description` - Agent description
- `role` - Agent role/purpose

### 3. Skills (`skills/`)
Reusable skill definitions for common operations.

**File format:** Markdown with YAML front matter
**Structure:** `skills/{skill-name}/SKILL.md`

**Metadata:**
- `name` - Skill identifier
- `description` - Skill description
- `category` - Skill category

### 4. Hooks (`hooks/`)
Event-driven automation triggers.

**File format:** JSON configuration
**Supported events:**
- `fileEdited` - When files are saved
- `fileCreated` - When files are created
- `fileDeleted` - When files are deleted
- `userTriggered` - Manual trigger
- `promptSubmit` - When message sent
- `agentStop` - When agent completes
- `preToolUse` - Before tool execution
- `postToolUse` - After tool execution
- `preTaskExecution` - Before task starts
- `postTaskExecution` - After task completes

**Actions:**
- `askAgent` - Send message to agent
- `runCommand` - Execute shell command

### 5. `.mcp.json`
MCP server integration configuration.

**Includes:**
- Server command and arguments
- Environment variables
- Auto-approve settings
- Enable/disable toggle

## Installation

```bash
/plugin install example-plugin@gakrcli-plugins-official
```

## Usage

### Commands
```
/example:hello
```

### Agents
```
"Launch example-agent to get help"
```

### Skills
```
"Use example-skill to process data"
```

### Hooks
Automatically triggered on configured events.

## Features

- ✅ Complete plugin structure
- ✅ All mandatory components
- ✅ All optional components
- ✅ Comprehensive documentation
- ✅ Example implementations
- ✅ Best practices included

## Best Practices

1. **Documentation** - Clear and comprehensive
2. **Structure** - Follow standard layout
3. **Naming** - Use kebab-case for identifiers
4. **Versioning** - Follow semantic versioning
5. **Error Handling** - Include proper error messages
6. **Security** - Use environment variables for secrets
7. **Testing** - Test all components
8. **Maintenance** - Keep updated and responsive

## File Reference

### plugin.json
```json
{
  "name": "example-plugin",
  "description": "Plugin description",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "email": "author@example.com"
  },
  "keywords": ["keyword1", "keyword2"],
  "homepage": "https://github.com/example/plugin"
}
```

### Command File (commands/hello.md)
```markdown
---
name: hello
description: Command description
---

# Command Title

Command documentation and usage.
```

### Agent File (agents/example-agent.md)
```markdown
---
name: example-agent
description: Agent description
role: Agent role
---

# Agent Title

Agent instructions and capabilities.
```

### Skill File (skills/example-skill/SKILL.md)
```markdown
---
name: example-skill
description: Skill description
category: category-name
---

# Skill Title

Skill documentation and usage.
```

### Hook File (hooks/on-save.json)
```json
{
  "name": "Hook Name",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint"
  }
}
```

### MCP Config (.mcp.json)
```json
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "KEY": "value"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## Troubleshooting

**Command not appearing?**
- Verify command file exists in `commands/`
- Check YAML front matter format
- Restart GAKRCLI

**Agent not launching?**
- Verify agent file exists in `agents/`
- Check agent metadata
- Review GAKRCLI logs

**Skill not working?**
- Verify skill file exists in `skills/{name}/SKILL.md`
- Check skill metadata
- Ensure dependencies installed

**Hook not triggering?**
- Verify hook file in `hooks/`
- Check event type and patterns
- Review hook configuration

## Support

For questions or issues:
- Check main repository: https://github.com/gakrcli/gakrcli-plugins-official
- Review plugin documentation
- Check GAKRCLI logs

## License

MIT License - See LICENSE file for details

---

**Made with ❤️ by the GAKRCLI Team**
