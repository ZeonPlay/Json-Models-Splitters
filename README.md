# Geometry Splitter & Merger Tool  
🌏 **Bahasa Indonesia** | [**English**](#english-version)

---

## 📋 Deskripsi  
Alat ini memungkinkan Anda untuk:  
1. **Memisahkan** model geometry Minecraft dari file JSON menjadi file terpisah.  
2. **Menggabungkan** model dari beberapa file JSON menjadi satu file.  
3. Mendukung format `format_version` lama hingga terbaru (contoh: 1.8.0, 1.12.0, dll).  

---

## 🚀 Cara Menggunakan  

### 1. Unggah File JSON  
- Klik tombol **Pilih JSON File**.  
- Pilih satu atau lebih file JSON model Minecraft.  
- File akan diproses otomatis. Jika gagal, pesan error akan muncul.  

### 2. Operasi Split Model  
- Setelah file diunggah, daftar model akan muncul.  
- Untuk **setiap model**:  
  - **Download**: Klik tombol `Download` untuk menyimpan model sebagai file JSON terpisah.  
  - **Copy**: Klik tombol `Copy` untuk menyalin teks JSON ke clipboard.  

### 3. Operasi Merge Model  
#### Opsi 1: Merge Selected (Gabungkan Model Terpilih)  
1. Centang **minimal 2 model** dari daftar.  
2. Klik tombol **Merge Selected**.  
3. File hasil gabungan (`geometry.json`) akan otomatis terunduh.  

#### Opsi 2: Merge All Files (Gabungkan Semua File)  
1. Pastikan Anda mengunggah **minimal 2 file**.  
2. Klik tombol **Merge All Files**.  
3. Semua model dari semua file akan digabung menjadi `geometry.json`.  

---

## ⚠️ Catatan Penting  
- **Format File**:  
  - File harus berekstensi `.json` dan memiliki struktur model geometry yang valid.  
  - Pastikan file memiliki properti `format_version`.  
- **Aturan Merge**:  
  - Model dengan nama yang sama akan **ditimpa** oleh file yang diunggah terakhir.  
- **Error Umum**:  
  - `Pilih minimal 2 model untuk merge!`: Centang minimal 2 model sebelum merge.  
  - `Upload minimal 2 file`: Diperlukan untuk **Merge All Files**.  

---

## ❓ Pertanyaan Umum (FAQ)  
**Q: Apakah alat ini bisa digunakan untuk file resource pack Minecraft?**  
A: Ya, selama file JSON memiliki struktur model geometry yang valid.  

**Q: Bagaimana cara menentukan versi `format_version` di file hasil merge?**  
A: Versi tertinggi dari model yang digabung akan digunakan secara otomatis.  

**Q: Bisakah model dari versi berbeda (contoh: 1.8.0 dan 1.16.0) digabung?**  
A: Bisa, tetapi pastikan model tersebut kompatibel di Minecraft.    

---

# English Version  

## 📋 Description  
This tool allows you to:  
1. **Split** Minecraft geometry models from JSON files into individual files.  
2. **Merge** models from multiple JSON files into one.  
3. Supports all `format_version` (e.g., 1.8.0, 1.12.0, etc.).  

---

## 🚀 How to Use  

### 1. Upload JSON Files  
- Click the **Select JSON File** button.  
- Choose one or more Minecraft model JSON files.  
- Files will be processed automatically. Errors will display if parsing fails.  

### 2. Split Models  
- After uploading, a list of models will appear.  
- For **each model**:  
  - **Download**: Click `Download` to save the model as a separate JSON file.  
  - **Copy**: Click `Copy` to copy the JSON text to your clipboard.  

### 3. Merge Models  
#### Option 1: Merge Selected  
1. Check **at least 2 models** from the list.  
2. Click the **Merge Selected** button.  
3. The merged file (`geometry.json`) will download automatically.  

#### Option 2: Merge All Files  
1. Ensure you’ve uploaded **at least 2 files**.  
2. Click the **Merge All Files** button.  
3. All models from all files will be merged into `geometry.json`.  

---

## ⚠️ Important Notes  
- **File Requirements**:  
  - Files must have a `.json` extension and valid geometry model structure.  
  - Ensure the `format_version` property exists.  
- **Merge Rules**:  
  - Models with the same name will be **overwritten** by the last uploaded file.  
- **Common Errors**:  
  - `Select at least 2 models to merge!`: Check at least 2 models before merging.  
  - `Upload at least 2 files`: Required for **Merge All Files**.  

---

## ❓ Frequently Asked Questions (FAQ)  
**Q: Can this tool work with Minecraft resource pack JSON files?**  
A: Yes, as long as the JSON files have valid geometry model structures.  

**Q: How is the `format_version` determined in the merged file?**  
A: The highest version from the merged models is used automatically.  

**Q: Can models from different versions (e.g., 1.8.0 and 1.16.0) be merged?**  
A: Yes, but ensure the models are compatible in Minecraft.    

--- 

🔧 **Open Source**: Feel free to modify or contribute to the code!  