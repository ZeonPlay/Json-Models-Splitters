let jsonList = [];
let versions = [];
let filenames = [];

const fileInput = document.getElementById('fileInput');
const modelList = document.getElementById('modelList');
const mergeSelBtn = document.getElementById('mergeSelectedBtn');
const mergeAllBtn = document.getElementById('mergeFilesBtn');

const translations = {
  id: {
    title: 'Geometry Splitter & Merger',
    description: 'Upload satu atau lebih file JSON Minecraft untuk split dan merge model-modelnya.',
    customFileBtn: 'Pilih JSON File',
    mergeSelectedBtn: 'Merge Yang Dipilih',
    mergeFilesBtn: 'Merge Semua File',
    alertMergeMin: 'Pilih minimal 2 model untuk merge!',
    alertUploadMin: 'Upload minimal 2 file.',
    alertFailedParse: 'Gagal parse ',
    alertCopySuccess: 'JSON "',
    alertCopyFailed: 'Gagal menyalin ke clipboard.',
    downloaded: ' telah disalin!',
    download: 'Download',
    copy: 'Copy'
  },
  en: {
    title: 'Geometry Splitter & Merger',
    description: 'Upload one or more Minecraft JSON files to split and merge the models.',
    customFileBtn: 'Select JSON File',
    mergeSelectedBtn: 'Merge Selected',
    mergeFilesBtn: 'Merge All Files',
    alertMergeMin: 'Select at least 2 models to merge!',
    alertUploadMin: 'Upload at least 2 files.',
    alertFailedParse: 'Failed to parse ',
    alertCopySuccess: 'JSON "',
    alertCopyFailed: 'Failed to copy to clipboard.',
    downloaded: ' has been copied!',
    download: 'Download',
    copy: 'Copy'
  }
};

function getSystemLanguage() {
  const lang = (navigator.language || navigator.userLanguage).toLowerCase();
  return lang.startsWith('id') ? 'id' : 'en';
}

function applyTranslation(lang) {
  const translation = translations[lang];
  
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    element.textContent = translation[key];
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const lang = getSystemLanguage();
  applyTranslation(lang);
});

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
        alert(translations[getSystemLanguage()].alertFailedParse + file.name + ': ' + err);
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
      downloadBtn.textContent = translations[getSystemLanguage()].download;
      downloadBtn.addEventListener('click', () => {
        downloadModel(key, json[key], version);
      });

      const copyBtn = document.createElement('button');
      copyBtn.textContent = translations[getSystemLanguage()].copy;
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

  applyTranslation(getSystemLanguage());
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
    .then(() => alert(translations[getSystemLanguage()].alertCopySuccess + key + translations[getSystemLanguage()].downloaded))
    .catch(() => alert(translations[getSystemLanguage()].alertCopyFailed));
}

mergeSelBtn.addEventListener('click', () => {
  const checked = Array.from(
    document.querySelectorAll('#modelList input[type=checkbox]:checked')
  );
  
  if (checked.length < 2) {
    alert(translations[getSystemLanguage()].alertMergeMin);
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
    alert(translations[getSystemLanguage()].alertUploadMin);
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

function compareVersion(v1, v2) {
  const a = v1.split('.').map(n => parseInt(n));
  const b = v2.split('.').map(n => parseInt(n));
  for (let i = 0; i < 3; i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}