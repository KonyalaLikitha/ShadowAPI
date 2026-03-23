# ShadowAPI

ShadowAPI is an open-source development gateway that enables frontend teams to work without waiting for backend APIs.

It generates mock APIs from contracts and seamlessly switches to real backend services when available.

---

## Demo

Below is a demonstration of the ShadowAPI DevTools extension.

![ShadowAPI Demo](docs/images/demo.gif)

---

## Why ShadowAPI?

* Parallel frontend and backend development
* Contract-first API workflow
* Automatic fallback to mock APIs
* Seamless switching to real backend
* Local-first development (no cloud dependency)

---

## Features

* Dynamic mock API generation
* Stateful request/response simulation
* Proxy forwarding to real backend
* Automatic fallback handling
* API request logging and inspection
* Chrome DevTools extension

---

##  Quick Start
Get ShadowAPI running in under 2 minutes.

---

## 1. Install
    git clone https://github.com/KonyalaLikitha/ShadowAPI.git
    cd ShadowAPI
    npm install
    npm link

## 2. Initialize Project
    shadowapi init

Creates:
- shadowapi.config.json
- openapi.yaml

## 3. Start ShadowAPI
    shadowapi start --mode hybrid

Modes:
- mock → always use mock API  
- proxy → always use real backend  
- hybrid → backend first, fallback to mock  

## 4. (Optional) Connect Backend
    shadowapi connect http://localhost:5050

## 5. Test API
Open in browser:
    http://localhost:3000/api/hello

## 6. See the Magic

 - Backend OFF
    shadowapi start --mode hybrid
      → Response comes from Mock Engine

 - Backend ON
    node -e "require('http').createServer((req,res)=>res.end('real backend')).listen(5050)"
    Refresh:
      → Response comes from Real Backend

## 7. Check System Status
    shadowapi status

## 8. Check Backend Health
    shadowapi reconnect

## Example CLI Output
    ShadowAPI: Starting ShadowAPI...
    ✓ ShadowAPI: Configuration loaded
    ShadowAPI: Mode: hybrid
    ShadowAPI: Port: 3000
    ShadowAPI: Backend: http://localhost:5050

    🚀 ShadowAPI Gateway running on http://localhost:3000 [hybrid]

## Expected Output

| Scenario     | Result Source |
|--------------|--------------|
| Backend OFF  | Mock API     |
| Backend ON   | Real Backend |
| Hybrid Mode  | Auto Switch  |

## Example Demo

A sample frontend project is included:

```bash
examples/demo-app/index.html
```

Steps:

1. Open the demo page
2. Click "Load Users"
3. Open DevTools → ShadowAPI tab
4. Inspect API requests

---

## DevTools Guide

Detailed usage instructions:

```
docs/devtools-guide.md
```

---

## Example Documentation

```
docs/example-usage.md
```

---

## Project Structure

```
shadowapi/
 ├ engine/
 ├ gateway/
 ├ cli/
 ├ extension/
 ├ examples/
 ├ docs/
 ├ CONTRIBUTING.md
 ├ LICENSE
 └ README.md
```

---

## Project Status

Active Development — Week 2/4

Current focus: Mock server and DevTools integration

---

## Roadmap

* Mock engine improvements
* Gateway proxy integration
* DevTools enhancements
* CLI improvements
* Documentation completion

---

## Contributing

Contributions are welcome.

See:

```
CONTRIBUTING.md
```

---

## License

MIT License
