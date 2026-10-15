# Article review before committing

Use this checklist for every new or substantially revised article. Apply the relevant items and record what was checked in the commit/PR or handoff. Explain any unverified item; do not describe a source check as browser testing. This is an editorial workflow, not an automated Git hook.

## Audience and argument

- [ ] State who the article is for and what decisions it helps them make near the start.
- [ ] Keep the technical argument central. Use brief examples only where they explain a decision; avoid making every section depend on one fictional scenario.
- [ ] Explain ambiguous labels, actors and permissions: who authenticates, who authorises, who approves and which component enforces the decision.
- [ ] Prefer precise threat → control → verification tables or diagrams when clearer than prose. Keep visuals concise and accessible.
- [ ] Include code only when it materially helps; do not add code snippets to the organisational app-security article unless requested.
- [ ] End with a concrete technical conclusion and release/operational implications, rather than a generic recap.
- [ ] Avoid unnecessary fictional names or culturally stereotyped examples.

## Research and references

- [ ] Browse current primary sources for changing claims: threats, vulnerabilities, products, APIs, availability and standards. Check publication dates, activity dates and subsequent corrections.
- [ ] Look for superseding editions and advisories, not just working URLs. Distinguish final releases, drafts, previews and deprecated features.
- [ ] Keep original incident reports as evidence; label older supporting material instead of presenting it as the latest guidance.
- [ ] Distinguish observed attacks, vulnerability disclosures, demonstrations/evaluations, vendor claims and editorial recommendations. Do not imply prevalence from a curated incident list.
- [ ] Open every added or changed reference and confirm the destination and relevant content. For a new article or a full research refresh, check the entire reference list, including existing links.
- [ ] Check HTTP responses/redirects and soft error pages. A 200 response alone is insufficient. Retry blocked links with another available reader; report unresolved access restrictions honestly.
- [ ] Ensure each citation supports its nearby claim, every citation resolves, reference IDs are unique and no unused references remain.
- [ ] Record an accurate “last reviewed” date. Do not imply continuous monitoring or automatic freshness.
- [ ] Keep the first 10 references visible and put the rest behind “More references”; update counts and ensure clicking a hidden citation reveals its entry.

## Technical coverage where relevant

- [ ] Cover the application end to end: frontend, API/backend, object/tenant authorisation, files/parsers, workers, storage, networks, CI/CD, dependencies, operations and incident response.
- [ ] For AI, cover retrieval permissions, prompt injection, model/tool execution boundaries, output handling, approval/replay controls, evaluation and cost/resource abuse.
- [ ] Address storage AND processing location, derived data/embeddings, logs, backups, subprocessors and outbound routing.
- [ ] Address sovereign AI proportionately: operator access, jurisdictional requirements, key/control ownership, external dependencies and continuity. Do not equate region selection or local hosting with complete sovereignty.
- [ ] Present technology categories and selection criteria before product examples. Consider a broad market; avoid centring the article on one or two vendors. AWS/Azure and other providers are illustrative where applicable.
- [ ] Explain enforcement location and how a team can verify it. Avoid treating hidden UI, a private endpoint, a system prompt or a clean scanner result as sufficient evidence.

## Presentation and site integration

- [ ] Follow index.html and the shared editorial design: existing colours, typography and reusable CSS/JS patterns.
- [ ] Use comfortable page width and side padding; maintain consistent vertical spacing without oversized hero gaps or wasted space.
- [ ] Begin article pages at the article without a distracting top navigation bar. Keep managed-platform examples expanded by default in the app-security article.
- [ ] Verify desktop and mobile rendering, table scrolling, overflow, headings, keyboard focus, disclosure controls, TOC and citation navigation. If browser access is unavailable, say so; static checks do not replace visual QA.
- [ ] Update listing text/read time and page metadata if the article changes materially; preserve the original publication date and set modification dates accurately.

## Repository checks and handoff

- [ ] Review existing code/instructions and the Git diff; preserve unrelated work. Never inspect or commit secrets or environment files.
- [ ] Run git diff --check, validate HTML IDs/local assets/citation targets and syntax-check changed JavaScript. Run existing project tests/build/lint if configured; do not invent successful checks where commands do not exist.
- [ ] Stage only intended files. Commit, push or deploy only when the user has authorised that action; an earlier explicit instruction in the active task can provide that authorisation.
- [ ] Report the change, checks performed, limitations and commit/push outcome. A push alone is not verification that the live deployment succeeded.
