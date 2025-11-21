const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxZnJTBUdyKJq6gK6X6G0D_o8o8dNC8BvGZvfZGYmUMGfL8M69BykoBcCPHOlxLfGeQ/exec";

const form = document.getElementById("kuesioner");
const statusText = document.getElementById("status");
const progressBar = document.getElementById("progress");

async function updateStatus() {
  try {
    const res = await fetch(WEB_APP_URL);
    const data = await res.json();
    const totalIsi = data.totalIsi;
    const sisa = 25 - totalIsi;
    const persen = Math.min((totalIsi / 25) * 100, 100);

    progressBar.style.width = persen + "%";

    if (totalIsi >= 25) {
      statusText.innerHTML = `❌ Kuota penuh! <b>25</b> kelompok sudah terisi.`;
      form.querySelectorAll("input, textarea, button").forEach(el => el.disabled = true);
    } else {
      statusText.innerHTML = `Sisa kuota: <b>${sisa}</b> dari 25 kelompok.`;
    }
  } catch {
    statusText.innerHTML = "⚠️ Tidak dapat terhubung ke server.";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nama: form.nama.value,
    ketua: form.ketua.value,
    anggota: form.anggota.value,
    kontak: form.kontak.value,
    link: form.link.value,
  };

  const res = await fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (result.success) {
    alert("🎉 Pendaftaran berhasil!");
    form.reset();
    updateStatus();
  } else {
    alert(result.message || "Gagal mengirim data.");
  }
});

updateStatus();
