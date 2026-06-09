---
name: Artifact registration workaround
description: createArtifact fails on existing directories; for pre-built artifacts, write artifact.toml via bash and register the workflow manually.
---

**Rule:** `createArtifact()` fails if `artifacts/<slug>/` already exists. `verifyAndReplaceArtifactToml()` requires the target artifact.toml to already be a system-registered artifact (with an `id` field). There is no supported path to register a pre-built artifact directory through these callbacks.

**Why:** The Replit artifact system assigns an `id` at creation time via `createArtifact`. This ID is required for `verifyAndReplaceArtifactToml` to work.

**How to apply:**
1. Write the `artifact.toml` content via bash: `cat > artifacts/<slug>/.replit-artifact/artifact.toml << 'EOF'...EOF`
2. Register the workflow manually via `configureWorkflow({ name, command, waitForPort, outputType })`
3. The app will run and be accessible via the proxy — it just won't appear in the Replit artifact dropdown or be reachable by `presentArtifact` / `screenshot(type='app_preview')`.
4. Use `curl localhost:80/<path>` to verify routing, and `getWorkflowStatus` to check logs.

**Known limitation:** The artifact won't appear in the user's preview pane dropdown until registered through the proper flow. The app IS accessible at its path.
