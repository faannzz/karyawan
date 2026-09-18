let selectOverlay;

function ensureSelectOverlay() {
  if (selectOverlay) return selectOverlay;
  selectOverlay = document.createElement('div');
  selectOverlay.className = 'select-popup-overlay';
  selectOverlay.innerHTML = `
    <div class="select-popup">
      <div class="select-popup-header">
        <h4 class="select-popup-title"></h4>
        <button type="button" class="select-popup-close">×</button>
      </div>
      <div class="select-popup-list"></div>
    </div>`;
  document.body.appendChild(selectOverlay);
  selectOverlay.addEventListener('click', (e) => { if (e.target === selectOverlay) closeSelectPopup(); });
  selectOverlay.querySelector('.select-popup-close').addEventListener('click', closeSelectPopup);
  return selectOverlay;
}

function closeSelectPopup() { if (selectOverlay) selectOverlay.classList.remove('open'); }

function syncTrigger(select) {
  const trigger = select.previousElementSibling;
  if (!trigger || !trigger.classList.contains('select-trigger')) return;
  const opt = select.options[select.selectedIndex];
  const text = opt ? opt.textContent : '-- Pilih --';
  trigger.innerHTML = `<span>${escapeHtml(text)}</span><span class="select-arrow">▾</span>`;
  trigger.classList.toggle('placeholder', !select.value);
}

function openSelectPopup(select) {
  const overlay = ensureSelectOverlay();
  overlay.querySelector('.select-popup-title').textContent = select.dataset.label || 'Pilih';
  const list = overlay.querySelector('.select-popup-list');
  list.innerHTML = '';
  Array.from(select.options).forEach(opt => {
    const row = document.createElement('div');
    row.className = 'select-option' + (opt.value === select.value ? ' selected' : '');
    row.innerHTML = `<span class="radio"></span><span>${escapeHtml(opt.textContent)}</span>`;
    row.addEventListener('click', () => {
      select.value = opt.value;
      select.dispatchEvent(new Event('change'));
      syncTrigger(select);
      closeSelectPopup();
    });
    list.appendChild(row);
  });
  overlay.classList.add('open');
}

function enhanceSelects() {
  document.querySelectorAll('select[data-enhance]').forEach(select => {
    if (select.dataset.enhanced) return;
    select.dataset.enhanced = '1';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'select-trigger';
    select.parentNode.insertBefore(trigger, select);
    trigger.addEventListener('click', () => openSelectPopup(select));
    syncTrigger(select);
  });
}

function syncAllSelects() {
  document.querySelectorAll('select[data-enhance]').forEach(syncTrigger);
}
