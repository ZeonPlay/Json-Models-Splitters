document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const json = JSON.parse(e.target.result);
        generateModelList(json);
      } catch(err) {
        alert('Gagal parse JSON: ' + err);
      }
    };
    reader.readAsText(file);
  });
  
  function generateModelList(json) {
    const container = document.getElementById('modelList');
    container.innerHTML = '';
    const version = json.format_version;
  
    Object.keys(json).forEach(key => {
      if (key === 'format_version') return;
  
      const item = document.createElement('div');
      item.className = 'model-item';
  
      const label = document.createElement('span');
      label.textContent = key;
  
      // Download button
      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = 'Download';
      downloadBtn.addEventListener('click', () => downloadModel(key, json[key], version));
  
      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.style.marginLeft = '8px';
      copyBtn.addEventListener('click', () => copyModel(key, json[key], version));
  
      const btnWrapper = document.createElement('div');
      btnWrapper.appendChild(downloadBtn);
      btnWrapper.appendChild(copyBtn);
  
      item.appendChild(label);
      item.appendChild(btnWrapper);
      container.appendChild(item);
    });
  }
  
  function downloadModel(key, modelData, version) {
    const obj = {
      format_version: version,
      [key]: modelData
    };
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const safeName = key.replace(/[:\/\\]/g, '_');
    const a = document.createElement('a');
    a.href = url;
    a.download = safeName + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  function copyModel(key, modelData, version) {
    const obj = {
      format_version: version,
      [key]: modelData
    };
    const text = JSON.stringify(obj, null, 2);
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('JSON untuk "' + key + '" telah disalin ke clipboard!');
      })
      .catch(err => {
        console.error('Gagal menyalin:', err);
        alert('Gagal menyalin JSON ke clipboard.');
      });
  }
  