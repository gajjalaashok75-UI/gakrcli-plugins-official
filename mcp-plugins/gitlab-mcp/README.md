# GitLab MCP Plugin

GitLab DevOps platform MCP integration for GAKRCLI.

## What It Does

This plugin connects GAKRCLI to GitLab's MCP endpoint for repository, merge request, issue, wiki, and CI/CD pipeline workflows.

## Installation

```bash
/plugin install gitlab-mcp@gakrcli-plugins-official
```

## MCP Server

The plugin connects to:

```text
https://gitlab.com/api/v4/mcp
```

## Usage

After installing, ask GAKRCLI to use GitLab MCP, for example:

- "Show me open merge requests for this project."
- "Summarize the latest pipeline failure."
- "Create a GitLab issue for this task."

## Files

- `.gakrcli-plugin/plugin.json` - Plugin metadata
- `.mcp.json` - GitLab MCP server configuration
