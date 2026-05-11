# Playwright Plugin

Browser automation and end-to-end testing MCP integration for GAKRCLI.

## What It Does

This plugin connects GAKRCLI to Microsoft's Playwright MCP server. It lets GAKRCLI inspect web pages, click elements, fill forms, take screenshots, and help with browser automation or end-to-end testing workflows.

## Installation

```bash
/plugin install playwright@gakrcli-plugins-official
```

## MCP Server

The plugin starts the Playwright MCP server with:

```bash
npx @playwright/mcp@latest
```

## Usage

After installing, ask GAKRCLI to use Playwright for browser tasks, for example:

- "Open this page and check the login flow."
- "Use Playwright to inspect why this button is not clickable."
- "Take a screenshot of the current page and summarize layout issues."

## Files

- `.gakrcli-plugin/plugin.json` - Plugin metadata
- `.mcp.json` - Playwright MCP server configuration
