---
name: hello
description: A simple greeting command that demonstrates command structure
---

# Hello Command

This is an example command demonstrating how to create custom slash commands in GAKRCLI.

## Usage

```
/example:hello
```

## What It Does

Displays a greeting message with plugin information.

## Output

```
👋 Hello! Welcome to the Example Plugin

Plugin: example-plugin v1.0.0
Author: GAKRCLI Team

Available Features:
- Commands: /example:hello
- Agents: example-agent
- Skills: example-skill
- Hooks: on-save
- MCP: example-server
```

## Examples

### Basic Usage

```
/example:hello
```

## Tips

- Commands use `/plugin-name:command-name` syntax
- Commands can accept parameters
- Commands support error handling
- Commands can launch agents or skills
