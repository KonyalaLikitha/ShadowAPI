let currentMode = "REAL";
let requestCount = 0;

const modeStatusEl = document.getElementById("modeBadge");
const toggleBtn = document.getElementById("toggle");
const clearBtn = document.getElementById("clear");
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

function getStatusClass(status) {

  if (status >= 200 && status < 300)
    return "status-success";

  if (status >= 400 && status < 500)
    return "status-warning";

  if (status >= 500)
    return "status-error";

  return "";
}

function createRequestEntry(request) {

  const entry = document.createElement("div");

  entry.className =
    `log-entry ${getStatusClass(request.response.status)}`;

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

  const time = document.createElement("span");
  time.className = "log-time";

  time.textContent =
    request.time ? `${request.time} ms` : "";

  header.appendChild(method);
  header.appendChild(status);
  header.appendChild(url);
  header.appendChild(time);

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

    request.getContent((content) => {

      const pre = document.createElement("pre");

      try {

        const parsed = JSON.parse(content);

        pre.textContent =
          JSON.stringify(parsed, null, 2);

      } catch {

        pre.textContent =
          content || "No response body";
      }

      details.innerHTML = "";

      details.appendChild(pre);

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

chrome.devtools.network.onRequestFinished.addListener(
  (request) => {

    if (!request.request.url.includes("/api"))
      return;

    addRequestLog(request);
  }
);