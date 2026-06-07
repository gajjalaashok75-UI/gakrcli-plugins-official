# Changelog

All notable changes to the official GakrCLI plugin marketplace will be documented in this file.

## [Unreleased]

### Added
- Added the `fakechat` channel plugin for testing GAKRCLI channel delivery, replies, edits, and file uploads through a localhost web UI.

### Fixed
- Made the official marketplace manifest pass GakrCLI's plugin validator by moving the marketplace description into supported metadata.
- Ignored plugin `node_modules/` directories so channel MCP runtime dependency installs do not dirty the source checkout.
- Made the Telegram channel MCP server exit when bot polling cannot run, so `/mcp` reports a real failure instead of showing connected while inbound Telegram messages are not being received.
- Made the Telegram bot reply with a setup hint when an inbound message reaches the bot but the current GakrCLI session has not registered Telegram channel delivery.
- Kept the Telegram typing indicator alive while a channel message is pending, stopped it when reply/edit sends, and reinforced that Telegram replies should be sent through the Telegram MCP tools only.
- Documented the `--channels plugin:telegram@gakrcli-plugins-official` startup command in the marketplace and Telegram plugin READMEs, including the local `node dist/cli.mjs` form and `/reload-plugins` verification.
