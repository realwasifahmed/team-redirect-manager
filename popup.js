const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const addButton = document.getElementById("add");
const listDiv = document.getElementById("list");

// ------------------------------
// LOCAL LOAD (used after add/delete)
// ------------------------------
async function loadMappings() {
  const { mappings = {} } = await chrome.storage.local.get("mappings");
  renderMappings(mappings);
}

// ------------------------------
// FULL LOAD: LOCAL + CLOUD MERGE
// ------------------------------
async function loadAllMappings() {
  // 1. Load local instantly (fast)
  const { mappings: localMappings = {} } = await chrome.storage.local.get(
    "mappings"
  );
  renderMappings(localMappings);

  // 2. Load cloud in background (slower)
  const cloudMappings = await loadMappingsFromSupabase();

  // 3. Merge
  const merged = mergeMappings(localMappings, cloudMappings);

  // 4. Save merged result to local
  await chrome.storage.local.set({ mappings: merged });

  // 5. Re-render full merged list
  renderMappings(merged);
}

// Initial load (use full merge)
loadAllMappings();

// ------------------------------
// RENDER
// ------------------------------
function renderMappings(mappings) {
  listDiv.innerHTML = "";
  Object.entries(mappings).forEach(([key, url]) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div>
        <span class="key">${key}.test</span>
        <span class="text-gray-500">→</span>
        <a href="${url}" target="_blank">${url}</a>
      </div>
      <button data-key="${key}" class="delete-btn">×</button>
    `;
    listDiv.appendChild(item);
  });

  // Delete logic
  listDiv.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const key = e.target.dataset.key;

      const confirmed = confirm(
        `Are you sure you want to delete "${key}.test"?`
      );
      if (!confirmed) return;

      // 1. DELETE FROM LOCAL STORAGE
      const { mappings = {} } = await chrome.storage.local.get("mappings");
      delete mappings[key];
      await chrome.storage.local.set({ mappings });

      // 2. DELETE FROM SUPABASE
      deleteMappingFromSupabase(key);

      // 3. Reload from local (fast)
      loadMappings();
    })
  );
}

// ------------------------------
// ADD NEW MAPPING
// ------------------------------
addButton.addEventListener("click", async () => {
  const key = nameInput.value.trim();
  const url = urlInput.value.trim();

  if (!key || !url) {
    alert("Please fill both fields.");
    return;
  }

  const { mappings = {} } = await chrome.storage.local.get("mappings");
  mappings[key] = url;
  await chrome.storage.local.set({ mappings });

  // Save to Supabase too
  saveMappingToSupabase(key, url);

  nameInput.value = "";
  urlInput.value = "";
  // Reload from local (fast)
  loadMappings();
});

// -----------------------------------------------------------
// MIGRATION LOGIC
// -----------------------------------------------------------
async function migrateLocalMappingsToSupabase() {
  try {
    const { migrated } = await chrome.storage.local.get("migrated");
    if (migrated) {
      console.log("Already migrated. Skipping.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      console.warn("User not logged in, cannot migrate");
      return;
    }

    const { mappings = {} } = await chrome.storage.local.get("mappings");

    if (Object.keys(mappings).length === 0) {
      console.log("No mappings to migrate.");
      return;
    }

    const rows = Object.entries(mappings).map(([key, url]) => ({
      user_id: user.id,
      key,
      url,
    }));

    const { error } = await supabase.from("redirects").insert(rows);

    if (error) {
      console.error("Migration error:", error);
      return;
    }

    await chrome.storage.local.set({ migrated: true });

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

// -----------------------------------------------------------
// CALL MIGRATION AFTER LOGIN
// -----------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabase.auth.getSession();
  if (data?.session?.user) {
    migrateLocalMappingsToSupabase();
  }
});

// -----------------------------------------------------------
// SAVE NEW REDIRECT TO SUPABASE (ON ADD)
// -----------------------------------------------------------
async function saveMappingToSupabase(key, url) {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;

  if (!user) {
    console.warn("User not logged in, cannot save redirect");
    return;
  }

  const { error } = await supabase.from("redirects").insert([
    {
      user_id: user.id,
      key,
      url,
    },
  ]);

  if (error) {
    console.error("Supabase Insert Error:", error);
  } else {
    console.log("Supabase: Redirect saved");
  }
}

// -----------------------------------------------------------
// DELETE FROM SUPABASE
// -----------------------------------------------------------
async function deleteMappingFromSupabase(key) {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;

  if (!user) {
    console.warn("User not logged in, cannot delete redirect");
    return;
  }

  const { error } = await supabase
    .from("redirects")
    .delete()
    .eq("user_id", user.id)
    .eq("key", key);

  if (error) {
    console.error("Supabase Delete Error:", error);
  } else {
    console.log("Supabase: Redirect deleted");
  }
}

// -----------------------------------------------------------
// LOGOUT LOGIC
// -----------------------------------------------------------
document.getElementById("logout-btn").addEventListener("click", async () => {
  const confirmed = confirm("Are you sure you want to log out?");
  if (!confirmed) return;

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error);
    alert("Logout failed.");
    return;
  }

  await chrome.storage.local.remove(["mappings", "migrated"]);

  window.location.href = "auth.html";
});

// -----------------------------------------------------------
// LOAD FROM SUPABASE
// -----------------------------------------------------------
async function loadMappingsFromSupabase() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;

  if (!user) {
    console.warn("Cannot load redirects — user not logged in");
    return {};
  }

  const { data, error } = await supabase
    .from("redirects")
    .select("key, url")
    .eq("user_id", user.id);

  if (error) {
    console.error("Supabase Load Error:", error);
    return {};
  }

  const mappings = {};
  data.forEach((row) => {
    mappings[row.key] = row.url;
  });

  return mappings;
}

// -----------------------------------------------------------
// MERGE LOCAL + CLOUD
// -----------------------------------------------------------
function mergeMappings(local, cloud) {
  return {
    ...local,
    ...cloud,
  };
}
