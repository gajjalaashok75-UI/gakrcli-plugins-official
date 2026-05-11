# GitHub MCP Plugin

Official GitHub MCP integration for GAKRCLI.

## What It Does

This plugin connects GAKRCLI to GitHub's MCP endpoint so it can work with repositories, issues, pull requests, code search, and GitHub API-backed workflows from your terminal session.

## Installation

```bash
/plugin install github-mcp@gakrcli-plugins-official
```

## Configuration

Set a GitHub personal access token before using the plugin:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="your-token"
```

The MCP config sends this token as a bearer token to the GitHub MCP endpoint.

## Usage

After installing, ask GAKRCLI to use GitHub MCP, for example:

- "List open pull requests in this repository."
- "Create a GitHub issue for this bug."
- "Review the latest PR comments and summarize what changed."

## Files

- `.gakrcli-plugin/plugin.json` - Plugin metadata
- `.mcp.json` - GitHub MCP server configuration
