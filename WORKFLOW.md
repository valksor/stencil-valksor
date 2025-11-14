# GitHub Workflows

## `npm.yml` – Automated Releases

This Stencil component library publishes to npm via `.github/workflows/npm.yml`. The job runs whenever the `master` branch receives a push or the workflow is manually dispatched.

### Release flow

1. **Checkout**
    - Pull the full git history (`fetch-depth: 0`) so semantic versioning can inspect past commits/tags.
    - Configure the GitHub Actions bot identity for later commits.
2. **Manual safety checks**
    - If the workflow was triggered via the UI, the job exits unless the current ref is `master`.
3. **Context gathering**
    - Capture the latest commit message for log/decision making.
    - Install npm dependencies in the repository root using `npm ci` when a lockfile exists (falls back to `npm install` otherwise); dependency caching is enabled through `actions/setup-node`.
4. **Determine version bump**
    - Manual dispatch may provide `release_type` (`patch`, `minor`, `major`); invalid values fail fast.
    - Otherwise the commit message is scanned for `[major]`, `[minor]`, `[patch]`.
    - When no hint exists, the workflow defaults to a prerelease patch bump (uses `prepatch` under the hood).
    - The step outputs both the bump type and whether the run is a prerelease (`pre=true|false`).
5. **Test + version**
    - Run `npm test` to execute Stencil unit and e2e suites; failures stop the pipeline.
    - Bump `package.json` without tagging (`npm --no-git-tag-version version ...`) and read the new version number. When producing prereleases, `premajor`, `preminor`, or `prepatch` is chosen to mirror the underlying bump type rather than always using a generic `prerelease`.
    - Stage `package.json`, commit with `release:` or `prerelease:` prefix, and create a matching annotated tag (`vX.Y.Z`).
    - Upload the bumped `package.json` as an artifact (`bumped-package`) to make the version manifest available to any future jobs.
6. **Build + publish**
    - Run `npm run build` to compile CSS and generate Stencil distributions in `dist/` and `loader/`.
    - Publish via `npm publish --access public`; prereleases use the `next` dist-tag, stable versions use the default tag.
7. **Finalize**
    - Push the new commit and tags back to `master`.
    - Call `softprops/action-gh-release` to create a GitHub Release; prerelease flag mirrors the npm tag, and the body references the triggering commit message.

### Notes

- Publishing always happens from the repository root, but only `dist/` and `loader/` are included in the npm package because they are the only entries inside the `"files"` array in `package.json`.
- Manual dispatch is restricted to the `master` branch; the workflow exits early if someone tries to trigger it elsewhere.
