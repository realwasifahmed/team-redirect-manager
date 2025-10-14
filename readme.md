# 🧭 Team Redirect Manager

**Version:** 1.1
**Author:** Wasif Ahmed
**Description:**
Team Redirect Manager is a lightweight Chrome extension that helps developers and teams manage local `.test` domain redirects efficiently. It allows you to map `.test` domains (e.g. `client1.test`) to real URLs (e.g. `https://client1.vercel.app`) and automatically redirect navigation requests in Chrome.

---

## 🚀 Features

* 🔁 Automatically redirect any `.test` domain to a configured target URL.
* 🧩 Simple popup interface to add, update, or remove mappings.
* 💾 Persistent storage using Chrome’s local storage API.
* 🔎 Works seamlessly across all tabs and sessions.
* ⚙️ Supports path, query string, and hash preservation — perfect for permalink redirects.

---

## 📁 File Structure

```
Team-Redirect-Manager/
│
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── popup.css
└── icons/
    └── icon128.png
```

---

## ⚙️ How It Works

### 1. Background Script (`background.js`)

* Loads stored mappings from `chrome.storage.local`.
* Listens for navigation events using `chrome.webNavigation.onBeforeNavigate`.
* Checks if the requested domain ends with `.test`.
* Looks up the mapped base URL from storage.
* Redirects the tab to the mapped URL, preserving:

  * **pathname**
  * **query parameters**
  * **hash fragments**

Example:

```
client1.test/about?ref=menu#team → https://client1.vercel.app/about?ref=menu#team
```

---

### 2. Popup Interface (`popup.html` + `popup.js`)

* Displays a simple form to add or update mappings:

  * `Short name` → used for `.test` domain (e.g. `client1`)
  * `Destination URL` → the full redirect target (e.g. `https://client1.vercel.app`)
* Shows all saved mappings in a list with delete buttons.
* Automatically updates the UI and background mappings when changes are made.

---

## 🧩 Manifest Details (`manifest.json`)

* **Manifest Version:** 3
* **Permissions:**

  * `storage` – to save domain mappings.
  * `webNavigation` – to intercept `.test` navigations.
  * `tabs` – to update the tab URL.
* **Host Permissions:** `<all_urls>` to allow redirection across all sites.
* **Background:** Runs a service worker (`background.js`).
* **Action:** Provides a popup (`popup.html`) when clicked.

---

## 💻 Installation (Developer Mode)

1. Open **Chrome** and go to:

   ```
   chrome://extensions
   ```
2. Enable **Developer mode** (top-right corner).
3. Click **“Load unpacked”**.
4. Select your project folder (the one containing `manifest.json`).

The extension should now appear in your toolbar 🎉

---

## 🧠 Usage

1. Click the **Team Redirect Manager** icon in Chrome.
2. Enter:

   * **Short name** (e.g., `client1`)
   * **Destination URL** (e.g., `https://client1.vercel.app`)
3. Click **Add / Update**.
4. Visit `client1.test` in your browser — you’ll be redirected automatically.
5. Manage saved redirects directly from the popup.

---

## 🧹 Removing or Updating Redirects

* Click the **×** button next to a mapping to delete it.
* Re-add the same `.test` name with a different URL to update it.

---

## ⚠️ Notes & Limitations

* Works only for domains ending in `.test`.
* Requires Chrome 88+ (Manifest V3 support).
* Redirects only trigger on navigation events (not programmatic fetches).
* URLs must be **valid** (must start with `http://` or `https://`).

---

## 📜 License

MIT License
Free to use and modify for personal or team projects.
