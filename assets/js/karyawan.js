async function loadKaryawan() {
  const { data } = await api('karyawan', 'list');
  karyawanList = data;
  const grid = document.getElementById('grid-karyawan');
  grid.innerHTML = data.length ? data.map(k => `
    <div class="karyawan-card">
      <div class="karyawan-card-head">
        <span class="karyawan-card-id">#${k.id}</span>
        <span class="badge ${k.status === 'Aktif' ? 'badge-aktif' : 'badge-nonaktif'}">${k.status}</span>
      </div>
      <h3 class="karyawan-card-nama">${escapeHtml(k.nama)}</h3>
      <div class="karyawan-card-meta">
        <div class="meta-row"><span class="meta-label">Jabatan</span><span>${escapeHtml(k.nama_jabatan || '-')}</span></div>
        <div class="meta-row"><span class="meta-label">Departemen</span><span>${escapeHtml(k.nama_departemen || '-')}</span></div>
        <div class="meta-row"><span class="meta-label">Email</span><span>${escapeHtml(k.email || '-')}</span></div>
      </div>
      <div class="karyawan-card-actions">
        <button class="btn btn-sm btn-dark" onclick="editKaryawan(${k.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteKaryawan(${k.id})">Hapus</button>
      </div>
    </div>
  `).join('') : `<div class="empty-state">Belum ada karyawan</div>`;
}

function editKaryawan(id) {
  const item = karyawanList.find(k => k.id == id);
  const form = document.getElementById('form-karyawan');
  form.id.value = item.id;
  form.nama.value = item.nama;
  form.email.value = item.email || '';
  form.telepon.value = item.telepon || '';
  form.alamat.value = item.alamat || '';
  form.jabatan_id.value = item.jabatan_id || '';
  form.departemen_id.value = item.departemen_id || '';
  form.tanggal_masuk.value = item.tanggal_masuk || '';
  form.status.value = item.status;
  syncAllSelects();
  syncAllDatePickers();
  document.getElementById('modal-karyawan-title').textContent = 'Edit Karyawan';
  openModal('modal-karyawan');
}

async function deleteKaryawan(id) {
  const ok = await confirmDialog('Hapus data karyawan ini?');
  if (!ok) return;
  try {
    await api('karyawan', 'delete', { id });
    showToast('Karyawan dihapus');
    loadKaryawan();
  } catch (e) { showToast(e.message, true); }
}

document.getElementById('btn-tambah-karyawan').addEventListener('click', () => {
  document.getElementById('form-karyawan').reset();
  document.getElementById('form-karyawan').id.value = '';
  syncAllSelects();
  syncAllDatePickers();
  document.getElementById('modal-karyawan-title').textContent = 'Tambah Karyawan';
  openModal('modal-karyawan');
});

document.getElementById('form-karyawan').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    id: form.id.value || undefined,
    nama: form.nama.value.trim(),
    email: form.email.value.trim(),
    telepon: form.telepon.value.trim(),
    alamat: form.alamat.value.trim(),
    jabatan_id: form.jabatan_id.value,
    departemen_id: form.departemen_id.value,
    tanggal_masuk: form.tanggal_masuk.value,
    status: form.status.value,
  };
  try {
    if (payload.id) await api('karyawan', 'update', { body: payload });
    else await api('karyawan', 'create', { body: payload });
    showToast('Data karyawan tersimpan');
    closeModal('modal-karyawan');
    loadKaryawan();
  } catch (e) { showToast(e.message, true); }
});
