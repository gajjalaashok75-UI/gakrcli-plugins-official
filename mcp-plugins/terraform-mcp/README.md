# Terraform MCP Plugin

Terraform MCP integration for GAKRCLI.

## What It Does

This plugin connects GAKRCLI to HashiCorp's Terraform MCP server. It supports Infrastructure as Code workflows around Terraform automation, inspection, and Terraform Enterprise or HCP Terraform integration.

## Installation

```bash
/plugin install terraform-mcp@gakrcli-plugins-official
```

## Configuration

Set your Terraform token before using the plugin:

```bash
export TFE_TOKEN="your-token"
```

## MCP Server

The plugin runs the Terraform MCP server through Docker:

```bash
docker run -i --rm -e TFE_TOKEN=${TFE_TOKEN} hashicorp/terraform-mcp-server:0.4.0
```

## Usage

After installing, ask GAKRCLI to use Terraform MCP, for example:

- "Inspect this Terraform module."
- "Help me understand the Terraform plan."
- "Check Terraform Enterprise workspace details."

## Files

- `.gakrcli-plugin/plugin.json` - Plugin metadata
- `.mcp.json` - Terraform MCP server configuration
