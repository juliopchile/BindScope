# BindScope task runner.
#
# Configuration is read from an optional .env file in this directory.
# Copy .env.example to .env to override defaults. See `make help`.

# `-include` so a missing .env is not an error. Variables defined here become
# plain make variables, which is why PORT below uses `?=` and not `=`.
-include .env

PORT ?= 8080
HOST ?= 127.0.0.1

# Directory served to the browser. The application lives in app/ so the
# repository root stays free for documentation and tooling.
ROOT ?= app

.DEFAULT_GOAL := help
.PHONY: help run serve port

help: ## Show available targets
	@printf 'BindScope targets:\n\n'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[1m%-8s\033[0m %s\n", $$1, $$2}'
	@printf '\nServing %s/ on port %s (override in .env or with `make run PORT=1234`)\n' '$(ROOT)' '$(PORT)'

run: ## Serve the page with live reload, opening a browser
	@if ss -ltnH "sport = :$(PORT)" | grep -q .; then \
		printf '\033[31mPort %s is already in use.\033[0m\n\n' '$(PORT)'; \
		printf 'What is holding it:\n'; \
		ss -ltnpH "sport = :$(PORT)" | sed 's/^/  /'; \
		free=$(PORT); \
		while ss -ltnH "sport = :$$free" | grep -q .; do free=$$((free + 1)); done; \
		printf '\nPort %s is free. Either way works:\n' "$$free"; \
		printf '  make run PORT=%s        one-off\n' "$$free"; \
		printf '  echo PORT=%s >> .env    persistent\n' "$$free"; \
		exit 1; \
	fi
	@printf 'Serving %s/ on http://%s:%s — Ctrl+C to stop\n' '$(ROOT)' '$(HOST)' '$(PORT)'
	npx --yes live-server --port=$(PORT) --host=$(HOST) $(LIVE_SERVER_FLAGS) $(ROOT)

serve: ## Same as run, but do not open a browser
	@$(MAKE) --no-print-directory run LIVE_SERVER_FLAGS=--no-browser

port: ## Print the port that `make run` would use
	@echo $(PORT)
