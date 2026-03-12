# ShadowAPI Example Usage

This document explains how to use the **ShadowAPI demo frontend** with the **ShadowAPI DevTools extension**.

---

# Demo Application

Location:

examples/demo-app/

Files included:

* index.html
* app.js
* style.css

The demo application generates API requests that can be captured by the ShadowAPI DevTools extension.

---

# Running the Demo

Open the file:

examples/demo-app/index.html

Click the button **Load Users**.

This will send a request to:

https://jsonplaceholder.typicode.com/users

---

# Viewing Requests in DevTools

1. Open Chrome DevTools

Press:

F12

2. Navigate to the **ShadowAPI** tab.

3. You will see the request logged in the **ShadowAPI Control Panel**.

---

# Example Request

GET https://jsonplaceholder.typicode.com/users

Example response:

```
[
  {
    "id": 1,
    "name": "Leanne Graham"
  }
]
```

---

# Purpose

This demo project exists to demonstrate:

* API request logging
* Request inspection
* Response viewing
* Debugging using the ShadowAPI DevTools panel
