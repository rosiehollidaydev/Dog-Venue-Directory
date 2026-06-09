---
name: Package firewall version blocks
description: Packages published less than 1440 minutes ago are blocked with HTTP 403 by the Replit package firewall.
---

**Rule:** The workspace enforces `minimumReleaseAge: 1440` (1 day). Any package version published within the last 24 hours gets a 403 "Forbidden" error during install.

**Why:** Supply-chain attack defense — newly published malicious packages are typically caught within hours, so a 1-day delay provides a safety buffer.

**How to apply:** When a package install fails with 403, check if the version was published very recently. Pin to an older patch (e.g., if 14.2.21 is blocked, try 14.2.15 or earlier). For first-party Replit packages (`@replit/*`), this check is skipped.

**Practical example:** Next.js 14.2.21 was blocked (published same day). Switched to Next.js 15 (^15.0.0) which was well past the release age window.
