const dropZone      = document.getElementById('dropZone');
const fileInput     = document.getElementById('fileInput');
const chooseBtn     = document.getElementById('chooseBtn');
const fileBar       = document.getElementById('fileBar');
const fileName      = document.getElementById('fileName');
const resetBtn      = document.getElementById('resetBtn');
const bgColor       = document.getElementById('bgColor');
const clearColor    = document.getElementById('clearColor');
const removeBtn     = document.getElementById('removeBtn');
const loader        = document.getElementById('loader');
const previewOrig   = document.getElementById('previewOriginal');
const originalImg   = document.getElementById('originalImg');
const previewResult = document.getElementById('previewResult');
const originalImg2  = document.getElementById('originalImg2');
const resultImg     = document.getElementById('resultImg');
const downloadBtn   = document.getElementById('downloadBtn');

let selectedFile = null;
let transparent  = true; // default: transparent output

// ── File selection ──────────────────────────────────────────────────────────

// "Choose File" button — only this opens the dialog, not the whole drop zone
chooseBtn.addEventListener('click', e => {
  e.stopPropagation();
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) setFile(fileInput.files[0]);
  fileInput.value = ''; // reset so same file can be re-selected
});

// Drag & drop on the drop zone
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('over');
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) setFile(f);
});

function setFile(f) {
  selectedFile = f;

  // show file bar, hide drop zone
  dropZone.hidden = true;
  fileName.textContent = f.name;
  fileBar.hidden = false;

  // show original preview, hide result
  const url = URL.createObjectURL(f);
  originalImg.src  = url;
  originalImg2.src = url;
  previewOrig.hidden   = false;
  previewResult.hidden = true;

  removeBtn.disabled = false;
  loader.hidden = true;
}

// ── Reset ───────────────────────────────────────────────────────────────────

resetBtn.addEventListener('click', reset);

function reset() {
  selectedFile = null;

  fileBar.hidden  = true;
  dropZone.hidden = false;

  previewOrig.hidden   = true;
  previewResult.hidden = true;
  loader.hidden        = true;

  originalImg.src  = '';
  originalImg2.src = '';
  resultImg.src    = '';

  removeBtn.disabled = true;
}

// ── Background color toggle ─────────────────────────────────────────────────

clearColor.classList.add('active'); // start as transparent
clearColor.addEventListener('click', () => {
  transparent = !transparent;
  clearColor.classList.toggle('active', transparent);
});

// ── Remove background ───────────────────────────────────────────────────────

removeBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  loader.hidden        = false;
  previewOrig.hidden   = true;
  previewResult.hidden = true;
  removeBtn.disabled   = true;

  const form = new FormData();
  form.append('file', selectedFile);
  form.append('bg_color', transparent ? '' : bgColor.value);

  try {
    const res = await fetch('/remove-bg', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Server error ' + res.status);

    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    resultImg.src        = url;
    downloadBtn.href     = url;
    downloadBtn.download = 'result.' + (blob.type === 'image/jpeg' ? 'jpg' : 'png');

    previewResult.hidden = false;
  } catch (err) {
    alert('Error: ' + err.message);
    previewOrig.hidden = false; // restore original view on error
  } finally {
    loader.hidden      = false; // keep loader hidden
    loader.hidden      = true;
    removeBtn.disabled = false;
  }
});
