Absolutely — let’s create a **new, polished and updated README** for your improved version (`v1.2`) that now includes your **Omnibox command system (`site`)** with smart autocomplete and redirect preview.

Here’s the updated version 👇

---

# 🧭 Team Redirect Manager

**Version:** 1.2
**Author:** Wasif Ahmed
**Description:**
Team Redirect Manager is a powerful Chrome extension for developers and teams that automatically redirects local `.test` domains (like `client1.test`) to real project URLs (like `https://client1.vercel.app`).
Now enhanced with a **command system (`site`)** that lets you access redirects directly from Chrome’s address bar — complete with smart suggestions and instant navigation.

---

## 🚀 Features

* 🔁 **Automatic Redirects:** Instantly redirect any `.test` domain to its mapped live URL.
* 🧩 **Popup Interface:** Add, update, or remove redirects with an intuitive UI.
* 💾 **Persistent Storage:** Uses Chrome’s local storage to remember all mappings.
* ⚙️ **Full URL Preservation:** Keeps your paths, queries, and hash fragments intact.
* 💡 **New! Omnibox Command (`site`):**

  * Type `site` + space in Chrome’s address bar to trigger command mode.
  * Get live suggestions like `client1.test → https://client1.vercel.app`.
  * Hit **Enter** to open the mapped site instantly.
* 🔎 **Search-as-you-type:** Autocomplete suggestions appear dynamically as you type.
* 🌐 **Works Everywhere:** Active across all tabs and browser sessions.

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

### 🧠 1. Background Script (`background.js`)

Handles two major features:

#### 🔄 Redirect Logic

* Intercepts `.test` domain navigations via `chrome.webNavigation.onBeforeNavigate`.
* Checks stored mappings and redirects the tab to its corresponding URL.
* Automatically preserves:

  * Pathname
  * Query parameters
  * Hash fragments

**Example:**

```
client1.test/about?ref=menu#team → https://client1.vercel.app/about?ref=menu#team
```

#### 💬 Omnibox Command System

* Declared with keyword `"site"` in `manifest.json`.
* When the user types `site` in the Chrome address bar:

  * Suggestions appear for matching `.test` mappings.
  * Each suggestion shows both sides of the redirect:

    ```
    client1.test → https://client1.vercel.app
    ```
  * Selecting a suggestion or pressing Enter navigates instantly.

---

### 🧩 2. Popup Interface (`popup.html` + `popup.js`)

* Provides a friendly UI for managing mappings.
* Input fields:

  * **Short name** → used as `.test` domain (e.g., `client1`)
  * **Destination URL** → redirect target (e.g., `https://client1.vercel.app`)
* Displays all saved mappings in a scrollable list.
* Supports easy delete and update functionality.
* Updates storage and UI in real time.

---

## 🧩 Manifest Details (`manifest.json`)

* **Manifest Version:** 3
* **Permissions:**

  * `storage` – Save domain mappings persistently.
  * `webNavigation` – Intercept `.test` navigations.
  * `tabs` – Open or update browser tabs.
* **Host Permissions:** `<all_urls>`
* **Omnibox Keyword:** `site`
* **Background:** `background.js` as service worker.
* **Action:** Popup window (`popup.html`).

---

## 💻 Installation (Developer Mode)

1. Open **Chrome** and navigate to:

   ```
   chrome://extensions
   ```
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **“Load unpacked”**.
4. Select your project folder containing `manifest.json`.
5. The **Team Redirect Manager** icon will appear in your toolbar 🎉

---

## 🧠 Usage

### ▶️ Popup Interface

1. Click the **Team Redirect Manager** icon in Chrome.
2. Add a new redirect:

   * **Short name:** `client1`
   * **Destination URL:** `https://client1.vercel.app`
3. Click **Add / Update**.
4. Visit `client1.test` in Chrome — you’ll be redirected automatically.

### 💬 Omnibox Command

1. In the address bar, type:

   ```
   site client
   ```
2. Choose from the live suggestions:

   ```
   client1.test → https://client1.vercel.app
   ```
3. Hit **Enter** — Chrome opens the mapped URL instantly.

---

## 🧹 Managing Redirects

* 🗑️ **Delete:** Click the × button beside any mapping.
* ✏️ **Update:** Re-add a mapping with the same name but a new URL.
* 🔄 Changes sync automatically — no reload required.

---

## ⚠️ Notes & Limitations

* Works **only for `.test` domains**.
* Requires **Chrome 88+** (Manifest V3 support).
* Redirects only affect **navigation requests** — not fetch/XHR requests.
* URLs must start with `http://` or `https://`.
* Omnibox commands currently support one keyword: `site`.

---

## 🧩 Upcoming Enhancements

* 🗂️ Add optional descriptions for each redirect.
* ☁️ Sync mappings via Firebase or a shared backend.
* ⌨️ Add `/add` command for quick creation via Omnibox.
* 🔐 Team-based sharing and cloud sync.

---

## 📜 License

**MIT License**
Free to use, modify, and share for personal or team development projects.
