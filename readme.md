# 🧭 Team Redirect Manager

**Version:** 1.3
**Author:** Wasif Ahmed

**Team Redirect Manager** is a powerful Chrome extension for developers and teams that allows redirecting local `.test` domains (like `client1.test`) to real project URLs (like `https://client1.vercel.app`).

Now upgraded with:

* 🔐 **Supabase authentication (Login / Signup)**
* ☁️ **Cloud-sync redirects per user**
* 🔄 **Local → Cloud migration system**
* 🧩 **Merged loading (instant local + background cloud)**
* 🔑 **Secure key handling using `supabase-example.js`**
* 💬 **Smart Omnibox command (`site`) with autocomplete suggestions**

---

# 🚀 Features

### 🔁 Automatic Redirects

Redirect `.test` domains to mapped URLs automatically.

### 🧩 Popup Interface

Add/update/delete redirects with a clean UI.

### 💾 Local + Cloud Storage

* Saved locally for instant load
* Synced to Supabase for cloud backup
* Auto-merged for best experience

### 🔄 Automatic Migration

Old local mappings are migrated to Supabase once after login.

### ☁️ User-based Data Sync

Each user gets their own redirect table entries.

### 🗑️ Safe Delete

Redirects prompt a confirmation before deletion both locally and from cloud.

### 🔐 Logout

Secure Supabase sign-out with local cache clearing.

### 💡 Omnibox Command (`site`)

Type:

```
site client
```

And instantly get:

```
client1.test → https://client1.vercel.app
```

Press **Enter** to navigate instantly.

---

# 📁 File Structure

```
Team-Redirect-Manager/
│
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── popup.css
├── auth.html
├── auth.js
├── auth.css
├── auth-check.js
│
├── supabase-lib.js             # Supabase JS library (local, CSP-compliant)
├── supabase.js                 # Your REAL keys (IGNORED from Git)
├── supabase-example.js         # Template to commit for others
│
└── icons/
    └── icon128.png
```

---

# 🛠️ Supabase Setup (Required)

To run this extension with cloud sync, you must set up Supabase.

### 1. Create a Supabase project

Go to: [https://supabase.com](https://supabase.com)

### 2. Create a table:

#### `redirects` table

| Column     | Type      | Notes           |
| ---------- | --------- | --------------- |
| id         | uuid      | default uuid()  |
| user_id    | uuid      | required        |
| key        | text      | redirect name   |
| url        | text      | redirect target |
| created_at | timestamp | auto            |

---

# 🔐 Required RLS Policies (IMPORTANT)

Go to **Auth → Policies** in Supabase and add these:

### SELECT

```sql
auth.uid() = user_id
```

### INSERT

```sql
auth.uid() = user_id
```

### UPDATE

```sql
auth.uid() = user_id
```

### DELETE

```sql
auth.uid() = user_id
```

This ensures **each user only accesses their own redirects**.

---

# 🔑 Supabase Keys Setup (IMPORTANT)

Supabase keys must be loaded **locally** for Chrome extensions due to strict CSP rules.

### 1. You will see this file in the repo:

```
supabase-example.js
```

Contents:

```js
const SUPABASE_URL = "YOUR_URL_HERE";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 2. Copy it and rename:

```
supabase.js
```

### 3. Add to `.gitignore`:

```
supabase.js
```

### 4. Insert **your** URL + ANON key inside `supabase.js`.

Done.
This keeps your real keys safe while letting the extension run normally.

---

# ⚙️ How It Works

## 1. Background Logic (`background.js`)

### 🔄 Redirect Interception

Intercepts navigation to:

```
*.test
```

Preserves:

* Path
* Query
* Hash

### 💬 Omnibox (`site`)

Provides matching suggestions based on redirect mappings.

---

## 2. Popup Interface (`popup.html` + `popup.js`)

### Local + Cloud Merge Flow

1. Load local mappings instantly
2. Fetch cloud mappings in background
3. Merge them
4. Save merged version locally
5. Render updated list

This gives **instant UI + accurate cloud sync**.

---

## 3. Authentication (`auth.html`)

Includes:

* Email/password sign up
* Email/password login
* Error feedback
* Beautiful UI/UX
* Redirect to main popup after login

---

# 💻 Installation (Developer Mode)

1. Open Chrome
2. Visit:

   ```
   chrome://extensions
   ```
3. Enable **Developer mode**
4. Click **Load Unpacked**
5. Select the folder containing `manifest.json`

---

# 🧠 Usage

### ▶️ Using the Popup

1. Open the extension

2. Add:

   * **Short name:** `client1`
   * **URL:** `https://client1.vercel.app`

3. Visit:

```
client1.test
```

Redirects instantly.

---

### 💬 Using the Omnibox

1. Type:

```
site client
```

2. Choose suggestion:

```
client1.test → https://client1.vercel.app
```

3. Press Enter
   ➡ Opens the mapped site instantly.

---

# 🗂️ Managing Redirects

* **Delete** → With confirmation
* **Update** → Re-add with same name
* **Cloud + Local Sync** → Automatic
* **Logout** → Clears session & local storage

---

# ⚠️ Notes & Limitations

* Only `.test` domains are supported
* Chrome MV3 required (Chrome 88+)
* Redirects only affect navigations (not XHR/fetch)
* URLs must include `http://` or `https://`

---

# 🧩 Future Enhancements

* Editing redirect entries
* Tagging and grouping redirects
* Shared team cloud space
* Omnibox quick-add command
* Sync status indicators
* Import/export mappings

---

# 📜 License

**MIT License**
Free to use, modify, and distribute.
