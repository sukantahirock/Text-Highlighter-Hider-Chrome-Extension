// Restore highlights on page load
window.addEventListener("DOMContentLoaded", () => {
  const highlights = JSON.parse(localStorage.getItem("highlightedText") || "[]");
  highlights.forEach(h => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const idx = node.nodeValue.indexOf(h.text);
      if (idx !== -1) {
        const range = document.createRange();
        range.setStart(node, idx);
        range.setEnd(node, idx + h.text.length);

        const span = document.createElement("span");
        span.className = "custom-highlight";
        span.style.backgroundColor = h.color;
        span.style.borderRadius = "3px";
        span.style.padding = "1px";
        range.surroundContents(span);
        break;
      }
    }
  });
});
