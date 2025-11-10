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

// Handle omnibox suggestions (command: 'site')
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const results = Object.entries(mappings)
    .filter(([key]) => key.toLowerCase().includes(text.toLowerCase()))
    .map(([key, url]) => ({
      content: `${key}.test`, // what will be inserted when user selects
      description: `<match>${key}.test</match> → <url>${url}</url>`,
    }));

  // If no match found, offer to open the raw .test domain
  if (results.length === 0 && text.trim()) {
    results.push({
      content: `${text}.test`,
      description: `<match>${text}.test</match> → <dim>no redirect saved</dim>`,
    });
  }

  suggest(results);
});

// Handle command execution
chrome.omnibox.onInputEntered.addListener((text) => {
  const key = text.replace(".test", "").trim();
  const redirectBase = mappings[key];
  let url;

  if (redirectBase) {
    url = redirectBase;
  } else {
    url = `https://${key}.test`;
  }

  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  chrome.tabs.update({ url });
});

// Listen to any navigation event (your existing redirect logic)
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

      console.log(
        `Redirecting ${url.hostname}${url.pathname} → ${newUrl.href}`
      );
      chrome.tabs.update(details.tabId, { url: newUrl.href });
    }
  } catch (err) {
    console.error("Navigation intercept failed:", err);
  }
});
