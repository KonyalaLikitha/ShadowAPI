# ShadowAPI Demo App

This demo frontend application is used to generate API requests for testing the **ShadowAPI DevTools Extension**.

The page fetches user data from a public API and displays it on the screen.

These API calls can be inspected in the **ShadowAPI DevTools panel**.

---

## How to Run the Demo

1. Open the demo page:

examples/demo-app/index.html

2. Click the **Load Users** button.

3. The page will send a request to:

https://jsonplaceholder.typicode.com/users

4. Open Chrome DevTools:

F12 → ShadowAPI Tab

You will see the API request logged in the **ShadowAPI Control Panel**.

---

## Purpose of This Demo

This demo helps developers:

* Test the ShadowAPI DevTools extension
* Observe API requests in real time
* Verify request logging functionality

---

## Example Request

GET https://jsonplaceholder.typicode.com/users
