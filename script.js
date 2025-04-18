let jsonList = [];
let versions = [];
let filenames = [];

const fileInput = document.getElementById('fileInput');
const modelList = document.getElementById('modelList');
const mergeSelBtn = document.getElementById('mergeSelectedBtn');
const mergeAllBtn = document.getElementById('mergeFilesBtn');

fileInput.addEventListener('change', function(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  jsonList = [];
  versions = [];
  filenames = [];
  modelList.innerHTML = '';

  let loaded = 0;
  files.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const js = JSON5.parse(evt.target.result);
        jsonList.push(js);
        versions.push(js.format_version);
        filenames.push(file.name);
      } catch(err) {
        alert(`Gagal parse ${file.name}: ${err}`);
      }
      loaded++;
      if (loaded === files.length) {
        generateModelList();
        document.querySelector('.merge-wrapper').style.display = 'flex';
      }
    };
    reader.readAsText(file);
  });
});

function generateModelList() {
  modelList.innerHTML = '';

  jsonList.forEach((json, idx) => {
    const version = json.format_version;
    const fname = filenames[idx];

    const section = document.createElement('div');
    section.className = 'file-section';

    const title = document.createElement('h2');
    title.textContent = fname;
    section.appendChild(title);

    Object.keys(json).forEach(key => {
      if (key === 'format_version') return;

      const item = document.createElement('div');
      item.className = 'model-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = key;
      checkbox.dataset.fileIndex = idx;

      const label = document.createElement('span');
      label.textContent = key;

      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = 'Download';
      downloadBtn.addEventListener('click', () => {
        downloadModel(key, json[key], version);
      });

      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.style.marginLeft = '8px';
      copyBtn.addEventListener('click', () => {
        copyModel(key, json[key], version);
      });

      const btnWrapper = document.createElement('div');
      btnWrapper.appendChild(downloadBtn);
      btnWrapper.appendChild(copyBtn);

      item.appendChild(checkbox);
      item.appendChild(label);
      item.appendChild(btnWrapper);
      section.appendChild(item);
    });

    modelList.appendChild(section);
  });
}

function downloadModel(key, modelData, version) {
  const obj = { format_version: version, [key]: modelData };
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${key.replace(/[:\/\\]/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copyModel(key, modelData, version) {
  const obj = { format_version: version, [key]: modelData };
  const text = JSON.stringify(obj, null, 2);
  navigator.clipboard.writeText(text)
    .then(() => alert(`JSON "${key}" telah disalin!`))
    .catch(() => alert('Gagal menyalin ke clipboard.'));
}

mergeSelBtn.addEventListener('click', () => {
  const checked = Array.from(
    document.querySelectorAll('#modelList input[type=checkbox]:checked')
  );
  
  if (checked.length < 2) {
    alert('Pilih minimal 2 model untuk merge!');
    return;
  }

  const merged = {};
  let maxVersion = "0.0.0";

  checked.forEach(cb => {
    const key = cb.value;
    const fileIdx = parseInt(cb.dataset.fileIndex);
    const json = jsonList[fileIdx];
    const version = json.format_version;

    merged[key] = json[key];
    if (compareVersion(version, maxVersion) > 0) {
      maxVersion = version;
    }
  });

  const final = { format_version: maxVersion, ...merged };
  const blob = new Blob([JSON.stringify(final, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'geometry.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

mergeAllBtn.addEventListener('click', () => {
  if (jsonList.length < 2) {
    alert('Upload minimal 2 file.');
    return;
  }

  const merged = {};
  let maxVersion = "0.0.0";

  jsonList.forEach((json, idx) => {
    const version = json.format_version;
    if (compareVersion(version, maxVersion) > 0) {
      maxVersion = version;
    }

    Object.keys(json).forEach(k => {
      if (k !== 'format_version') {
        merged[k] = json[k];
      }
    });
  });

  const final = { format_version: maxVersion, ...merged };
  const blob = new Blob([JSON.stringify(final, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'geometry.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Fungsi bandingkan 2 versi semver
function compareVersion(v1, v2) {
  const a = v1.split('.').map(n => parseInt(n));
  const b = v2.split('.').map(n => parseInt(n));
  for (let i = 0; i < 3; i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
