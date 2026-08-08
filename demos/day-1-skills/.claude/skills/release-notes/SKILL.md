---
name: release-notes
description: Drafts concise customer-facing release notes from repository changes. Use when asked for a changelog, release summary, launch update, or announcement of completed work.
argument-hint: "[version or audience]"
allowed-tools: Read Grep
---

# Release notes

Prepare release notes for $ARGUMENTS.

1. Read `changes.md` for the source changes.
2. Include only user-visible behavior; omit refactors and internal implementation detail.
3. Group items under `Added`, `Changed`, and `Fixed`. Omit empty groups.
4. Lead each bullet with the user benefit, then state the change.
5. Do not invent dates, metrics, compatibility claims, or issue numbers.
6. End with a one-sentence upgrade note only when `changes.md` identifies a required action.

Match the tone and level of detail in [examples/good-release-notes.md](examples/good-release-notes.md).
