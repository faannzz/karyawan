async function loadDepartemen() {
  const { data } = await api('departemen', 'list');
  departemenList = data;
  const grid = document.getElementById('grid-departemen');
  grid.innerHTML = data.length ? data.map(d => `
    <div class="simple-card">
      <span class="simple-card-id">#${d.id}</span>
      <span class="simple-card-nama">${escapeHtml(d.nama_departemen)}</span>
      <div class="simple-card-actions">
        <button class="btn btn-sm btn-dark" onclick="editDepartemen(${d.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteDepartemen(${d.id})">Hapus</button>
      </div>
    </div>
  `).join('') : `<div class="empty-state">Belum ada departemen</div>`;
  fillSelect('#form-karyawan select[name=departemen_id]', departemenList, 'nama_departemen');
}

function editDepartemen(id) {
  const item = departemenList.find(d => d.id == id);
  document.getElementById('departemen-id').value = item.id;
  document.getElementById('departemen-nama').value = item.nama_departemen;
  document.getElementById('modal-departemen-title').textContent = 'Edit Departemen';
  openModal('modal-departemen');
}

async function deleteDepartemen(id) {
  const ok = await confirmDialog('Hapus departemen ini?');
  if (!ok) return;
  try {
    await api('departemen', 'delete', { id });
    showToast('Departemen dihapus');
    loadDepartemen();
  } catch (e) { showToast(e.message, true); }
}

document.getElementById('btn-tambah-departemen').addEventListener('click', () => {
  document.getElementById('form-departemen').reset();
  document.getElementById('departemen-id').value = '';
  document.getElementById('modal-departemen-title').textContent = 'Tambah Departemen';
  openModal('modal-departemen');
});

document.getElementById('form-departemen').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('departemen-id').value;
  const nama_departemen = document.getElementById('departemen-nama').value.trim();
  try {
    if (id) await api('departemen', 'update', { body: { id, nama_departemen } });
    else await api('departemen', 'create', { body: { nama_departemen } });
    showToast('Departemen tersimpan');
    closeModal('modal-departemen');
    loadDepartemen();
  } catch (e) { showToast(e.message, true); }
});
