# Google Firebase MCP Plugin

Google Firebase MCP integration for GAKRCLI.

## What It Does

This plugin connects GAKRCLI to Firebase tooling through an MCP server. It can help manage Firebase backend workflows such as Firestore, authentication, cloud functions, hosting, and storage.

## Installation

```bash
/plugin install google-firebase-mcp@gakrcli-plugins-official
```

## MCP Server

The plugin starts Firebase Tools with MCP mode:

```bash
npx -y firebase-tools@latest mcp
```

## Usage

After installing, ask GAKRCLI to use Firebase MCP, for example:

- "Check my Firebase project configuration."
- "Help me inspect Firestore rules."
- "Prepare Firebase hosting deployment steps."

## Files

- `.gakrcli-plugin/plugin.json` - Plugin metadata
- `.mcp.json` - Firebase MCP server configuration
