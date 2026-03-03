# ShadowAPI

**Remove backend dependency during development.**

ShadowAPI is an open-source development gateway that generates realistic mock servers from API contracts and seamlessly switches to real backends as they become available.

## Why ShadowAPI?

- **Parallel Development**: Frontend teams build without waiting for backend
- **Contract-First**: Generate mocks from OpenAPI/Swagger specs
- **Seamless Switching**: Proxy to real backend when ready, same endpoint URL
- **Smart Fallback**: Missing endpoints auto-fallback to mocks
- **Local-First**: No cloud dependencies, reproducible setups

Perfect for student projects, hackathons, CI environments, and open-source contributors.

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

- Dynamic mock generation from API contracts
- Stateful request/response simulation
- Automatic proxy forwarding
- Gradual backend integration
- Request logging & inspection
- Chrome DevTools extension

## Project Status

**Active Development** — Week 1/4

Current milestone: Core infrastructure & basic mock server

## Architecture

```
Frontend → ShadowAPI Gateway → Mock Engine (fallback)
                            ↓
                         Real Backend (when available)
```

## Repository Structure

```text
shadowapi/
├── engine/      # Contract-driven mock engine
├── gateway/     # Proxy & routing logic
├── cli/         # Command-line interface
├── extension/   # Chrome DevTools panel
├── examples/    # Sample projects
├── docs/        # Documentation
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```
Folder Overview

engine/ — Mock Engine (Core Simulation)
Responsible for generating realistic backend behavior from API contracts.
Includes schema parsing, mock data generation, in-memory state management, and error simulation.

gateway/ — Development Gateway & Proxy
Acts as the entry point for all API requests.
Routes requests to mock responses or forwards them to the real backend when available, with automatic fallback for missing endpoints.

cli/ — Developer Interface
Provides the shadowapi CLI for initializing projects, loading contracts, starting the server, and connecting real backends.

extension/ — DevTools Integration
A Chrome DevTools panel for inspecting requests, toggling mock/real modes, and visualizing API behavior during development.

examples/ — Sample Projects
Contains example frontend applications demonstrating how ShadowAPI integrates into real workflows.

docs/ — Documentation & Architecture
Holds architecture diagrams, design decisions, and advanced usage guides.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE)

## Roadmap

- [x] Project setup
- [ ] Basic mock server
- [ ] Proxy forwarding
- [ ] DevTools extension
- [ ] Full documentation

---

**Built for developers who ship fast.**
