let currentMode = "REAL";
let requestCount = 0;

const modeStatusEl = document.getElementById("modeBadge");
const toggleBtn = document.getElementById("toggle");
const clearBtn = document.getElementById("clear");
const collapseBtn = document.getElementById("collapse");

const logsEl = document.getElementById("logs");
const requestCountEl = document.getElementById("requestCount");
const searchInput = document.getElementById("searchInput");

function updateModeUI() {

  modeStatusEl.textContent = currentMode;

  modeStatusEl.className =
    `mode-badge mode-${currentMode.toLowerCase()}`;

  toggleBtn.textContent =
    currentMode === "REAL"
      ? "Switch to Mock"
      : "Switch to Real";
}

function updateRequestCount() {
  requestCountEl.textContent = requestCount;
}

function createRequestEntry(request) {

  const entry = document.createElement("div");
  entry.className = "log-entry";

  const header = document.createElement("div");
  header.className = "log-header";

  const method = document.createElement("span");
  method.className = "method";

  method.textContent = request.request.method;

  const status = document.createElement("span");
  status.className = "status";

  status.textContent = request.response.status;

  const url = document.createElement("span");
  url.className = "log-url";

  url.textContent = request.request.url;

  header.appendChild(method);
  header.appendChild(status);
  header.appendChild(url);

  const details = document.createElement("div");
  details.className = "log-details";

  entry.appendChild(header);
  entry.appendChild(details);

  header.addEventListener(
    "click",
    () => toggleDetails(entry, request)
  );

  return entry;
}

function toggleDetails(entry, request) {

  const details = entry.querySelector(".log-details");

  if (details.classList.contains("expanded")) {

    details.classList.remove("expanded");

    details.innerHTML = "";

  } else {

    const container = document.createElement("div");

    request.getContent((content) => {

      const body = document.createElement("pre");

      try {

        const parsed = JSON.parse(content);

        body.textContent =
          JSON.stringify(parsed, null, 2);

      } catch {

        body.textContent =
          content || "No response body";
      }

      container.appendChild(body);

      const headers = document.createElement("pre");

      headers.textContent =
        JSON.stringify(
          request.request.headers,
          null,
          2
        );

      container.appendChild(headers);

      details.innerHTML = "";

      details.appendChild(container);

      details.classList.add("expanded");
    });
  }
}

function addRequestLog(request) {

  const entry = createRequestEntry(request);

  logsEl.appendChild(entry);

  requestCount++;

  updateRequestCount();
}

function clearLogs() {

  logsEl.innerHTML = "";

  requestCount = 0;

  updateRequestCount();
}

function collapseAll() {

  document
    .querySelectorAll(".log-details")
    .forEach((d) => {

      d.classList.remove("expanded");

      d.innerHTML = "";
    });
}

searchInput.addEventListener("input", () => {

  const filter =
    searchInput.value.toLowerCase();

  const logs =
    document.querySelectorAll(".log-entry");

  logs.forEach((log) => {

    const text =
      log.innerText.toLowerCase();

    log.style.display =
      text.includes(filter)
        ? "block"
        : "none";
  });
});

chrome.storage.local.get(["mode"], (result) => {

  currentMode = result.mode || "REAL";

  updateModeUI();
});

toggleBtn.addEventListener("click", () => {

  currentMode =
    currentMode === "REAL"
      ? "MOCK"
      : "REAL";

  chrome.storage.local.set({ mode: currentMode });

  updateModeUI();
});

clearBtn.addEventListener("click", clearLogs);

collapseBtn.addEventListener("click", collapseAll);

chrome.devtools.network.onRequestFinished.addListener(
  (request) => {

    if (!request.request.url.includes("/api"))
      return;

    addRequestLog(request);
  }
);