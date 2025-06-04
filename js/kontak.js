// kontak.js - Skrip spesifik untuk halaman Kontak (kontak.html)
document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah submit form standar
            const formMessage = document.getElementById('formMessage');

            contactForm.classList.add('was-validated'); // Tampilkan feedback Bootstrap

            if (!contactForm.checkValidity()) {
                event.stopPropagation(); // Hentikan jika tidak valid
                // Pesan error akan ditampilkan oleh Bootstrap berdasarkan invalid-feedback di HTML
                return; // Keluar jika tidak valid
            }

            // Simulasi pengiriman data (ganti dengan logika backend Anda)
            if (formMessage) {
                 formMessage.innerHTML = '<div class="alert alert-success mt-3" role="alert">Pesan Anda telah diterima! Kami akan segera menghubungi Anda. (Simulasi)</div>';
            }
            contactForm.reset(); // Kosongkan form setelah submit
            contactForm.classList.remove('was-validated'); // Hapus kelas validasi setelah berhasil

            // Hilangkan pesan setelah beberapa detik
            setTimeout(() => {
                if (formMessage) formMessage.innerHTML = '';
            }, 5000);
        });
    }
    console.log("kontak.js loaded for Kontak page!");
});