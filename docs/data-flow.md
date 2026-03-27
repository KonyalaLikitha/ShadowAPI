# ShadowAPI — Engine Data Flow

How data moves through the mock engine on every request.

---

## Full Request Data Flow

```mermaid
flowchart TD
    REQ([Incoming Request\nmethod · path · body]) --> HMR

    HMR[handleMockRequest\nengine/index.js]

    HMR -->|path === /api/hello| HELLO[Return hello response\nstatus 200]
    HMR -->|path === /api/error| ERR[Return 500\nInternal Server Error]
    HMR -->|simulateError fires| SIMERR[Return simulated error\n400 · 429 · 500 · 503]
    HMR -->|no matching route| FWD[Return null\ngateway forwards to backend]
    HMR -->|route matched| CRUD

    subgraph CRUD [CRUD Resolution]
        direction TD
        GET_ALL[GET /resource\nno id] -->|read| SS
        GET_ONE[GET /resource/:id\nwith id] -->|read| SS
        POST[POST /resource] -->|generate + write| DG
        PUT[PUT /resource/:id] -->|update| SS
        DELETE[DELETE /resource/:id] -->|remove| SS

        DG[dataGenerator\ngenerateField per schema type] -->|write new item| SS
        SS[(stateStore\nin-memory state)]
        SS -->|item not found on GET| DG
    end

    subgraph SCHEMA [schema.json]
        direction LR
        ROUTES[routes\nmethod + path definitions]
        FIELDS[fields\nresource field types]
    end

    SCHEMA -->|route lookup| HMR
    SCHEMA -->|field types| DG

    CRUD --> RV
    RV[responseValidator\nshape check against real sample]
    RV -->|shapes match| RESP
    RV -->|mismatch| COMPAT[generateCompatibleMock\nmirror real response shape]
    COMPAT --> RESP

    RESP([Return\nstatus · body])
```

---

## Engine Internal Modules

```mermaid
flowchart LR
    subgraph ENGINE [engine/]
        IDX[index.js\nhandleMockRequest\nhandleRequest]
        SCH[schema.json\nroutes + fields]
        DG[dataGenerator.js\ngenerateObjects\ngenerateSingle\ngenerateField]
        SS[stateStore.js\nget · add · getById\nupdate · remove]
        ES[errorSimulation.js\nsimulateError]
        FH[fallbackHandler.js\nhandleBackendFailure\nshouldFallback]
        RV[responseValidator.js\nvalidateMock\ngenerateCompatibleMock]
    end

    IDX --> SCH
    IDX --> DG
    IDX --> SS
    IDX --> ES
    IDX --> RV
    FH --> IDX
    DG --> SCH
```

---

## State Lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant E as Engine
    participant S as StateStore

    Note over S: Seeded with users [1,2] on startup

    C->>G: GET /api/users
    G->>E: handleMockRequest
    E->>S: get('users')
    S-->>E: [user1, user2]
    E-->>G: { status:200, body: { users:[...] } }
    G-->>C: 200 + x-shadowapi-source: mock

    C->>G: POST /api/users { name: Alice }
    G->>E: handleMockRequest
    E->>E: generateSingle('users', body)
    E->>S: add('users', newUser)
    S-->>E: { id:3, name:'Alice', ... }
    E-->>G: { status:201, body: { data: newUser } }
    G-->>C: 201 + x-shadowapi-source: mock

    C->>G: GET /api/users
    G->>E: handleMockRequest
    E->>S: get('users')
    S-->>E: [user1, user2, Alice]
    E-->>G: { status:200, body: { users:[...Alice included] } }
    G-->>C: 200 — Alice now in list
```

---

## Error Simulation Flow

```mermaid
flowchart LR
    REQ[Request arrives] --> ES[simulateError method]
    ES -->|random < 0.05\nany method| E500[500 Internal Server Error]
    ES -->|random < 0.08\nGET only| E429[429 Too Many Requests]
    ES -->|random < 0.10\nPOST · PUT only| E400[400 Bad Request]
    ES -->|random < 0.11\nany method| E503[503 Service Unavailable]
    ES -->|else ~89% of requests| NULL[null — proceed normally]
    NULL --> NORMAL[Normal mock response]
```

---

## Fallback Flow (hybrid mode)

```mermaid
flowchart TD
    GW[Gateway receives request] --> PROXY[Proxy tries real backend]
    PROXY -->|200 OK| REAL[Return real response\nx-shadowapi-source: real]
    PROXY -->|404| FB[fallbackHandler]
    PROXY -->|timeout · error| FB
    FB --> ENGINE[handleMockRequest\nengine generates mock]
    ENGINE --> MOCK[Return mock response\nx-shadowapi-source: mock]
```
