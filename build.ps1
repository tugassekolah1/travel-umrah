$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
# $root is site/ folder when script inside site/, adjust:
# Script will be placed in site/build.ps1, source is ../<folder>/code.html
$siteDir = $root
$srcRoot = Split-Path -Parent $siteDir

$pages = @(
  @{ Out="index.html";          Src="beranda_safa_tour\code.html";               Page="beranda"; Title="Beranda Safa Tour" },
  @{ Out="paket.html";          Src="daftar_paket_umrah_safa_tour\code.html";     Page="paket";   Title="Paket Umrah 2026 Safa Tour" },
  @{ Out="detail-paket.html";   Src="detail_paket_umrah_safa_tour\code.html";     Page="detail-paket"; Title="Detail Paket Umrah Safa Tour" },
  @{ Out="artikel.html";        Src="artikel_panduan_umrah_safa_tour\code.html";  Page="artikel"; Title="Artikel Panduan Umrah Safa Tour" },
  @{ Out="detail-artikel.html"; Src="detail_artikel_safa_tour\code.html";         Page="detail-artikel"; Title="Panduan Tata Cara Umrah Safa Tour" },
  @{ Out="tentang.html";        Src="tentang_kami_safa_tour\code.html";           Page="tentang"; Title="Tentang Kami Safa Tour" },
  @{ Out="kontak.html";         Src="kontak_konsultasi_safa_tour\code.html";      Page="kontak";  Title="Kontak Konsultasi Safa Tour" }
)

$headerPartial = Get-Content (Join-Path $siteDir "partials\header.html") -Raw -Encoding UTF8
$footerPartial = Get-Content (Join-Path $siteDir "partials\footer.html") -Raw -Encoding UTF8

foreach ($p in $pages) {
  $src = Join-Path $srcRoot $p.Src
  $html = Get-Content $src -Raw -Encoding UTF8

  # ---- 1. Ambil <head> asli untuk pertahankan tailwind config, lalu tambahkan site.css ----
  # Tambahkan site.css sebelum </head>
  $html = $html -replace '</head>', '<link rel="stylesheet" href="assets/css/site.css"/></head>'

  # ---- 2. Perbaiki <title> ----
  if ($html -match '<title>') {
    $html = $html -replace '<title>.*?</title>', ('<title>' + $p.Title + '</title>')
  } else {
    $html = $html -replace '</head>', ('<title>' + $p.Title + '</title></head>')
  }

  # ---- 3. Tambahkan data-page ke <body> untuk active nav ----
  $html = $html -replace '<body', ('<body data-page="' + $p.Page + '"')

  # ---- 4. Perbaiki tautan navigasi placeholder (data-path) ----
  $html = $html -replace 'data-path="beranda" href="#"', 'href="index.html"'
  $html = $html -replace 'data-path="beranda" href="[^"]*"', 'href="index.html"'
  $html = $html -replace 'data-path="paket-umrah" href="#"', 'href="paket.html"'
  $html = $html -replace 'data-path="paket-umrah" href="[^"]*"', 'href="paket.html"'
  $html = $html -replace 'data-path="jadwal-keberangkatan" href="#"', 'href="paket.html"'
  $html = $html -replace 'data-path="jadwal-keberangkatan" href="[^"]*"', 'href="paket.html"'
  $html = $html -replace 'data-path="tentang-kami" href="#"', 'href="tentang.html"'
  $html = $html -replace 'data-path="tentang-kami" href="[^"]*"', 'href="tentang.html"'
  $html = $html -replace 'data-path="artikel" href="#"', 'href="artikel.html"'
  $html = $html -replace 'data-path="artikel" href="[^"]*"', 'href="artikel.html"'
  $html = $html -replace 'data-path="kontak" href="#"', 'href="kontak.html"'
  $html = $html -replace 'data-path="kontak" href="[^"]*"', 'href="kontak.html"'
  # generic data-path sisa
  $html = $html -replace 'data-path="[^"]*" href="#"', 'href="index.html"'

  # ---- 5. Breadcrumb generik ----
  # <a ... href="#">Beranda</a> -> index.html ; Paket Umrah -> paket.html ; Panduan & Artikel -> artikel.html ; Kontak -> kontak.html
  $html = $html -replace '(<a[^>]*href="#")>Beranda</a>', '$1 href="index.html">Beranda</a>'
  # lebih aman: ganti pola href="#">Beranda
  $html = $html -replace 'href="#">Beranda', 'href="index.html">Beranda'
  $html = $html -replace 'href="#">Paket Umrah', 'href="paket.html">Paket Umrah'
  $html = $html -replace 'href="#">Panduan &amp; Artikel', 'href="artikel.html">Panduan &amp; Artikel'
  $html = $html -replace 'href="#">Panduan & Artikel', 'href="artikel.html">Panduan & Artikel'
  $html = $html -replace 'href="#">Kontak', 'href="kontak.html">Kontak'

  # ---- 6. Saling terkait antar halaman (khusus per halaman) ----
  if ($p.Page -eq "beranda") {
    # Tombol Lihat Paket Umrah sudah #paket-pilihan (anchor) biarkan. Tambah link ke paket.html pada "Baca Seluruh Artikel"
    $html = $html -replace '(<a[^>]*href="#")>\s*<span>Baca Seluruh Artikel</span>', '<a class="inline-flex items-center gap-1 font-title-md text-title-md text-primary hover:text-secondary transition-colors" href="artikel.html"><span>Baca Seluruh Artikel</span>'
    # Kartu paket: ubah "Lihat Detail Paket" dari WA ke detail-paket.html per paket (tetap sediakan WA di halaman detail)
    $html = $html -replace 'href="https://wa\.me/6281234567890\?text=Halo%20Safa%20Tour,%20saya%20tertarik%20dengan%20Paket%20Umrah%20Hemat[^"]*"([^>]*>\s*<span>Lihat Detail Paket</span>)', 'href="detail-paket.html?paket=hemat-9"$1'
    $html = $html -replace 'href="https://wa\.me/6281234567890\?text=Halo%20Safa%20Tour,%20saya%20tertarik%20dengan%20Paket%20Umrah%20Nyaman[^"]*"([^>]*>\s*<span>Lihat Detail Paket</span>)', 'href="detail-paket.html?paket=nyaman-12"$1'
    $html = $html -replace 'href="https://wa\.me/6281234567890\?text=Halo%20Safa%20Tour,%20saya%20tertarik%20dengan%20Paket%20Umrah%20Premium[^"]*"([^>]*>\s*<span>Lihat Detail Paket</span>)', 'href="detail-paket.html?paket=premium-12"$1'
  }
  if ($p.Page -eq "paket") {
    # Tombol "Detail Paket" (button) -> link ke detail-paket.html (slug dipasang via JS sesuai urutan kartu)
    $html = $html -replace '<button([^>]*>\s*)Detail Paket\s*</button>', '<a href="detail-paket.html" class="w-full bg-primary-container text-on-primary py-2.5 px-3 rounded font-label-md text-label-md hover:bg-primary transition-colors text-center block"$1Detail Paket</a>'
    $html = $html -replace '</body>', '<script src="assets/js/paket-slugs.js"></script></body>'
  }
  if ($p.Page -eq "artikel") {
    $html = $html -replace '<a([^>]*href="#")([^>]*>\s*<span>Baca Panduan Selengkapnya</span>)', '<a$1 href="detail-artikel.html"$2'
    # Perbaiki double href jika terjadi
    $html = $html -replace 'href="#" href="detail-artikel.html"', 'href="detail-artikel.html"'
    $html = $html -replace 'href="detail-artikel.html" href="#"', 'href="detail-artikel.html"'
  }
  if ($p.Page -eq "detail-artikel") {
    $html = $html -replace '(<a[^>]*href="#")>\s*<span>Lihat Semua Artikel</span>', '<a class="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-secondary transition-colors mt-2 md:mt-0 font-semibold" href="artikel.html"><span>Lihat Semua Artikel</span>'
  }
  if ($p.Page -eq "detail-paket") {
    $html = $html -replace '(<a[^>]*href="#")>Beranda</a>', '<a class="hover:text-primary transition-colors" href="index.html">Beranda</a>'
    $html = $html -replace '(<a[^>]*href="#")>Paket Umrah</a>', '<a class="hover:text-primary transition-colors" href="paket.html">Paket Umrah</a>'
    # Ubah modal booking menjadi section inline di bawah (ramah HP: tombol selalu kelihatan, alir normal)
    $html = $html -replace '<!-- MODAL SEDERHANA: FORM REGISTRASI / BOOKING SEAT -->', '<!-- FORM BOOKING SEAT INLINE (pengganti modal, ramah HP) -->'
    $html = $html -replace '<div class="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4" id="booking-modal-overlay">', '<section id="booking" class="w-full bg-surface-container-low py-12 md:py-16 scroll-mt-20"><div class="max-w-[1240px] mx-auto px-4 md:px-12">'
    $html = $html -replace '<div class="bg-surface-container-lowest max-w-lg w-full rounded-xl shadow-xl p-6 md:p-8 flex flex-col gap-6 relative max-h-\[921px\] overflow-y-auto">', '<div class="bg-surface-container-lowest max-w-2xl mx-auto w-full rounded-xl shadow-md p-6 md:p-8 flex flex-col gap-6">'
    $html = $html -replace '<button[^>]*id="close-modal-btn"[^>]*>[\s\S]*?</button>', ''
    $html = $html -replace '</div>\s*</div>\s*<!-- CLIENT-SIDE INTERACTIVITY SCRIPT -->', '</div></div></section><!-- CLIENT-SIDE INTERACTIVITY SCRIPT -->'
    $html = $html -replace 'href="#modal-booking"', 'href="#booking"'
    # Cabut total JS modal lama (handler-nya preventDefault sehingga tombol Daftar tidak scroll)
    $html = $html -replace '// 2\. Interactive Booking Modal Trigger[\s\S]*?// 3\. Smooth Sticky Tab', '// 2. Form booking inline tanpa modal (tombol Daftar scroll ke #booking) // 3. Smooth Sticky Tab'
    # Matikan handler submit bawaan form booking (reset+close mendahului handler WA sehingga data hilang).
    # Diganti total oleh detail-paket.js (baca data -> buka WA -> tutup modal -> reset).
    $html = $html -replace "bookingForm\.addEventListener\('submit', function\(e\) \{\s*e\.preventDefault\(\);\s*(alert\('Alhamdulillah!.*?\);\s*)?closeModal\(\);\s*bookingForm\.reset\(\);\s*\}\);", ''
    # Katalog multi-paket + form estimasi + kirim WA
    $html = $html -replace '</body>', '<script src="assets/js/detail-paket.js"></script></body>'
  }

  # ---- 6b. Bersihkan double-href akibat replace berlapis ----
  $html = $html -replace 'href="#"\s+href="', 'href="'
  $html = $html -replace 'href="([^"]*)"\s+href="[^"]*"', 'href="$1"'
  # Footer asli dimulai dari <footer ...> sampai </footer>. Ganti dengan partial (dengan __BASE__ -> "")
  $footerFixed = $footerPartial -replace '__BASE__', ''
  # replace hanya footer terakhir (yang sebelum </body>)
  $html = $html -replace '<footer[\s\S]*?</footer>', $footerFixed

  # ---- 8. Ganti header asli (fixed, tanpa menu mobile) dengan header terpadu responsif ----
  # Hapus header asli Stitch yang fixed-top agar tidak dobel
  $html = $html -replace '<header class="fixed top-0[\s\S]*?</header>', ''
  # Perbaiki kompensasi -mt-20 pada hero tentang (karena header fixed sudah hilang, header baru sticky in-flow)
  $html = $html -replace '-mt-20 pt-32', 'pt-16 md:pt-20'
  $headerFixed = $headerPartial -replace '__BASE__', ''
  # Sisip setelah <body ...>
  $html = $html -replace '(<body[^>]*>)', ('$1' + "`n" + $headerFixed)

  # ---- 8b. FAQ: beri id + accordion interaktif (khusus kontak) ----
  if ($p.Page -eq "kontak") {
    # Tambahkan id="faq" pada section FAQ agar bisa dijangkau dari nav
    $html = $html -replace '<!-- Section Bawah: FAQ Ringkas Pendaftaran -->', '<!-- Section Bawah: FAQ Ringkas Pendaftaran --><span id="faq-anchor"></span>'
    $html = $html -replace '(<section class="w-full bg-surface-container-low py-16 lg:py-24">\s*<div class="max-w-\[1240px\] mx-auto px-6 md:px-12">\s*<div class="text-center max-w-2xl mx-auto mb-12">)', '<section id="faq" class="w-full bg-surface-container-low py-16 lg:py-24 scroll-mt-24"><div class="max-w-[1240px] mx-auto px-6 md:px-12"><div class="text-center max-w-2xl mx-auto mb-12">'
    # Suntik JS accordion: klik kartu FAQ untuk buka/tutup jawaban
    $faqJs = '<script>(function(){document.querySelectorAll("#faq .bg-surface-container-lowest").forEach(function(card){var ans=card.querySelector("p.font-body-sm");if(!ans)return;var head=card.querySelector("h3");if(!head)return;head.style.cursor="pointer";var opened=true;head.addEventListener("click",function(){opened=!opened;ans.style.display=opened?"":"none";card.style.opacity=opened?"1":"0.85";});});})();</script>'
    $html = $html -replace '</body>', ($faqJs + '</body>')
  }

  # ---- 9. Tulis file UTF8 (sumber sudah bersih, baca tulis UTF8 agar karakter wajar) ----
  $outPath = Join-Path $siteDir $p.Out
  # Pastikan direktori ada
  $outDir = Split-Path -Parent $outPath
  if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
  Set-Content -Path $outPath -Value $html -Encoding UTF8
  Write-Host ("OK: " + $p.Out + " (" + $html.Length + " chars)")
}
Write-Host "Selesai. Buka site/index.html di browser."
