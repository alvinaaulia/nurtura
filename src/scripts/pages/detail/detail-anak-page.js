import DetailAnakPresenter from "./detail-anak-presenter.js";
import "../../../styles/detail-anak.css";

const esc=(v)=>String(v??"-").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const statusClass=(v)=>String(v||"").toLowerCase().replace(/\s+/g,"-");
const DetailAnakPage={
 async render(){if(!localStorage.getItem("token")){window.location.hash="/login";return""}return `<section class="detail-page"><div id="detailContainer" class="detail-anak"><div class="detail-loading"><span class="detail-skeleton avatar"></span><div><span class="detail-skeleton line wide"></span><span class="detail-skeleton line"></span><span class="detail-skeleton line"></span></div></div></div></section>`},
 async afterRender(){const token=localStorage.getItem("token"),anakId=localStorage.getItem("anak_id"),container=document.getElementById("detailContainer");if(!anakId){container.innerHTML=`<div class="detail-state"><strong>Data anak belum dipilih</strong><p>Kembali ke daftar anak lalu pilih data yang ingin dilihat.</p><button class="btn-back" id="backButton">Kembali ke Data Anak</button></div>`;document.getElementById('backButton')?.addEventListener('click',()=>window.location.hash='/anak');return}
 try{const a=await DetailAnakPresenter.fetchDetailAnak(token,anakId);const date=a.created_at?new Date(a.created_at).toLocaleDateString('id-ID',{year:'numeric',month:'long',day:'numeric'}):'-';container.innerHTML=`
 <div class="detail-topbar"><div><span class="eyebrow">Data pertumbuhan</span><h1>${esc(a.nama)}</h1><p>Informasi terakhir yang tercatat di NURTURA.</p></div><span class="status ${statusClass(a.label)}">${esc(a.label)}</span></div>
 <div class="detail-card">
  <aside class="child-profile"><div class="foto-container">${a.foto_url?`<img src="${esc(a.foto_url)}" alt="Foto ${esc(a.nama)}" class="foto-anak-detail" />`:`<div class="placeholder-foto-detail" aria-label="Foto tidak tersedia"><span>${esc(a.nama).charAt(0).toUpperCase()}</span></div>`}</div><strong>${esc(a.nama)}</strong><small>ID Anak · ${esc(a.id)}</small></aside>
  <div class="info-detail">
   <div class="info-item"><span>Jenis kelamin</span><strong>${esc(a.jenis_kelamin)}</strong></div>
   <div class="info-item"><span>Umur</span><strong>${esc(a.umur_bulan)} bulan</strong></div>
   <div class="info-item metric"><span>Tinggi badan</span><strong>${esc(a.tinggi_badan)} <small>cm</small></strong></div>
   <div class="info-item metric"><span>Berat badan</span><strong>${esc(a.berat_badan)} <small>kg</small></strong></div>
   <div class="info-item full"><span>Pemeriksaan terakhir</span><strong>${esc(date)}</strong></div>
  </div>
 </div>
 <div class="detail-actions"><button id="backButton" class="btn-back" type="button">← Kembali</button><button id="hapusButton" class="btn-hapus" type="button">Hapus data</button></div>
 <dialog id="deleteDialog" class="confirm-dialog" aria-labelledby="deleteTitle"><div class="confirm-dialog-body"><span class="confirm-icon" aria-hidden="true">!</span><div><h2 id="deleteTitle">Hapus data ${esc(a.nama)}?</h2><p>Data yang sudah dihapus tidak dapat dikembalikan.</p><p id="deleteMessage" class="dialog-message" role="alert" aria-live="polite"></p></div></div><div class="confirm-dialog-actions"><button id="cancelDelete" class="btn-back" type="button">Batal</button><button id="confirmDelete" class="btn-hapus" type="button">Ya, hapus data</button></div></dialog>`;
 document.getElementById('backButton').addEventListener('click',()=>window.location.hash='/anak');document.getElementById('hapusButton').addEventListener('click',()=>document.getElementById('deleteDialog')?.showModal());document.getElementById('cancelDelete')?.addEventListener('click',()=>document.getElementById('deleteDialog')?.close());document.getElementById('confirmDelete')?.addEventListener('click',async()=>{const dialog=document.getElementById('deleteDialog'),btn=document.getElementById('confirmDelete'),message=document.getElementById('deleteMessage');btn.disabled=true;btn.textContent='Menghapus…';message.textContent='';try{await DetailAnakPresenter.hapusAnak(token,anakId);dialog.close();window.location.hash='/anak'}catch(err){btn.disabled=false;btn.textContent='Ya, hapus data';message.textContent=`Gagal menghapus data: ${err.message}`}})
 }catch(err){container.innerHTML=`<div class="detail-state error-state"><strong>Data gagal dimuat</strong><p>${esc(err.message)}</p><div><button class="btn-back" id="backButton">Kembali</button><button class="btn-warning" id="retryButton">Coba lagi</button></div></div>`;document.getElementById('backButton')?.addEventListener('click',()=>window.location.hash='/anak');document.getElementById('retryButton')?.addEventListener('click',()=>this.afterRender())}}
};export default DetailAnakPage;
