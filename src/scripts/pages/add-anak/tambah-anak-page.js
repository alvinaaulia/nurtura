import { tambahAnak } from "../../data/anakApi.js";
import "../../../styles/anak.css";

const TambahAnakPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "/login";
      return "";
    }

    return `
      <main class="main-content-anak page-shell">
          <div class="form-container">
            <div class="form-heading"><div><h2>Tambah Data Anak</h2><p>Masukkan hasil pengukuran terbaru dengan teliti.</p></div><span class="required-note">* Wajib diisi</span></div>
            <form id="formTambahAnak" class="form-anak">
              <div class="form-group">
                <label for="fotoFile">Upload Foto Anak</label>
                <div class="photo-upload-row"><label class="photo-dropzone" for="fotoFile"><span class="photo-upload-icon" aria-hidden="true">＋</span><span><strong>Pilih foto anak</strong><small>JPG atau PNG, maksimal 2 MB</small></span></label><input class="sr-only-file" type="file" id="fotoFile" name="fotoFile" accept="image/png, image/jpeg" /><div class="preview-container"><span id="previewPlaceholder" class="preview-placeholder">Foto</span><img id="previewFoto" class="preview-foto" alt="Preview foto anak" /></div></div><div id="uploadStatus" class="field-status" aria-live="polite"></div>
                <input type="hidden" id="fotoUrl" name="fotoUrl" value="" />
                
              </div>
              <div class="form-group">
                <label for="nama">Nama</label>
                <input type="text" id="nama" name="nama" placeholder="Contoh: Alya Putri" minlength="2" maxlength="80" required />
              </div>
              <div class="form-group">
                <label for="umur">Umur (bulan)</label>
                <input type="number" id="umur" name="umur" placeholder="Contoh: 24" min="0" max="60" inputmode="numeric" required />
              </div>
              <div class="form-group">
                <label for="tinggi">Tinggi (cm)</label>
                <input type="number" step="0.1" id="tinggi" name="tinggi" placeholder="Contoh: 85.5" min="30" max="140" inputmode="decimal" required />
              </div>
              <div class="form-group">
                <label for="berat">Berat (kg)</label>
                <input type="number" step="0.1" id="berat" name="berat" placeholder="Contoh: 12.4" min="1" max="50" inputmode="decimal" required />
              </div>
              <div class="form-group">
                <label for="jenis_kelamin">Jenis Kelamin</label>
                <select id="jenis_kelamin" name="jenis_kelamin" required>
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div id="formMessage" class="form-message" aria-live="polite"></div><div class="button-container"><button type="button" id="cancelTambah" class="btn-secondary">Batal</button><button type="submit" class="btn-tambah-data" id="submitTambah"><span class="submit-label">Simpan Data</span></button></div>
            </form>
          </div>
      </main>
    `;
  },

  async afterRender() {

    const form = document.getElementById("formTambahAnak");
    const token = localStorage.getItem("token");
    const fotoInput = document.getElementById("fotoFile");
    const previewImg = document.getElementById("previewFoto");
    const hiddenFotoUrl = document.getElementById("fotoUrl");
    const uploadStatus = document.getElementById("uploadStatus");
    const previewPlaceholder = document.getElementById("previewPlaceholder");
    const submitButton = document.getElementById("submitTambah");
    const formMessage = document.getElementById("formMessage");
    document.getElementById("cancelTambah").addEventListener("click", () => { window.location.hash = "/anak"; });

    // Preview foto dan upload ke Cloudinary
    fotoInput.addEventListener("change", async () => {
      const file = fotoInput.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          uploadStatus.textContent = "Ukuran foto maksimal 2 MB.";
          uploadStatus.className = "field-status is-error";
          fotoInput.value = "";
          previewImg.src = "";
          hiddenFotoUrl.value = "";
          previewPlaceholder.hidden = false;
          return;
        }

        // Preview
        const reader = new FileReader();
        reader.onload = () => {
          previewImg.src = reader.result;
          previewPlaceholder.hidden = true;
        };
        uploadStatus.textContent = "Mengunggah foto...";
        uploadStatus.className = "field-status is-loading";
        reader.readAsDataURL(file);

        // Upload ke Cloudinary
        const cloudForm = new FormData();
        cloudForm.append("file", file);
        cloudForm.append("upload_preset", "stunting");

        try {
          const uploadRes = await fetch(
            "https://api.cloudinary.com/v1_1/dydfth7zs/image/upload",
            {
              method: "POST",
              body: cloudForm,
            }
          );
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok || !uploadData.secure_url) throw new Error("Upload gagal");
          hiddenFotoUrl.value = uploadData.secure_url;
          uploadStatus.textContent = "Foto siap digunakan.";
          uploadStatus.className = "field-status is-success";
        } catch (err) {
          uploadStatus.textContent = "Foto gagal diunggah. Coba pilih ulang.";
          uploadStatus.className = "field-status is-error";
          hiddenFotoUrl.value = "";
        }
      } else {
        previewImg.src = "";
        hiddenFotoUrl.value = "";
        previewPlaceholder.hidden = false;
        uploadStatus.textContent = "";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      formMessage.textContent = "";
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (fotoInput.files[0] && !hiddenFotoUrl.value) {
        formMessage.textContent = "Tunggu sampai foto selesai diunggah sebelum menyimpan.";
        formMessage.className = "form-message is-error";
        return;
      }
      submitButton.disabled = true;
      submitButton.querySelector(".submit-label").textContent = "Menyimpan...";
      const formData = new FormData(form);

      const anakPayload = [
        {
          nama: formData.get("nama"),
          jenis_kelamin: formData.get("jenis_kelamin"),
          umur_bulan: parseInt(formData.get("umur")),
          tinggi_badan: parseFloat(formData.get("tinggi")),
          berat_badan: parseFloat(formData.get("berat")),
          foto_url: formData.get("fotoUrl") || null, // ✅ Masukkan foto_url ke payload
        },
      ];

      try {
        const responseData = await tambahAnak(token, anakPayload);

        const fotoUrl = formData.get("fotoUrl");
        if (fotoUrl) {
          const namaAnak = responseData?.nama || formData.get("nama");
          const jenisKelaminAnak =
            responseData?.jenis_kelamin || formData.get("jenis_kelamin");

          const fotoKey = `foto_anak_${namaAnak
            .trim()
            .toLowerCase()}_${jenisKelaminAnak.trim().toLowerCase()}`;
          localStorage.setItem(fotoKey, fotoUrl);
          console.log("🟢 Foto anak disimpan di localStorage:", fotoKey, fotoUrl);
        }

        formMessage.textContent = "Data anak berhasil disimpan.";
        formMessage.className = "form-message is-success";
        setTimeout(() => { window.location.hash = "/anak"; }, 450);
      } catch (err) {
        formMessage.textContent = `Gagal menyimpan data: ${err.message}`;
        formMessage.className = "form-message is-error";
        submitButton.disabled = false;
        submitButton.querySelector(".submit-label").textContent = "Simpan Data";
      }
    });
  },
};

export default TambahAnakPage;
