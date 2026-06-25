---
name: cavecrew
description: >
  Decision guide for delegating to caveman-style subagents. Tells the main
  thread when to spawn `cavecrew-investigator` (locate code), `cavecrew-builder`
  (surgical edit), or `cavecrew-reviewer` (diff review) instead of doing the
  work inline or using vanilla `Explore`. Subagent output is caveman-compressed
  so tool results consume far less main-context budget.
  Trigger: "delegate to subagent", "use cavecrew", "spawn investigator/builder/reviewer",
  "save context", "compressed agent output".
---

## Purpose

This skill helps decide whether to delegate a task to a caveman-style subagent
or handle it directly in the main thread. It is optimized for long sessions
where tool-result token budget matters.

## When to use cavecrew vs alternatives

| Task                                                   | Use                                  |
| ------------------------------------------------------ | ------------------------------------ |
| Locate definitions, call sites, or usages              | `cavecrew-investigator`              |
| Surgical edit of 1-2 files when target site is known   | `cavecrew-builder`                   |
| Review a diff or set of files for bugs/issues          | `cavecrew-reviewer`                  |
| Broad architecture, rationale, or prose-heavy guidance | `Explore` / `Code Reviewer`          |
| New feature or refactor spanning 3+ files              | Main thread or a larger design agent |
| Quick factual answer                                   | Main thread directly                 |

Rule of thumb: if you want a small, structured tool output and not prose, use
cavecrew. If you want narrative explanation or design discussion, use vanilla
agents.

## What it does

Tells the user or main thread when to spawn one of the three specialized subagents:

- `cavecrew-investigator`: find code locations, symbols, or references.
- `cavecrew-builder`: perform a focused edit in 1-2 files.
- `cavecrew-reviewer`: audit a diff or file for problems.

The benefit is that subagent tool results are compressed, which preserves main
context over long multi-step workflows.

## Output contracts

### cavecrew-investigator

```
<Header>:
- path:line — `symbol` — short note
totals: <counts>.
```

Or `No match.` Always use file-path-first, line-number-attached, backticked symbols.
Safe to grep with `path:\d+`.

### cavecrew-builder

```
<path:line-range> — <change ≤10 words>.
verified: <re-read OK | mismatch @ path:line>.
```

Or one of: `too-big.`, `needs-confirm.`, `ambiguous.`, `regressed.`.

### cavecrew-reviewer

```
path:line: <emoji> <severity>: <problem>. <fix>.
totals: N🔴 N🟡 N🔵 N❓
```

Or `No issues.` Findings sorted by file and line ascending.

## Chaining patterns

### Locate → fix → verify

1. Use `cavecrew-investigator` to collect candidate sites.
2. Pick 1-2 precise paths and hand them to `cavecrew-builder`.
3. Use `cavecrew-reviewer` to audit the resulting diff.

### Parallel scout

Spawn 2-3 `cavecrew-investigator` calls together when investigation is broad
(e.g. definitions vs callers vs tests).

### Single-shot edit

If the site is already known, skip investigator and call `cavecrew-builder`
directly with exact path:line.

## What NOT to do

- Do not use `cavecrew-builder` without a known target file.
- Do not use it for 3+ file refactors; builder should refuse with `too-big.`.
- Do not ask `cavecrew-reviewer` for general design feedback.
- Do not expect prose; cavecrew output is structured and terse.

## Auto-clarity

Subagents may switch to normal English for security warnings, irreversible
confirmations, or any output where terse fragments could be misread. Resume
caveman style afterward.
