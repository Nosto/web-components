---
name: github-action-plugins
description: Review checklist for GitHub Action plugin changes.
---

# GitHub Action Plugins Review Checklist

## Use this skill when
- Reviewing changes to `.github/workflows/*.yml`.

## Checklist
- Are all GitHub Actions pinned to a specific commit SHA (not tags like `@v3`, `@main`, `@latest`)?
- Has vulnerability scanning been performed for each new/updated Action SHA? If not available, mark pending.
- Has it been confirmed that no specified Action SHA has critical vulnerabilities? If not available, mark pending.

If a SHA was previously scanned in another Nosto repo, reference that result.
