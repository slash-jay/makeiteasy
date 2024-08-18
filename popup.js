document.getElementById('captureBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "captureScreenshot" }, response => {
      if (response.screenshotUrl) {
          insertImage(response.screenshotUrl);
          saveNotepad(); // Save state after adding a screenshot
      }
  });
});

document.getElementById('saveBtn').addEventListener('click', saveNotepad);

document.getElementById('downloadBtn').addEventListener('click', downloadNotepad);

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset your notepad?')) {
      localStorage.removeItem('notepadContent');
      document.getElementById('noteContent').innerHTML = '';
  }
});

function insertImage(src) {
  const img = document.createElement('img');
  img.src = src;
  img.style.maxWidth = '100%';

  const range = document.getSelection().getRangeAt(0);
  range.deleteContents(); // Clear any selected content
  range.insertNode(img);

  // Ensure cursor moves after the image
  const br = document.createElement('br');
  range.insertNode(br);
  range.collapse(false);
  document.getSelection().removeAllRanges();
  document.getSelection().addRange(range);
}

function saveNotepad() {
  const noteContent = document.getElementById('noteContent').innerHTML;
  localStorage.setItem('notepadContent', noteContent);
}

function loadNotepad() {
  const savedContent = localStorage.getItem('notepadContent');
  if (savedContent) {
      document.getElementById('noteContent').innerHTML = savedContent;
  }
}

function downloadNotepad() {
  const noteContent = document.getElementById('noteContent').innerHTML;
  const blob = new Blob([noteContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'notepad.html';
  a.click();
  URL.revokeObjectURL(url);
}

loadNotepad(); // Load state on popup open

// Handle paste events to manage cursor and content
document.getElementById('noteContent').addEventListener('paste', (event) => {
  event.preventDefault(); // Prevent default paste behavior

  const items = event.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === 'file' && item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          const url = URL.createObjectURL(blob);

          insertImage(url); // Insert the image
          URL.revokeObjectURL(url); // Clean up the object URL
      } else {
          const text = event.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text); // Insert text
      }
  }
});
