# BindScope task runner.
#
# Configuration is read from an optional .env file in this directory.
# Copy .env.example to .env to override defaults. See `make help`.

# `-include` so a missing .env is not an error. Variables defined here become
# plain make variables, which is why PORT below uses `?=` and not `=`.
-include .env

PORT ?= 8080
HOST ?= 127.0.0.1

# Application package root. All npm scripts run here.
APP ?= app

.DEFAULT_GOAL := help
.PHONY: help install run serve port test lint build e2e e2e-install

help: ## Show available targets
	@printf 'BindScope targets:\n\n'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[1m%-12s\033[0m %s\n", $$1, $$2}'
	@printf '\nDev server: http://%s:%s (override in .env or with `make run PORT=1234`)\n' '$(HOST)' '$(PORT)'

install: ## Install app dependencies (npm install in app/)
	npm --prefix $(APP) install

run: ## Start Vite dev server with HMR, opening a browser
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
	@printf 'Dev server on http://%s:%s — Ctrl+C to stop\n' '$(HOST)' '$(PORT)'
	npm --prefix $(APP) run dev -- --host $(HOST) --port $(PORT) --open

serve: ## Same as run, but do not open a browser
	@if ss -ltnH "sport = :$(PORT)" | grep -q .; then \
		printf '\033[31mPort %s is already in use.\033[0m\n\n' '$(PORT)'; \
		printf 'What is holding it:\n'; \
		ss -ltnpH "sport = :$(PORT)" | sed 's/^/  /'; \
		free=$(PORT); \
		while ss -ltnH "sport = :$$free" | grep -q .; do free=$$((free + 1)); done; \
		printf '\nPort %s is free. Either way works:\n' "$$free"; \
		printf '  make serve PORT=%s       one-off\n' "$$free"; \
		printf '  echo PORT=%s >> .env     persistent\n' "$$free"; \
		exit 1; \
	fi
	@printf 'Dev server on http://%s:%s — Ctrl+C to stop\n' '$(HOST)' '$(PORT)'
	npm --prefix $(APP) run dev -- --host $(HOST) --port $(PORT)

port: ## Print the port that `make run` would use
	@echo $(PORT)

test: ## Run unit tests (Vitest)
	npm --prefix $(APP) test

lint: ## Run ESLint
	npm --prefix $(APP) run lint

build: ## Build static production artifact into app/dist
	npm --prefix $(APP) run build

e2e-install: ## Download Playwright Chromium (once per machine / CI)
	npm --prefix $(APP) run test:e2e:install

e2e: ## Playwright smoke against Vite preview (builds app/dist first)
	npm --prefix $(APP) run build
	npm --prefix $(APP) run test:e2e
