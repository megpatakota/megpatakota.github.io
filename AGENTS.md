# Repository instructions

## Secret handling

Never read, search, open, summarise, edit or print `.env`, `.env.*` or other secret-bearing files. Use `.env.example` or redacted snippets for configuration questions. Never expose or commit credentials. Applications may load environment files internally, but do not inspect or print their contents.

## Engineering workflow

Read existing code before changing it, follow project patterns and preserve unrelated user changes. Use existing dependency conventions; ask before adding a production dependency. Never run destructive Git/filesystem operations without explicit approval. Commit, push, deploy, publish, migrate or change cloud infrastructure only with user authorisation.

For new or revised articles, read and apply [ARTICLE_CHECKLIST.md](ARTICLE_CHECKLIST.md) before committing. Record verification and any limitations honestly. The checklist does not itself authorise publishing or require a new approval when the user has already authorised the action.

## Architecture and verification

- Static frontend: `index.html` is the main portfolio; `main_articles.html` lists articles; `articles/` holds article HTML.
- Shared presentation: `assets/css/blog.css`, `assets/js/blog-shell.js` and `assets/js/site-style-config.js`. The organisational app-security article also uses `assets/css/security-article.css`.
- No backend, database or cloud infrastructure is implemented in this repository. GitHub Pages serves the static site.
- No package-manager install, test, lint, type-check or production-build commands are currently configured. Do not add dependencies or a build system just for article edits.
- For local preview, use an existing server or `python3 -m http.server 5190`. Verify changed pages at desktop and mobile sizes when browser access permits, plus relevant HTML/link/JavaScript checks and `git diff --check`.
- Shared assets and article HTML are maintained source files; no article-generation step is configured. Check current files before assuming README examples describe the latest structure.
