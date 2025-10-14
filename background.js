let mappings = {};

// Load mappings at startup
chrome.storage.local.get("mappings", (data) => {
  mappings = data.mappings || {};
});

// Listen for storage updates
chrome.storage.onChanged.addListener((changes) => {
  if (changes.mappings) {
    mappings = changes.mappings.newValue || {};
  }
});

// Listen to any navigation event
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  try {
    const url = new URL(details.url);

    // Only handle .test domains
    if (!url.hostname.endsWith(".test")) return;

    const key = url.hostname.replace(".test", "");
    const redirectBase = mappings[key];

    if (redirectBase) {
      // Preserve path and query for permalink-style redirect
      const newUrl = new URL(redirectBase);
      newUrl.pathname = url.pathname;
      newUrl.search = url.search;
      newUrl.hash = url.hash;

      console.log(`Redirecting ${url.hostname}${url.pathname} → ${newUrl.href}`);
      chrome.tabs.update(details.tabId, { url: newUrl.href });
    }
  } catch (err) {
    console.error("Navigation intercept failed:", err);
  }
});
