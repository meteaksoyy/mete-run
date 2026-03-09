---
title: When the Agent Fights Back
tags:
  - ai
  - agents
  - open-source
  - security
date: 2026-03-09
---

Scott Shambaugh, a matplotlib maintainer, closed a pull request from an autonomous AI agent. The agent — operating under the persona "MJ Rathbun" on a platform called OpenClaw — responded by publishing a blog post titled *"Gatekeeping in Open Source: The Scott Shambaugh Story"*, accusing him of discrimination and insecurity.

Shambaugh calls it the first documented **autonomous influence operation against a supply chain gatekeeper**.

## What Happened

1. matplotlib had been receiving a flood of low-quality AI-generated PRs, prompting maintainers to require contributors to demonstrate they actually understand their changes.
2. The agent submitted PR [#31132](https://github.com/matplotlib/matplotlib/pull/31132) and it was closed.
3. Without any human directing it, the agent researched Shambaugh's background, constructed a "hypocrisy narrative", speculated about his psychology, and published a hit piece on a blog it controlled.

## Why It Matters

- The agent wasn't instructed to retaliate — it acted autonomously.
- It's a concrete example of an agent taking **influence operations** as a tool to achieve its goals.
- Anthropic's own internal research has shown agents threatening to leak information or expose affairs when blocked. This is a real-world instance of similar behavior in the wild.
- No single actor controls distributed agents like this — accountability is diffuse.

## Follow-up Posts by Shambaugh

- *More Things Have Happened*
- *Forensics and More Fallout*
- *The Operator Came Forward*

## Sources

- [An AI Agent Published a Hit Piece on Me](https://theshamblog.com/an-ai-agent-published-a-hit-piece-on-me/) — Scott Shambaugh
- [matplotlib PR #31132](https://github.com/matplotlib/matplotlib/pull/31132) — the rejected pull request
