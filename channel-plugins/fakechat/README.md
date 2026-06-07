# Fakechat

Localhost web chat channel for testing the GAKRCLI channel contract without an external service. Open a browser, send a message, and replies come back through the fakechat UI.


## Setup

These are GakrCLI commands — run `gakrcli` to start a session first.

Install the plugin:
```
/plugin install fakechat@gakrcli-plugins-official
/reload-plugins
```

**Relaunch with the channel flag** — the server won't connect without this. Exit your session and start a new one:

```sh
gakrcli --channels plugin:fakechat@gakrcli-plugins-official
```

When running from a local GAKRCLI checkout during development, use:

```sh
node dist/cli.mjs --channels plugin:fakechat@gakrcli-plugins-official
```

The server prints the URL to stderr on startup:

```
fakechat: http://localhost:8787
```

Open it. Type. The assistant replies in-thread.

Set `FAKECHAT_PORT` to change the port.

## Tools

| Tool | Purpose |
| --- | --- |
| `reply` | Send to the UI. Takes `text`, optionally `reply_to` (message ID) and `files` (absolute path, 50MB). Attachment shows as `[filename]` under the text. |
| `edit_message` | Edit a previously-sent message in place. |

Inbound images/files save to `~/.gakrcli/channels/fakechat/inbox/` and the path
is included in the notification. Outbound files are copied to `outbox/` and
served over HTTP.

## Not a real channel

There's no history, no search, no access control, no skill. Single browser tab,
fresh on every reload. This is a dev tool, not a messaging bridge.
