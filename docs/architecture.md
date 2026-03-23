# ShadowAPI — Architecture

## System Overview

```mermaid
flowchart TD
    F([Frontend App]) -->|HTTP Request| GW

    subgraph GW [ShadowAPI Gateway — localhost:3000]
        MW[Middleware\nCORS · Logger · Validator]
        PX[Proxy Layer\nForward · Retry · Fallback]
        RT[Router\nRoute Matching · Params]
        ME[Mock Engine\nSchema · Data Gen · State]

        MW --> PX
        PX -->|mock/hybrid fallback| RT
        RT --> ME
    end

    PX -->|proxy / hybrid mode| BE([Real Backend\nlocalhost:8080])
    BE -->|response| PX
    ME -->|mock response| F
    BE -->|real response| F
```

---

## Request Flow by Mode

```mermaid
flowchart LR
    subgraph MOCK [mock mode]
        direction LR
        A1[Frontend] --> B1[Middleware] --> C1[Router] --> D1[Mock Engine] --> E1[Response]
    end

    subgraph PROXY [proxy mode]
        direction LR
        A2[Frontend] --> B2[Middleware] --> C2[Proxy] --> D2[Real Backend]
        C2 -->|unreachable| E2[Mock Engine]
    end

    subgraph HYBRID [hybrid mode]
        direction LR
        A3[Frontend] --> B3[Middleware] --> C3[Proxy] --> D3[Real Backend]
        C3 -->|404 or failure| E3[Mock Engine]
    end
```

---

## Component Breakdown

```mermaid
flowchart TD
    subgraph Gateway
        MW["Middleware\n─────────────\nJSON parse\nCORS preflight\nRequest logger\nValidator"]
        RT["Router\n─────────────\nAuto-register routes\nDynamic params\nx-shadowapi headers"]
        PX["Proxy\n─────────────\nForward to backend\nRetry on failure\nFallback to mock\nStats tracking"]
        BC["Backend Checker\n─────────────\nHEAD probe on startup\nLatency reporting"]
        RV["Response Validator\n─────────────\nShape comparison\nMissing/extra field warn"]
    end

    MW --> RT
    MW --> PX
    PX --> BC
    PX --> RV
```

---

## Modes

| Mode     | Behaviour                                               |
|----------|---------------------------------------------------------|
| `mock`   | All requests served by mock engine                      |
| `proxy`  | All requests forwarded to real backend                  |
| `hybrid` | Tries real backend first, falls back to mock on failure |

---

## Configuration

`shadowapi.config.json`

```json
{
  "port": 3000,
  "mode": "mock",
  "contract": "openapi.yaml",
  "backend": "http://localhost:8080"
}
```

Override at runtime:

```bash
SHADOW_MODE=hybrid BACKEND_URL=http://localhost:8080 node gateway/server.js
```

---

## Key Endpoints

| Endpoint              | Description                               |
|-----------------------|-------------------------------------------|
| `GET /health`         | Gateway status + proxy stats              |
| `GET /gateway/status` | Backend health + uptime + route count     |
