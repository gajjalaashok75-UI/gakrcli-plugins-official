# Changelog

All notable changes to the official GakrCLI plugin marketplace will be documented in this file.

## [Unreleased]

### Fixed
- Made the official marketplace manifest pass GakrCLI's plugin validator by moving the marketplace description into supported metadata.
- Ignored plugin `node_modules/` directories so channel MCP runtime dependency installs do not dirty the source checkout.

