(async function init() {
  try {
    enhanceSelects();
    enhanceDatePickers();
    await loadDepartemen();
    await loadJabatan();
    await loadKaryawan();
  } catch (e) {
    showToast(e.message, true);
  }
})();
