import "../../../styles/header.css";

const pageMeta = () => {
  const path = window.location.hash.replace("#", "") || "/dashboard";
  const pages = {
    "/dashboard": ["Dashboard", "Ringkasan pemantauan"],
    "/anak": ["Data Anak", "Kelola data pertumbuhan"],
    "/tambah-anak": ["Tambah Anak", "Input data baru"],
    "/detail-anak": ["Detail Anak", "Informasi pertumbuhan"],
    "/profile-posyandu": ["Profil Posyandu", "Informasi fasilitas"],
    "/report": ["Laporan", "Rekap pemantauan"],
    "/riwayat": ["Riwayat", "Pemeriksaan anak"],
  };
  return pages[path] || ["SMART", "Stunting Monitoring"];
};

const Header = {
  render(isAuthPage = false) {
    if (isAuthPage) return `<header class="main-header auth-header"><img src="kesehatan.png" alt="SMART" class="auth-logo" /></header>`;
    const [title, subtitle] = pageMeta();
    return `
      <header class="main-header">
        <button id="mobile-nav-toggle" class="mobile-nav-toggle" type="button" aria-label="Buka navigasi" aria-controls="sidebar" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <button class="header-logo" type="button" aria-label="Ke dashboard">
          <img src="kesehatan.png" alt="Logo SMART" />
          <div class="header-logo-text"><strong>SMART</strong><small>Stunting Monitoring</small></div>
        </button>
        <div class="header-page-context" aria-live="polite"><strong>${title}</strong><small>${subtitle}</small></div>
      </header>`;
  },
  afterRender() {
    document.querySelector(".header-logo")?.addEventListener("click", () => { window.location.hash = "/dashboard"; });
  },
};
export default Header;
