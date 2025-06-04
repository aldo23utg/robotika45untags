// galeri.js - Skrip spesifik untuk halaman Galeri (galeri.html)
document.addEventListener("DOMContentLoaded", function() {
    const imageModalElement = document.getElementById('imageModal');
    if (imageModalElement) {
        imageModalElement.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget; // Tombol yang memicu modal
            if (button) { // Pastikan button ada
                const imageSrc = button.getAttribute('data-bs-image');
                const imageTitle = button.getAttribute('data-bs-title');

                const modalImage = imageModalElement.querySelector('#modalImage');
                const modalTitle = imageModalElement.querySelector('#imageModalLabel');

                if (modalImage) modalImage.src = imageSrc;
                if (modalTitle) modalTitle.textContent = imageTitle || 'Detail Gambar'; // Default title
            }
        });
    }
    console.log("galeri.js loaded for Galeri page!");
});