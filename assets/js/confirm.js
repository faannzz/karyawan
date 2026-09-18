let confirmOverlay;

function ensureConfirmOverlay() {
  if (confirmOverlay) return confirmOverlay;
  confirmOverlay = document.createElement('div');
  confirmOverlay.className = 'modal-overlay';
  confirmOverlay.innerHTML = `
    <div class="modal confirm-box">
      <div class="modal-header">
        <h3 class="confirm-title">Konfirmasi</h3>
      </div>
      <div class="modal-body">
        <p class="confirm-message"></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn confirm-cancel">Batal</button>
        <button type="button" class="btn btn-danger confirm-ok">Hapus</button>
      </div>
    </div>`;
  document.body.appendChild(confirmOverlay);
  return confirmOverlay;
}

function confirmDialog(message, opts = {}) {
  const overlay = ensureConfirmOverlay();
  overlay.querySelector('.confirm-title').textContent = opts.title || 'Konfirmasi';
  overlay.querySelector('.confirm-message').textContent = message;
  const okBtn = overlay.querySelector('.confirm-ok');
  const cancelBtn = overlay.querySelector('.confirm-cancel');
  okBtn.textContent = opts.okText || 'Hapus';
  cancelBtn.textContent = opts.cancelText || 'Batal';

  return new Promise((resolve) => {
    function cleanup(result) {
      overlay.classList.remove('open');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlayClick);
      resolve(result);
    }
    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    function onOverlayClick(e) { if (e.target === overlay) cleanup(false); }

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlayClick);
    overlay.classList.add('open');
  });
}
