let currentMode = "REAL";
let requestCount = 0;
const endpointMap = {};

const modeStatusEl = document.getElementById("modeBadge");
const toggleBtn = document.getElementById("toggle");
const clearBtn = document.getElementById("clear");
const collapseBtn = document.getElementById("collapse");
const logsEl = document.getElementById("logs");
const emptyStateEl = document.getElementById("emptyState");
const requestCountEl = document.getElementById("requestCount");
const searchInput = document.getElementById("searchInput");

function updateModeUI() {
  modeStatusEl.textContent = currentMode;
  modeStatusEl.className = `mode-badge mode-${currentMode.toLowerCase()}`;
  toggleBtn.textContent = currentMode === "REAL" ? "Switch to Mock" : "Switch to Real";
}

function updateRequestCount() {
  requestCountEl.textContent = requestCount;
}

function detectSource(request) {
  const headers = request.response.headers || [];
  let source = "UNKNOWN";

  headers.forEach(function (h) {
    if (h.name.toLowerCase() === "x-shadowapi-source") {
      source = h.value.toUpperCase();
    }
  });

  if (source === "UNKNOWN" && request._shadowSource) {
    source = request._shadowSource;
  }

  if (source === "UNKNOWN") {
    source = currentMode;
  }

  return source;
}

function createRequestEntry(request) {
  const source = detectSource(request);

  const entry = document.createElement("div");
  entry.className = "log-entry";

  const header = document.createElement("div");
  header.className = "log-header";

  const methodType = request.request.method;

  const method = document.createElement("span");
  method.className = "method method-" + methodType.toLowerCase();
  method.textContent = methodType;

  const status = document.createElement("span");
  status.className = "status";
  status.textContent = request.response.status;

  const badge = document.createElement("span");
  badge.textContent = source === "MOCK" ? "MOCK API" : "REAL API";
  badge.className = source === "MOCK" ? "badge-mock" : "badge-real";

  const url = document.createElement("span");
  url.className = "log-url";
  url.textContent = request.request.url;

  header.appendChild(method);
  header.appendChild(status);
  header.appendChild(badge);
  header.appendChild(url);

  const details = document.createElement("div");
  details.className = "log-details";

  entry.appendChild(header);
  entry.appendChild(details);

  header.addEventListener("click", function () {
    toggleDetails(entry, request);
  });

  return entry;
}

function toggleDetails(entry, request) {
  const details = entry.querySelector(".log-details");

  if (details.classList.contains("expanded")) {
    details.classList.remove("expanded");
    details.innerHTML = "";
    return;
  }

  request.getContent(function (content) {
    const body = document.createElement("pre");
    try {
      body.textContent = JSON.stringify(JSON.parse(content), null, 2);
    } catch (e) {
      body.textContent = content || "No response body";
    }

    const reqHeaders = document.createElement("pre");
    reqHeaders.textContent = JSON.stringify(request.request.headers, null, 2);

    details.innerHTML = "";
    details.appendChild(body);
    details.appendChild(reqHeaders);
    details.classList.add("expanded");
  });
}

function renderLogs() {
  logsEl.innerHTML = "";

  const urls = [];
  for (var key in endpointMap) {
    urls.push(key);
  }

  if (urls.length === 0) {
    emptyStateEl.style.display = "block";
    return;
  }

  emptyStateEl.style.display = "none";

  urls.forEach(function (url) {
    const group = document.createElement("div");
    group.className = "endpoint-group";

    const title = document.createElement("div");
    title.className = "endpoint-title";
    title.textContent = url + " (" + endpointMap[url].length + ")";

    group.appendChild(title);

    endpointMap[url].forEach(function (req) {
      group.appendChild(createRequestEntry(req));
    });

    logsEl.appendChild(group);
  });
}

function addRequestLog(request) {
  request._shadowSource = currentMode;

  const url = request.request.url;
  if (!endpointMap[url]) {
    endpointMap[url] = [];
  }
  endpointMap[url].push(request);

  requestCount++;
  updateRequestCount();
  renderLogs();
}

function clearLogs() {
  for (var key in endpointMap) {
    delete endpointMap[key];
  }
  requestCount = 0;
  updateRequestCount();
  renderLogs();
}

function collapseAll() {
  document.querySelectorAll(".log-details").forEach(function (d) {
    d.classList.remove("expanded");
    d.innerHTML = "";
  });
}

searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  document.querySelectorAll(".log-entry").forEach(function (log) {
    log.style.display = log.innerText.toLowerCase().includes(filter) ? "block" : "none";
  });
});

toggleBtn.addEventListener("click", function () {
  currentMode = currentMode === "REAL" ? "MOCK" : "REAL";
  chrome.storage.local.set({ mode: currentMode });
  updateModeUI();
});

clearBtn.addEventListener("click", clearLogs);
collapseBtn.addEventListener("click", collapseAll);

chrome.storage.local.get(["mode"], function (result) {
  currentMode = result.mode || "REAL";
  updateModeUI();
});

chrome.devtools.network.onRequestFinished.addListener(addRequestLog);
