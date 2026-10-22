# Security

## Reporting a vulnerability

Report vulnerabilities in `web-component-base-class` through the
[issue tracker](https://github.com/virtualcodewarrior/webComponentBaseClass/issues).

The published package has **no production dependencies** — `npm audit --omit=dev` reports
0 vulnerabilities. Every advisory below lives in the development toolchain only and cannot
reach a consumer of the library.

## Known unpatched advisories

### `braces` — GHSA-vfj7-8cjw-p6xm (CVE-2026-93687, high)

`npm audit` reports 5 high-severity findings. They are all one root cause reached through a
single edge:

```
karma@6.4.4 ──> braces@3.0.3          (direct dependency)
            └─> chokidar@3.6.0 ──> braces@3.0.3
```

`chokidar`, `karma`, `karma-jasmine` and `karma-jasmine-html-reporter` appear as separate
rows only because they depend on `braces`; there is no independent fix for them.

**Why it is not fixed.** The advisory covers `braces <=3.0.3` and lists **no first patched
version** — 3.0.3 is still the newest release on npm. `karma@6.4.4` is likewise the newest
karma release and requires `braces` directly, so no combination of supported versions
removes the edge. `npm audit fix --force` "resolves" it by downgrading karma to 4.0.0,
which is not acceptable.

**Why the risk is acceptable here.** The only call site is `karma/lib/watcher.js`, which
runs `braces.expand()` on the glob patterns declared in this repository's own
`karma.conf.cjs`. The vulnerability is a stack-exhaustion denial of service on attacker
supplied brace patterns; there is no untrusted input on that path, it runs only on a
developer machine or CI runner during `npm run unittest`, and it never ships to users.

**Re-checking.**

```sh
npm audit --omit=dev          # 0 — nothing a consumer can reach
npm audit                     # 5 rows, all traced to braces above
npm view braces version       # a release newer than 3.0.3 means a fix now exists
```

Once `braces` ships a patched release, or karma ships a release that drops the dependency,
remove this section and the count drops to 0 with a plain `npm update`.
