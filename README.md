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

- ✅ Dynamic mock generation from API contracts
- ✅ Stateful request/response simulation
- ✅ Automatic proxy forwarding
- ✅ Gradual backend integration
- ✅ Request logging & inspection
- ✅ Chrome DevTools extension

## Project Status

🚧 **Active Development** — Week 1/4

Current milestone: Core infrastructure & basic mock server

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
