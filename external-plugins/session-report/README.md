# Session Report Plugin

Generate a self-contained HTML usage report for local GAKRCLI session transcripts.

## What It Does

This plugin analyzes GAKRCLI transcript data from `~/.gakrcli/projects` and builds an interactive report with token usage, cache behavior, subagent activity, skill usage, expensive prompts, and optimization suggestions.

## Installation

```bash
/plugin install session-report@gakrcli-plugins-official
```

## Usage

After installing, ask GAKRCLI to generate a session report:

```text
Use session-report for the last 7 days.
```

You can also request a different range, such as `24h`, `30d`, or `all`.

## Files

- `.gakrcli-plugin/plugin.json` - Plugin metadata
- `skills/session-report/SKILL.md` - Skill instructions
- `skills/session-report/analyze-sessions.mjs` - Transcript analyzer
- `skills/session-report/template.html` - HTML report template
