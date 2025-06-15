document.querySelectorAll('button[data-color]').forEach(button => {
  button.addEventListener('click', () => {
    const color = button.getAttribute('data-color');
    chrome.storage.sync.set({ selectedColor: color });
  });
});

document.getElementById('remove-highlights').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        document.querySelectorAll('.custom-highlight').forEach(el => {
          const parent = el.parentNode;
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
        });
        localStorage.removeItem('highlightedText');
      }
    });
  });
});

const toggle = document.getElementById('toggle-mode');
chrome.storage.sync.get('isActive', data => {
  toggle.checked = data.isActive !== false;
});

toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ isActive: toggle.checked });
});