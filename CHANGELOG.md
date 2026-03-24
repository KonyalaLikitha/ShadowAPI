# Changelog

All notable changes to ShadowAPI are documented here.

---

## [Unreleased]

### Planned
- CLI `connect` command for live backend switching
- DevTools toggle for mock/real mode
- Full README rewrite
- Demo video recording

---

## [0.3.0] — Week 3 (Mar 15–21)

### Added — Gateway
- Proxy forwarding to real backend (`gateway/proxy.js`)
- Automatic fallback to mock when backend is unreachable or returns 404
- Retry logic — 1 retry before falling back to mock
- `x-shadowapi-source` header — labels every response as `mock` or `real`
- `x-shadowapi-mode` header — reflects active gateway mode
- Backend health checker on startup (`gateway/backendChecker.js`)
- Response shape validator — warns on missing/extra fields vs mock schema (`gateway/responseValidator.js`)
- `GET /gateway/status` endpoint — live backend health + uptime + route count
- Proxy stats tracking — `proxied` and `fallback` counters exposed on `/health`
- 22 integration tests covering mock routes, proxy fallback, headers, and real backend forwarding

### Added — CLI
- `shadowapi connect` command for connecting to real backend
- Config persistence across sessions
- `reconnect` command

### Added — DevTools
- Mock vs real label in request inspector
- UI toggle for switching modes

---

## [0.2.0] — Week 2 (Mar 8–14)

### Added — Gateway
- Dynamic route params — `/api/users/:id`, `/api/products/:id`
- PUT and DELETE route support with correct status codes (200, 204)
- Function-based route responses for dynamic data generation
- Middleware refactor — CORS, param injector, logger, validator as separate units
- OPTIONS preflight handling
- Status code constants (`gateway/statusCodes.js`)
- Structured JSON responses with `status`, `message`, `data` envelope

### Added — Engine
- POST updates in-memory state
- PUT and DELETE state mutations
- Error simulation support

### Added — CLI
- `--port` and `--mode` CLI arguments
- Config validation
- Environment modes (`mock`, `proxy`, `hybrid`)

---

## [0.1.0] — Week 1 (Mar 2–7)

### Added — Gateway
- Express server with `/health` endpoint
- Request logging with color-coded method and status
- Auto route registration from `routes.config.js`
- CORS support
- 404 and error handler middleware

### Added — Engine
- Schema parsing from `schema.json`
- Static mock route responses
- Basic data generator (`dataGenerator.js`)

### Added — CLI
- `shadowapi init` — scaffolds config and openapi spec
- `shadowapi start` — starts gateway with config
- Readable console output

### Added — DevTools
- Chrome extension skeleton
- DevTools panel visible
- Request inspector UI
- Screenshots

---

## Legend

- **Added** — new features
- **Changed** — changes to existing functionality
- **Fixed** — bug fixes
- **Removed** — removed features
