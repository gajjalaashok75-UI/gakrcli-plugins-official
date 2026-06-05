# Changelog

All notable changes to the official GakrCLI plugin marketplace will be documented in this file.

## [Unreleased]

### Fixed
- Made the official marketplace manifest pass GakrCLI's plugin validator by moving the marketplace description into supported metadata.
- Ignored plugin `node_modules/` directories so channel MCP runtime dependency installs do not dirty the source checkout.
- Made the Telegram channel MCP server exit when bot polling cannot run, so `/mcp` reports a real failure instead of showing connected while inbound Telegram messages are not being received.
- Made the Telegram bot reply with a setup hint when an inbound message reaches the bot but the current GakrCLI session has not registered Telegram channel delivery.
