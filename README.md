# ShadowAPI

**Remove backend dependency during development.**

ShadowAPI is an open-source developer tool that helps frontend teams work without waiting for backend APIs. It generates mock APIs from API contracts and seamlessly switches to real backend services when they become available.

## Why ShadowAPI?

- **Parallel Development**: Frontend teams build without waiting for backend
- **Contract-First**: Generate mocks from OpenAPI/Swagger specs
- **Seamless Switching**: Proxy to real backend when ready, same endpoint URL
- **Smart Fallback**: Missing endpoints auto-fallback to mocks
- **Local-First**: No cloud dependencies, reproducible setups

Ideal for student projects, hackathons, CI environments, and open-source development.
## Quick Start

```bash
# Install
npm install -g shadowapi

# Initialize
shadowapi init

# Start mock server
shadowapi start --contract api-spec.yaml

# Connect real backend (when ready)
shadowapi connect --backend http://localhost:8080
```

## Features

- ✅ Dynamic mock generation from API contracts
- ✅ Stateful request/response simulation
- ✅ Automatic proxy forwarding
- ✅ Gradual backend integration
- ✅ Request logging & inspection
- ✅ Chrome DevTools extension
## DevTools Extension

ShadowAPI provides a Chrome DevTools extension that allows developers to inspect API requests in real time.

### Features

- API request monitoring
- Mock / Real backend toggle
- Request search and filtering
- Expandable response viewer
- Request header inspection
- Request counter
- Clear and collapse logs

### Screenshots

#### DevTools Panel
![DevTools Panel](extension/docs/panel.png)

#### Request Logs
![Request Logs](extension/docs/logs.png)

#### Response Viewer
![Response Viewer](extension/docs/viewer.png)
## Project Status

🚧 **Active Development** — Week 2/4

Current milestone: Building a functional mock server and developer tooling.

Completed so far:

* Chrome DevTools extension for API request inspection
* Request logging and response viewer
* Mock/Real mode toggle
* Example frontend demo project
* Developer documentation and usage guides

Next milestone:

* Stateful mock API responses
* Dynamic route handling
* Improved developer experience

## Architecture

```
Frontend → ShadowAPI Gateway → Mock Engine (fallback)
                            ↓
                         Real Backend (when available)
```

## Repository Structure

```
shadowapi/
├── engine/      # Mock data generation & state
├── gateway/     # Proxy & routing logic
├── cli/         # Command-line interface
├── extension/   # Chrome DevTools panel
├── examples/    # Sample projects
└── docs/        # Documentation
```
## Example Frontend Demo

ShadowAPI includes a small demo frontend that generates API requests so the DevTools extension can inspect them.

### Location

```
examples/demo-app/
```

### How to Run the Demo

1. Open the demo page in your browser:

```
examples/demo-app/index.html
```

2. Open Chrome DevTools:

```
F12 → ShadowAPI tab
```

3. Click **Load Users** on the demo page.

This will trigger an API request:

```
GET https://jsonplaceholder.typicode.com/users
```

4. The request will appear inside the **ShadowAPI DevTools panel**, where you can inspect:

* request URL
* HTTP method
* response status
* response body
* headers

### Purpose

The demo project is provided to:

* test the DevTools extension
* generate API requests
* demonstrate how ShadowAPI inspects network traffic

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE)

## Roadmap
- [x] Project setup
- [ ] Basic mock server
- [ ] Proxy forwarding
- [x] DevTools extension
- [ ] Full documentation

---
## Example Documentation

Detailed documentation for the demo frontend can be found here:

```
docs/example-usage.md
```

This guide explains how to run the demo project and inspect API requests using the ShadowAPI DevTools extension.

## DevTools Guide

Detailed instructions for using the Chrome DevTools extension are available here:

```
docs/devtools-guide.md
```

This guide explains how to inspect API requests, view responses, and debug requests using the ShadowAPI Control Panel.
## Project Roadmap

ShadowAPI is currently under active development. The goal is to build a lightweight development gateway that allows frontend and backend teams to work in parallel.

### Current Progress

* DevTools extension for API request inspection
* Mock / Real mode toggle
* Request logging and search
* Expandable response viewer
* Example frontend demo application

### Upcoming Features

* Stateful mock API engine
* Proxy gateway to real backend services
* CLI commands for server control
* Mock fallback for missing endpoints
* Improved DevTools debugging interface

### Long Term Vision

ShadowAPI aims to become a developer tool that simplifies frontend-backend collaboration by allowing teams to build and test features without waiting for backend implementations.



