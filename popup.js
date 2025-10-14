const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const addButton = document.getElementById("add");
const listDiv = document.getElementById("list");

// Load mappings from Chrome storage
async function loadMappings() {
  const { mappings } = await chrome.storage.local.get("mappings");
  renderMappings(mappings || {});
}

// Render mappings
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

  // Delete logic same as before
  listDiv.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const key = e.target.dataset.key;
      const { mappings } = await chrome.storage.local.get("mappings");
      delete mappings[key];
      await chrome.storage.local.set({ mappings });
      loadMappings();
    })
  );
}

// Add new mapping
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

  nameInput.value = "";
  urlInput.value = "";
  loadMappings();
});

// Initial load
loadMappings();
