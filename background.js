// Create context menu when extension loads
chrome.runtime.onInstalled.addListener(() => {
  const colors = [
    { id: "highlight-yellow", title: "Highlight Yellow", color: "yellow" },
    { id: "highlight-green", title: "Highlight Green", color: "lightgreen" },
    { id: "highlight-pink", title: "Highlight Pink", color: "pink" },
    { id: "hide-text", title: "🔐 Hide Text (#####)" },
    { id: "remove-highlight", title: "❌ Remove All Highlights" }
  ];

  for (const item of colors) {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ["selection"]
    });
  }

  chrome.storage.sync.set({ selectedColor: "yellow" });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("highlight-")) {
    const color = info.menuItemId.split("-")[1];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: highlightSelection,
      args: [color]
    });
  } else if (info.menuItemId === "hide-text") {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: hideSelection
  });
  }else if (info.menuItemId === "remove-highlight") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: removeAllHighlights
    });
  }
});

// Functions injected into the webpage
function highlightSelection(color) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  const span = document.createElement("span");
  span.className = "custom-highlight";
  span.style.backgroundColor = color;
  span.style.borderRadius = "3px";
  span.style.padding = "1px";

  try {
    range.surroundContents(span);
    saveHighlights();
    selection.removeAllRanges();
  } catch (e) {
    console.warn("Highlight failed:", e);
  }
}

function removeAllHighlights() {
  document.querySelectorAll(".custom-highlight").forEach(el => {
    const parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  });
  localStorage.removeItem("highlightedText");
}

function saveHighlights() {
  const highlights = Array.from(document.querySelectorAll('.custom-highlight')).map(el => ({
    text: el.innerText,
    color: el.style.backgroundColor
  }));
  localStorage.setItem('highlightedText', JSON.stringify(highlights));
}
function hideSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();
  if (!selectedText) return;

  const hiddenSpan = document.createElement("span");
  hiddenSpan.className = "custom-highlight hidden-text";
  hiddenSpan.textContent = "#".repeat(selectedText.length);
  hiddenSpan.style.backgroundColor = "gray";
  hiddenSpan.style.color = "black";
  hiddenSpan.style.borderRadius = "3px";
  hiddenSpan.style.padding = "1px";

  try {
    range.deleteContents();
    range.insertNode(hiddenSpan);
    saveHighlights();
    selection.removeAllRanges();
  } catch (e) {
    console.warn("Hiding failed:", e);
  }
}
