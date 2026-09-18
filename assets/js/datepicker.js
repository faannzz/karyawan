const BULAN_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const HARI_ID = ['M','S','S','R','K','J','S'];

let dateOverlay;
let dateActiveInput;
let dateViewYear;
let dateViewMonth;

function ensureDateOverlay() {
  if (dateOverlay) return dateOverlay;
  dateOverlay = document.createElement('div');
  dateOverlay.className = 'select-popup-overlay';
  dateOverlay.innerHTML = `
    <div class="select-popup date-popup">
      <div class="select-popup-header">
        <h4 class="date-popup-title">Pilih Tanggal</h4>
        <button type="button" class="select-popup-close">×</button>
      </div>
      <div class="date-popup-body">
        <div class="date-nav">
          <button type="button" class="date-nav-btn" data-dir="-1">‹</button>
          <span class="date-nav-label"></span>
          <button type="button" class="date-nav-btn" data-dir="1">›</button>
        </div>
        <div class="date-grid-head">${HARI_ID.map(h => `<span>${h}</span>`).join('')}</div>
        <div class="date-grid-days"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn date-clear-btn">Kosongkan</button>
        <button type="button" class="btn btn-primary date-today-btn">Hari Ini</button>
      </div>
    </div>`;
  document.body.appendChild(dateOverlay);
  dateOverlay.addEventListener('click', (e) => { if (e.target === dateOverlay) closeDatePopup(); });
  dateOverlay.querySelector('.select-popup-close').addEventListener('click', closeDatePopup);
  dateOverlay.querySelectorAll('.date-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      dateViewMonth += parseInt(btn.dataset.dir, 10);
      if (dateViewMonth < 0) { dateViewMonth = 11; dateViewYear--; }
      if (dateViewMonth > 11) { dateViewMonth = 0; dateViewYear++; }
      renderDateGrid();
    });
  });
  dateOverlay.querySelector('.date-clear-btn').addEventListener('click', () => {
    setDateValue(dateActiveInput, '');
    closeDatePopup();
  });
  dateOverlay.querySelector('.date-today-btn').addEventListener('click', () => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setDateValue(dateActiveInput, iso);
    closeDatePopup();
  });
  return dateOverlay;
}

function closeDatePopup() { if (dateOverlay) dateOverlay.classList.remove('open'); }

function syncDateTrigger(input) {
  const trigger = input.previousElementSibling;
  if (!trigger || !trigger.classList.contains('date-trigger')) return;
  if (input.value) {
    const [y, m, d] = input.value.split('-').map(Number);
    trigger.textContent = `${d} ${BULAN_ID[m - 1]} ${y}`;
    trigger.classList.remove('placeholder');
  } else {
    trigger.textContent = '-- Pilih Tanggal --';
    trigger.classList.add('placeholder');
  }
}

function setDateValue(input, isoValue) {
  input.value = isoValue;
  input.dispatchEvent(new Event('change'));
  syncDateTrigger(input);
}

function renderDateGrid() {
  dateOverlay.querySelector('.date-nav-label').textContent = `${BULAN_ID[dateViewMonth]} ${dateViewYear}`;
  const daysGrid = dateOverlay.querySelector('.date-grid-days');
  const firstDay = new Date(dateViewYear, dateViewMonth, 1).getDay();
  const totalDays = new Date(dateViewYear, dateViewMonth + 1, 0).getDate();
  const selected = dateActiveInput.value;
  let html = '';
  for (let i = 0; i < firstDay; i++) html += `<span class="date-cell empty"></span>`;
  for (let d = 1; d <= totalDays; d++) {
    const iso = `${dateViewYear}-${String(dateViewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    html += `<button type="button" class="date-cell${iso === selected ? ' selected' : ''}" data-iso="${iso}">${d}</button>`;
  }
  daysGrid.innerHTML = html;
  daysGrid.querySelectorAll('.date-cell:not(.empty)').forEach(cell => {
    cell.addEventListener('click', () => {
      setDateValue(dateActiveInput, cell.dataset.iso);
      closeDatePopup();
    });
  });
}

function openDatePopup(input) {
  ensureDateOverlay();
  dateActiveInput = input;
  dateOverlay.querySelector('.date-popup-title').textContent = input.dataset.label || 'Pilih Tanggal';
  const base = input.value ? new Date(input.value) : new Date();
  dateViewYear = base.getFullYear();
  dateViewMonth = base.getMonth();
  renderDateGrid();
  dateOverlay.classList.add('open');
}

function enhanceDatePickers() {
  document.querySelectorAll('input[data-datepicker]').forEach(input => {
    if (input.dataset.enhanced) return;
    input.dataset.enhanced = '1';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'date-trigger placeholder';
    trigger.textContent = '-- Pilih Tanggal --';
    input.parentNode.insertBefore(trigger, input);
    trigger.addEventListener('click', () => openDatePopup(input));
    syncDateTrigger(input);
  });
}

function syncAllDatePickers() {
  document.querySelectorAll('input[data-datepicker]').forEach(syncDateTrigger);
}
