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
  range.insertNode(img);
  range.collapse(false);

  // Ensure cursor moves after the image
  const br = document.createElement('br');
  range.insertNode(br);
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
