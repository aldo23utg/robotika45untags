// Inisialisasi AOS (Animate On Scroll)
AOS.init({
    duration: 800, // Durasi animasi dalam milidetik
    once: true,    // Apakah animasi hanya dijalankan sekali
    offset: 50,    // Offset (dalam px) dari viewport asli untuk memicu animasi
    disable: function() { // Nonaktifkan AOS pada layar kecil untuk performa
        var maxWidth = 768;
        return window.innerWidth < maxWidth;
    }
});

// Fungsi untuk mengupdate tahun di footer
function updateFooterYear() {
    const yearElements = document.querySelectorAll("#currentYear, #currentYearPage"); // Bisa lebih dari satu elemen
    if (yearElements.length > 0) {
        yearElements.forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    }
}

// Penanganan Navigasi Aktif Otomatis
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');
    // Dapatkan nama file saat ini dari URL, atau default ke 'index.html' jika path kosong (misal, root domain)
    let currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "" || currentPath === "/") { // Menangani kasus root domain
        currentPath = 'index.html';
    }

    navLinks.forEach(link => {
        let linkPath = link.getAttribute('href');
        if (linkPath && linkPath !== "#") { // Pastikan href ada dan bukan hanya '#'
            linkPath = linkPath.split("/").pop();
            if (linkPath === currentPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');

                // Jika item dropdown aktif, tandai juga parent dropdown-toggle sebagai aktif
                if (link.classList.contains('dropdown-item')) {
                    const dropdownToggle = link.closest('.nav-item.dropdown').querySelector('.nav-link.dropdown-toggle');
                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                    }
                }
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        }
    });

    // Panggil fungsi update tahun footer
    updateFooterYear();

    // Lightbox functionality untuk Galeri
    const imageModalElement = document.getElementById('imageModal');
    if (imageModalElement) {
        imageModalElement.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget; // Tombol yang memicu modal
            const imageSrc = button.getAttribute('data-bs-image'); // Ambil path gambar dari atribut data-bs-image
            const imageTitle = button.getAttribute('data-bs-title'); // Ambil judul gambar

            const modalImage = imageModalElement.querySelector('#modalImage');
            const modalTitle = imageModalElement.querySelector('#imageModalLabel');

            modalImage.src = imageSrc;
            modalTitle.textContent = imageTitle || 'Detail Gambar'; // Default title
        });
    }

    // Validasi dan submit form kontak (contoh sederhana, perlu backend untuk pengiriman nyata)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah submit form standar
            const formMessage = document.getElementById('formMessage');

            // Tambahkan kelas 'was-validated' untuk menampilkan feedback Bootstrap
            contactForm.classList.add('was-validated');

            // Cek validitas form menggunakan API Constraint Validation HTML5
            if (!contactForm.checkValidity()) {
                event.stopPropagation(); // Hentikan jika tidak valid
                // Pesan error akan ditampilkan oleh Bootstrap
                // formMessage.innerHTML = '<div class="alert alert-danger mt-3" role="alert">Harap isi semua kolom yang wajib diisi dengan benar.</div>';
                // setTimeout(() => {
                //     formMessage.innerHTML = '';
                // }, 5000);
                return; // Keluar jika tidak valid
            }


            // Di sini Anda bisa menambahkan logika pengiriman data ke backend
            // atau menggunakan layanan seperti Formspree, Netlify Forms, dll.
            // Contoh simulasi sukses:
            formMessage.innerHTML = '<div class="alert alert-success mt-3" role="alert">Pesan Anda telah diterima! Kami akan segera menghubungi Anda. (Simulasi)</div>';
            contactForm.reset(); // Kosongkan form setelah submit
            contactForm.classList.remove('was-validated'); // Hapus kelas validasi setelah berhasil

            // Hilangkan pesan setelah beberapa detik
            setTimeout(() => {
                formMessage.innerHTML = '';
            }, 5000);
        });
    }

});

// Smooth scroll untuk tautan hash (jika ada, misal #gabung di index.html)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hrefAttribute = this.getAttribute('href');
        // Pastikan itu adalah hash yang valid dan bukan hanya '#'
        if (hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
            const targetElement = document.querySelector(hrefAttribute);
            if (targetElement) { // Pastikan elemen target ada
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar.fixed-top')?.offsetHeight || 0; // Dapatkan tinggi navbar
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset; // Posisi elemen relatif ke dokumen
                const offsetPosition = elementPosition - navbarHeight - 20; // Kurangi tinggi navbar dan sedikit offset

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});


console.log("Website Robotika'45 script loaded successfully! Ready to innovate!");