import "../../../styles/header.css";

const pageMeta = () => {
  const path = window.location.hash.replace("#", "") || "/dashboard";
  const pages = {
    "/dashboard": ["Dashboard", "Ringkasan pemantauan pertumbuhan"],
    "/anak": ["Data Anak", "Kelola data dan status pertumbuhan"],
    "/tambah-anak": ["Tambah Anak", "Catat pengukuran baru"],
    "/detail-anak": ["Detail Anak", "Informasi pertumbuhan terakhir"],
    "/profile-posyandu": ["Profil Posyandu", "Identitas fasilitas layanan"],
    "/report": ["Laporan", "Rekap pemantauan anak"],
    "/riwayat": ["Riwayat", "Pemeriksaan anak"],
  };
  return pages[path] || ["NURTURA", "Child Growth Monitoring System"];
};

const Header = {
  render() {
    const [title, subtitle] = pageMeta();
    return `
      <div class="app-header-inner">
        <button id="mobile-nav-toggle" class="mobile-nav-toggle" type="button" aria-label="Buka navigasi" aria-controls="sidebar" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <button class="header-brand" type="button" aria-label="Ke dashboard">
          <img src="/images/nurtura-mark.svg" alt="" class="header-brand-mark" />
          <span class="header-brand-copy"><strong>NURTURA</strong><small>Child Growth Monitoring System</small></span>
        </button>
        <div class="header-page-context" aria-live="polite">
          <span class="header-page-kicker">Workspace</span>
          <strong>${title}</strong>
          <small>${subtitle}</small>
        </div>
      </div>`;
  },
  afterRender() {
    document.querySelector(".header-brand")?.addEventListener("click", () => {
      window.location.hash = "/dashboard";
    });
  },
};

export default Header;
