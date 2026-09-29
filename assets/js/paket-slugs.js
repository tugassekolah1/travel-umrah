// paket.html: beri slug ?paket= pada setiap tombol Detail Paket sesuai urutan kartu
(function () {
  var slugs = ['hemat-9', 'nyaman-12', 'premium-12', 'akhir-tahun-12', 'plus-turki-14', 'ramadhan-12'];
  function assign() {
    var cards = document.querySelectorAll('#packageGrid .package-card');
    cards.forEach(function (card, i) {
      var slug = slugs[i] || 'nyaman-12';
      // simpan slug di kartu untuk dipakai filter/debug
      card.setAttribute('data-paket', slug);
      card.querySelectorAll('a[href^="detail-paket.html"]').forEach(function (a) {
        var base = a.getAttribute('href').split('?')[0];
        a.setAttribute('href', base + '?paket=' + slug);
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', assign);
  } else {
    assign();
  }
})();
