// detail-paket.html: katalog multi-paket + form booking dengan estimasi biaya + kirim ke WA
(function () {
  var WA_NUMBER = '6281234567890';

  var KATALOG = {
    'hemat-9': {
      nama: 'Paket Umrah Hemat Awal Musim 1447 H',
      durasi: '9 Hari Perjalanan', tanggal: '14 Okt - 22 Okt 2026',
      maskapai: 'Saudia Airlines (Direct SV)',
      makkah: 'Elaf Kinda (Shuttle 3 Menit)', madinah: 'Mirage Al Salam (+- 500m)',
      quad: 29900000, triple: 32500000, double: 35900000
    },
    'nyaman-12': {
      nama: 'Paket Umrah Nyaman Reguler 1447 H',
      durasi: '12 Hari Perjalanan', tanggal: '28 Okt - 08 Nov 2026',
      maskapai: 'Garuda Indonesia (CGK - JED Direct)',
      makkah: 'Dar Al Eiman Grand (500m jalan kaki)', madinah: 'Al Rawda Royal Inn (300m dari Raudhah)',
      quad: 34900000, triple: 37500000, double: 40900000
    },
    'premium-12': {
      nama: 'Paket Umrah Premium Khidmah 1447 H',
      durasi: '12 Hari Perjalanan', tanggal: '10 Nov - 21 Nov 2026',
      maskapai: 'Garuda Indonesia Direct',
      makkah: 'Pullman ZamZam Clock Tower (Pelataran)', madinah: 'Pullman Zamzam Madinah (Pintu Utama)',
      quad: 42900000, triple: 45500000, double: 48900000
    },
    'akhir-tahun-12': {
      nama: 'Paket Umrah Akhir Tahun Syahdu 1447 H',
      durasi: '12 Hari Perjalanan', tanggal: '22 Des 2026 - 02 Jan 2027',
      maskapai: 'Saudia Airlines Direct',
      makkah: 'Swissotel Al Maqam (Kompleks Abraj)', madinah: 'Leader Al Muna Kareem (150m)',
      quad: 38500000, triple: 41100000, double: 44500000
    },
    'plus-turki-14': {
      nama: 'Paket Umrah Plus City Tour Turki & Istanbul',
      durasi: '14 Hari Perjalanan', tanggal: '15 Nov - 28 Nov 2026',
      maskapai: 'Turkish Airlines (Transit Istanbul)',
      makkah: 'Anjum Makkah (Bintang 5)', madinah: 'Rawda Royal (Bintang 5)',
      quad: 48000000, triple: 50600000, double: 54000000
    },
    'ramadhan-12': {
      nama: 'Paket Umrah Awal Ramadhan Berkah 1448 H',
      durasi: '12 Hari Perjalanan', tanggal: '18 Feb - 01 Mar 2027',
      maskapai: 'Garuda Indonesia (Direct Flight)',
      makkah: 'Pullman Zamzam / Movenpick (Pelataran)', madinah: 'Movenpick Anwar Al Madinah (Dekat Pintu 15)',
      quad: 46500000, triple: 49100000, double: 52500000
    }
  };

  function fmt(n) {
    try { return 'Rp ' + n.toLocaleString('id-ID'); }
    catch (e) { return 'Rp ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  }
  function fmtDots(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function shortJt(n) { return (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' Jt'; }
  function getSlug() {
    try {
      var s = new URLSearchParams(window.location.search).get('paket');
      if (s && KATALOG[s]) return s;
    } catch (e) {}
    return 'nyaman-12';
  }

  var slug = getSlug();
  var P = KATALOG[slug];

  // ---- 1. Update info paket di halaman ----
  var h1 = document.querySelector('h1');
  if (h1) h1.textContent = P.nama;
  var modalSub = document.querySelector('#booking p.font-body-sm');
  if (modalSub) modalSub.textContent = P.nama + ' - ' + P.durasi;
  var crumbs = document.querySelectorAll('nav span.text-primary');
  if (crumbs.length) crumbs[crumbs.length - 1].textContent = P.nama.replace(' 1447 H', '').replace(' 1448 H', '');
  document.querySelectorAll('span.font-title-md').forEach(function (el) {
    if (/Hari Perjalanan/.test(el.textContent)) el.textContent = P.durasi;
  });
  document.querySelectorAll('span.font-label-md').forEach(function (el) {
    if (/\d{1,2} Okt|\d{1,2} Nov|\d{1,2} Des|\d{1,2} Feb/.test(el.textContent)) el.textContent = P.tanggal;
  });

  // ---- 2. Update harga kamar (room buttons + modal select + display) ----
  var roomBtns = document.querySelectorAll('.room-btn');
  var priceMap = { quad: P.quad, triple: P.triple, double: P.double };
  roomBtns.forEach(function (btn) {
    var key = btn.getAttribute('data-room');
    if (key && priceMap[key]) {
      btn.setAttribute('data-price', fmtDots(priceMap[key]));
      var label = btn.querySelector('.font-title-md');
      if (label) label.textContent = shortJt(priceMap[key]);
    }
  });
  var roomSelect = document.getElementById('modal-room-select');
  if (roomSelect) {
    roomSelect.options[0].text = 'Quad (' + fmt(P.quad) + ' / org)';
    roomSelect.options[1].text = 'Triple (' + fmt(P.triple) + ' / org)';
    roomSelect.options[2].text = 'Double (' + fmt(P.double) + ' / org)';
  }
  var disp = document.getElementById('display-price');
  if (disp) disp.textContent = fmtDots(P.quad);

  // ---- 3. Dropdown pemilih paket di kartu booking ----
  var roomWrap = document.getElementById('room-selector');
  if (roomWrap && !document.getElementById('paket-select')) {
    var wrap = document.createElement('div');
    wrap.className = 'flex flex-col gap-2 mb-1';
    var lab = document.createElement('label');
    lab.className = 'font-label-md text-label-md text-primary uppercase tracking-wider';
    lab.setAttribute('for', 'paket-select');
    lab.textContent = 'Pilihan Paket Umrah';
    var sel = document.createElement('select');
    sel.id = 'paket-select';
    sel.className = 'w-full h-12 px-3 rounded bg-surface-container-lowest text-on-surface font-body-md shadow-sm focus:outline-none cursor-pointer';
    Object.keys(KATALOG).forEach(function (key) {
      var o = document.createElement('option');
      o.value = key;
      o.textContent = KATALOG[key].nama + ' (' + KATALOG[key].tanggal + ') - ' + fmt(KATALOG[key].quad);
      if (key === slug) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () {
      window.location.href = window.location.pathname + '?paket=' + sel.value;
    });
    wrap.appendChild(lab);
    wrap.appendChild(sel);
    roomWrap.parentNode.insertBefore(wrap, roomWrap);
  }

  // ---- 4. Form booking: stepper jumlah 1-100, auto kamar, estimasi live, kirim WA ----
  var ROOM_CAP = { quad: 4, triple: 3, double: 2 };
  var ROOM_LABEL = { quad: 'Quad', triple: 'Triple', double: 'Double' };
  var ROOM_NAMA = { quad: 'Quad (sekamar ber-4)', triple: 'Triple (sekamar ber-3)', double: 'Double (sekamar ber-2)' };
  function autoRoom(n) {
    if (n === 2) return 'double';
    if (n === 3) return 'triple';
    return 'quad'; // 1 orang ikut sharing termurah, 4+ orang sekamar ber-4
  }
  // Susunan kamar untuk rombongan (info saja, total tetap harga/orang x jumlah)
  function komposisiKamar(n, prefKey) {
    var c = ROOM_CAP[prefKey] || 4;
    var full = Math.floor(n / c), r = n % c;
    if (r === 0) return full + ' kamar ' + ROOM_LABEL[prefKey] + ' (masing-masing ' + c + ' orang)';
    if (r === 1) {
      if (full >= 1) return full + ' kamar ' + ROOM_LABEL[prefKey] + ' + 1 orang: digabung grup / single supplement (konfirmasi via WA)';
      return 'sharing sekamar digabung grup (atau single occupancy, konfirmasi via WA)';
    }
    var sisa = r === 2 ? 'double' : 'triple';
    var depan = full >= 1 ? full + ' kamar ' + ROOM_LABEL[prefKey] + ' + ' : '';
    return depan + '1 kamar ' + ROOM_LABEL[sisa] + ' (' + r + ' orang)';
  }

  var form = document.getElementById('booking-form');
  if (!form) return;
  var inputs = form.querySelectorAll('input');
  var selects = form.querySelectorAll('select');
  var area = form.querySelector('textarea');
  var namaIn = inputs[0], waIn = inputs[1], kotaIn = inputs[2];
  var kmrSel = selects[1] || roomSelect;
  if (namaIn && !namaIn.id) namaIn.id = 'bk-nama';
  if (waIn && !waIn.id) waIn.id = 'bk-wa';
  if (kotaIn && !kotaIn.id) kotaIn.id = 'bk-kota';
  if (area && !area.id) area.id = 'bk-catatan';

  // Ganti select jumlah bawaan (mentok "5+") dengan stepper angka 1-100
  var jmlLama = selects[0];
  var jmlAwal = 1;
  if (jmlLama) {
    var pv = parseInt(jmlLama.value, 10);
    if (!isNaN(pv) && pv >= 1 && pv <= 100) jmlAwal = pv;
  }
  var jmlWrap = document.createElement('div');
  jmlWrap.className = 'flex items-center gap-2';
  jmlWrap.innerHTML =
    '<button type="button" id="bk-minus" aria-label="Kurangi jumlah" class="w-10 h-11 shrink-0 rounded bg-surface-container-lowest shadow-sm text-primary text-xl font-bold">-</button>' +
    '<input type="number" id="bk-jumlah" min="1" max="100" value="' + jmlAwal + '" inputmode="numeric" class="w-full h-11 px-3 text-center rounded bg-surface border border-outline-variant text-on-surface font-bold focus:outline-none focus:border-primary" />' +
    '<button type="button" id="bk-plus" aria-label="Tambah jumlah" class="w-10 h-11 shrink-0 rounded bg-surface-container-lowest shadow-sm text-primary text-xl font-bold">+</button>';
  if (jmlLama && jmlLama.parentNode) {
    jmlLama.parentNode.replaceChild(jmlWrap, jmlLama);
    var jmlHint = document.createElement('div');
    jmlHint.className = 'text-xs text-on-surface-variant mt-1';
    jmlHint.textContent = '1-100 orang, bisa untuk rombongan/keluarga besar. Tipe kamar otomatis mengikuti jumlah.';
    jmlWrap.parentNode.appendChild(jmlHint);
  }
  var jmlIn = document.getElementById('bk-jumlah');
  var btnMin = document.getElementById('bk-minus');
  var btnPlus = document.getElementById('bk-plus');

  // Set kamar + sinkron tampilan tombol & display (dipakai saat jumlah berubah)
  function setRoom(key) {
    roomBtns.forEach(function (b) {
      var active = b.getAttribute('data-room') === key;
      b.classList.remove('active-room', 'bg-primary-container', 'text-on-primary', 'bg-surface-container', 'text-on-surface');
      var sub = b.querySelector('.font-label-sm');
      if (active) {
        b.classList.add('active-room', 'bg-primary-container', 'text-on-primary');
        if (sub) { sub.classList.remove('text-on-surface-variant'); sub.classList.add('opacity-90'); }
      } else {
        b.classList.add('bg-surface-container', 'text-on-surface');
        if (sub) { sub.classList.remove('opacity-90'); sub.classList.add('text-on-surface-variant'); }
      }
    });
    if (kmrSel) kmrSel.value = key;
    if (disp && priceMap[key]) disp.textContent = fmtDots(priceMap[key]);
  }

  function hargaKamar() {
    var k = kmrSel ? kmrSel.value : 'quad';
    return priceMap[k] || P.quad;
  }
  function kunciKamar() {
    return kmrSel ? kmrSel.value : 'quad';
  }
  function jmlOrang() {
    if (!jmlIn) return 1;
    var v = parseInt(jmlIn.value, 10);
    if (isNaN(v) || v < 1) return 1;
    return Math.min(v, 100);
  }

  // Kotak estimasi biaya
  var estBox = document.getElementById('bk-estimasi');
  if (!estBox) {
    estBox = document.createElement('div');
    estBox.id = 'bk-estimasi';
    estBox.className = 'p-4 rounded-lg bg-surface-container-low flex flex-col gap-1';
    var submitBtn = form.querySelector('button[type="submit"]');
    form.insertBefore(estBox, submitBtn);
  }

  // Kotak sukses (muncul setelah submit, di bawah form)
  var okBox = document.getElementById('bk-success');
  if (!okBox) {
    okBox = document.createElement('div');
    okBox.id = 'bk-success';
    okBox.className = 'hidden p-4 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-start gap-3';
    okBox.innerHTML = '<span class="material-symbols-outlined text-[22px] shrink-0 mt-0.5">task_alt</span><div><div class="font-bold">Alhamdulillah, data booking siap dikirim!</div><div class="text-sm opacity-90">WhatsApp terbuka dengan pesan terisi otomatis — tekan kirim agar seat Anda diproses. Tim konsultan verifikasi 1x24 jam.</div></div>';
    form.parentNode.insertBefore(okBox, form.nextSibling);
  }
  function renderEstimasi() {
    var h = hargaKamar(), n = jmlOrang(), total = h * n, dp = 5000000 * n;
    var k = kunciKamar();
    var namaKamar = kmrSel ? kmrSel.options[kmrSel.selectedIndex].text.split(' (')[0] : 'Quad';
    var note = '';
    if (n === 1 && k === 'double') {
      note = '1 orang sekamar sendiri: estimasi memakai harga dasar Double. Single supplement final dikonfirmasi admin via WhatsApp.';
    } else if (n === 1) {
      note = '1 orang: harga di atas asumsi sharing sekamar (digabung grup). Untuk sekamar sendiri, pilih Double di atas (estimasi dasar, supplement dikonfirmasi via WA).';
    } else if (n < ROOM_CAP[k]) {
      note = n + ' jamaah dengan kamar ' + namaKamar + ' (kapasitas ' + ROOM_CAP[k] + '): sisa seat bisa diisi anggota lain atau digabung grup. Tipe kamar otomatis mengikuti jumlah, bisa diubah manual.';
    }
    estBox.innerHTML =
      '<div class="flex items-center justify-between text-sm"><span class="text-on-surface-variant">Paket</span><strong class="text-primary text-right">' + P.nama + '</strong></div>' +
      '<div class="flex items-center justify-between text-sm"><span class="text-on-surface-variant">Harga / orang (' + namaKamar + ')</span><strong class="text-primary">' + fmt(h) + '</strong></div>' +
      '<div class="flex items-center justify-between text-sm"><span class="text-on-surface-variant">Jumlah jamaah</span><strong class="text-primary">' + n + ' orang</strong></div>' +
      '<div class="flex items-start justify-between gap-2 text-sm"><span class="text-on-surface-variant shrink-0">Rencana kamar</span><strong class="text-primary text-right">' + komposisiKamar(n, k) + '</strong></div>' +
      '<div class="flex items-center justify-between pt-2 mt-1 border-t border-surface-variant"><span class="font-bold text-primary">Estimasi Total</span><span class="font-bold text-primary text-lg">' + fmt(total) + '</span></div>' +
      '<div class="text-xs text-on-surface-variant">DP pengunci seat ' + fmt(5000000) + ' / orang (total DP ' + fmt(dp) + '). Sisa pelunasan ' + fmt(total - dp) + ' maksimal H-30 keberangkatan.</div>' +
      (note ? '<div class="text-xs text-secondary font-medium pt-1">' + note + '</div>' : '');
  }

  function onJumlahBerubah() {
    var v = parseInt(jmlIn.value, 10);
    if (isNaN(v) || v < 1) { renderEstimasi(); return; }
    v = Math.min(v, 100);
    jmlIn.value = v;
    setRoom(autoRoom(v)); // kamar selalu mengikuti jumlah, tidak ada lagi kamar basi (mis. Double nyangkut saat 1 orang)
    renderEstimasi();
  }
  if (jmlIn) {
    jmlIn.addEventListener('input', onJumlahBerubah);
    jmlIn.addEventListener('change', onJumlahBerubah);
  }
  if (btnMin) btnMin.addEventListener('click', function () {
    jmlIn.value = Math.max(1, jmlOrang() - 1); onJumlahBerubah();
  });
  if (btnPlus) btnPlus.addEventListener('click', function () {
    jmlIn.value = Math.min(100, jmlOrang() + 1); onJumlahBerubah();
  });
  // Pilih kamar manual (tombol atas / select modal): hormati pilihan user sampai jumlah diubah lagi
  if (kmrSel) kmrSel.addEventListener('change', function () {
    if (priceMap[kmrSel.value]) { setRoom(kmrSel.value); renderEstimasi(); }
  });
  roomBtns.forEach(function (btn) {
    btn.addEventListener('click', renderEstimasi);
  });
  renderEstimasi();

  // Submit -> WhatsApp
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = namaIn ? namaIn.value.trim() : '';
    var wa = waIn ? waIn.value.trim() : '';
    var kota = kotaIn ? kotaIn.value.trim() : '-';
    var catatan = area ? area.value.trim() : '';
    if (!nama || !waIn || !waIn.value.trim()) {
      alert('Mohon lengkapi Nama dan Nomor WhatsApp terlebih dahulu.');
      return;
    }
    var n = jmlOrang(), h = hargaKamar(), total = h * n;
    var kamarTxt = kmrSel ? kmrSel.options[kmrSel.selectedIndex].text : 'Quad';
    var lines = [
      'Assalamualaikum Safa Tour, saya ingin booking seat umrah:',
      '',
      'Nama: ' + nama,
      'No. WA: ' + wa,
      'Domisili: ' + kota,
      'Paket: ' + P.nama,
      'Jadwal: ' + P.tanggal + ' (' + P.durasi + ')',
      'Maskapai: ' + P.maskapai,
      'Tipe kamar: ' + kamarTxt + ' ' + (ROOM_NAMA[kunciKamar()] || ''),
      'Jumlah jamaah: ' + n + ' orang' + ((n === 1 && kunciKamar() === 'double') ? ' (sekamar sendiri, single supplement konfirmasi admin)' : ''),
      'Rencana kamar: ' + komposisiKamar(n, kunciKamar()),
      'Estimasi total: ' + fmt(total),
      'Catatan: ' + (catatan || '-'),
      '',
      'Mohon info ketersediaan seat dan panduan pembayarannya. Terima kasih.'
    ];
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
    if (okBox) {
      okBox.classList.remove('hidden');
      try { okBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    }
    form.reset();
    if (jmlIn) jmlIn.value = jmlAwal;
    setRoom(autoRoom(jmlAwal));
    renderEstimasi();
  });
})();
