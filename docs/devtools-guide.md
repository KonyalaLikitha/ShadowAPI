# ShadowAPI DevTools Guide

This guide explains how to use the **ShadowAPI Chrome DevTools Extension** to inspect API requests during development.

---

# Opening the DevTools Panel

1. Open any webpage in Chrome.

2. Open Chrome DevTools.

```
F12
```

3. Navigate to the **ShadowAPI** tab.

You will see the **ShadowAPI Control Panel**.

---

# Control Panel Features

The DevTools panel provides several tools for inspecting API activity.

## Mode Toggle

Switch between:

```
REAL
MOCK
```

REAL mode represents requests going to the real backend.

MOCK mode represents simulated responses.

---

## Request Counter

Displays the total number of captured API requests.

Example:

```
Total Requests: 5
```

---

## Search Requests

Use the search bar to filter logged requests.

Example:

```
Search requests...
```

Typing a keyword will filter the request list.

---

## Request Logs

Each request entry shows:

• HTTP Method
• Status Code
• Request URL

Example:

```
GET 200 https://jsonplaceholder.typicode.com/users
```

---

## Expand Request Details

Click a request entry to view:

• Response body
• Request headers

This allows developers to inspect API responses directly inside DevTools.

---

## Clear Logs

The **Clear Logs** button removes all request entries.

---

## Collapse Logs

The **Collapse Logs** button hides expanded request details.

---

# Using the Demo Application

You can test the extension using the included demo project.

Location:

```
examples/demo-app/
```

Open the demo page:

```
examples/demo-app/index.html
```

Click:

```
Load Users
```

Then open DevTools and navigate to the **ShadowAPI tab**.

You will see the request appear in the request log.

---

# Developer Workflow

Typical usage during development:

```
Frontend Application
        ↓
API Request
        ↓
ShadowAPI DevTools Extension
        ↓
Inspect Response / Debug Issues
```

The DevTools extension helps developers quickly understand API behavior without switching tools.

---

# Purpose of the Extension

The ShadowAPI DevTools extension provides:

• API request monitoring
• Response inspection
• Debugging support for frontend developers
• Visibility into backend communication
