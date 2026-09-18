async function loadJabatan() {
  const { data } = await api('jabatan', 'list');
  jabatanList = data;
  const grid = document.getElementById('grid-jabatan');
  grid.innerHTML = data.length ? data.map(j => `
    <div class="simple-card">
      <span class="simple-card-id">#${j.id}</span>
      <span class="simple-card-nama">${escapeHtml(j.nama_jabatan)}</span>
      <div class="simple-card-actions">
        <button class="btn btn-sm btn-dark" onclick="editJabatan(${j.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteJabatan(${j.id})">Hapus</button>
      </div>
    </div>
  `).join('') : `<div class="empty-state">Belum ada jabatan</div>`;
  fillSelect('#form-karyawan select[name=jabatan_id]', jabatanList, 'nama_jabatan');
}

function editJabatan(id) {
  const item = jabatanList.find(j => j.id == id);
  document.getElementById('jabatan-id').value = item.id;
  document.getElementById('jabatan-nama').value = item.nama_jabatan;
  document.getElementById('modal-jabatan-title').textContent = 'Edit Jabatan';
  openModal('modal-jabatan');
}

async function deleteJabatan(id) {
  const ok = await confirmDialog('Hapus jabatan ini?');
  if (!ok) return;
  try {
    await api('jabatan', 'delete', { id });
    showToast('Jabatan dihapus');
    loadJabatan();
  } catch (e) { showToast(e.message, true); }
}

document.getElementById('btn-tambah-jabatan').addEventListener('click', () => {
  document.getElementById('form-jabatan').reset();
  document.getElementById('jabatan-id').value = '';
  document.getElementById('modal-jabatan-title').textContent = 'Tambah Jabatan';
  openModal('modal-jabatan');
});

document.getElementById('form-jabatan').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('jabatan-id').value;
  const nama_jabatan = document.getElementById('jabatan-nama').value.trim();
  try {
    if (id) await api('jabatan', 'update', { body: { id, nama_jabatan } });
    else await api('jabatan', 'create', { body: { nama_jabatan } });
    showToast('Jabatan tersimpan');
    closeModal('modal-jabatan');
    loadJabatan();
  } catch (e) { showToast(e.message, true); }
});
