// js/global.js

// Inisialisasi AOS (Animate On Scroll)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800, // Durasi animasi dalam milidetik
        once: true,    // Apakah animasi hanya dijalankan sekali
        offset: 50,    // Offset (dalam px) dari viewport asli untuk memicu animasi
        disable: function() { // Nonaktifkan AOS pada layar kecil untuk performa
            var maxWidth = 768;
            return window.innerWidth < maxWidth;
        }
    });
}

// Fungsi untuk mengupdate tahun di footer
function updateFooterYear() {
    const yearElements = document.querySelectorAll("#currentYear, #currentYearPage"); // Bisa lebih dari satu elemen
    if (yearElements.length > 0) {
        yearElements.forEach(el => {
            if (el) { // Pastikan elemen ada
                el.textContent = new Date().getFullYear();
            }
        });
    }
}

// Penanganan Navigasi Aktif Otomatis
function setActiveNav() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');
    let currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "" || currentPath === "/") { // Menangani kasus root domain
        currentPath = 'index.html';
    }

    navLinks.forEach(link => {
        if (!link) return; // Lewati jika link null

        let linkPath = link.getAttribute('href');
        if (linkPath && linkPath !== "#" && linkPath.trim() !== "") { 
            const linkFilename = linkPath.split("/").pop().split("#")[0]; // Ambil nama file sebelum hash

            if (linkFilename === currentPath) {
                link.classList.add('active');
                // Hanya set aria-current pada link yang benar-benar mengarah ke halaman aktif
                // bukan pada dropdown-toggle utama yang hanya membuka menu
                if (!link.classList.contains('dropdown-toggle') || link.closest('.dropdown-menu')) {
                     link.setAttribute('aria-current', 'page');
                }

                // Jika item dropdown aktif, tandai juga parent dropdown-toggle sebagai aktif
                if (link.classList.contains('dropdown-item')) {
                    const dropdownToggle = link.closest('.nav-item.dropdown')?.querySelector('.nav-link.dropdown-toggle');
                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                    }
                }
            } else {
                link.classList.remove('active');
                if (!link.classList.contains('dropdown-toggle') || link.closest('.dropdown-menu')) {
                    link.removeAttribute('aria-current');
                }
            }
        }
    });

    // Pastikan dropdown-toggle tidak aktif jika tidak ada item di dalamnya yang aktif
    document.querySelectorAll('.navbar .nav-item.dropdown .dropdown-toggle').forEach(toggle => {
        const parentDropdownMenu = toggle.nextElementSibling;
        if (parentDropdownMenu && parentDropdownMenu.classList.contains('dropdown-menu')) {
            const activeChild = parentDropdownMenu.querySelector('.dropdown-item.active');
            if (!activeChild) {
                toggle.classList.remove('active');
            } else {
                 toggle.classList.add('active'); // Seharusnya sudah, tapi untuk jaga-jaga
            }
        }
    });
}


// Smooth scroll untuk tautan hash
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Pastikan itu adalah hash yang valid dan bukan hanya '#'
            if (hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
                try {
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
                } catch (error) {
                    // Handle invalid selector error if hrefAttribute is not a valid ID selector
                    console.warn("Smooth scroll target not found or invalid selector:", hrefAttribute, error);
                }
            }
        });
    });
}

// Fungsi untuk menangani dropdown hover di desktop
function setupNavbarHoverDropdown() {
    const desktopMinWidth = 992; // Breakpoint Bootstrap lg

    const dropdownElements = document.querySelectorAll('.navbar .nav-item.dropdown');

    dropdownElements.forEach(function(element) {
        const toggleElement = element.querySelector('.dropdown-toggle');
        if (!toggleElement) return;

        let bsDropdownInstance = bootstrap.Dropdown.getInstance(toggleElement);
        if (!bsDropdownInstance) {
            bsDropdownInstance = new bootstrap.Dropdown(toggleElement, {
                // Opsi jika diperlukan, misal offset atau boundary
            });
        }

        let hoverTimeout;

        element.addEventListener('mouseenter', function() {
            if (window.innerWidth >= desktopMinWidth) {
                clearTimeout(hoverTimeout);
                const menu = element.querySelector('.dropdown-menu');
                if (menu && !menu.classList.contains('show')) {
                    bsDropdownInstance.show();
                }
            }
        });

        element.addEventListener('mouseleave', function() {
            if (window.innerWidth >= desktopMinWidth) {
                hoverTimeout = setTimeout(function() {
                    const menu = element.querySelector('.dropdown-menu');
                    // Cek apakah mouse masih di atas nav-item atau menu dropdownnya
                    // Ini penting agar menu tidak langsung hilang saat mouse bergerak dari toggle ke menu
                    if (menu && menu.classList.contains('show')) {
                        const isHoveringNavOrMenu = element.matches(':hover') || menu.matches(':hover');
                        if (!isHoveringNavOrMenu) {
                            bsDropdownInstance.hide();
                        }
                    }
                }, 150); // delay 150ms
            }
        });

        // Pastikan dropdown tetap terbuka jika mouse bergerak dari toggle ke menu
        const menuElement = element.querySelector('.dropdown-menu');
        if (menuElement) {
            menuElement.addEventListener('mouseenter', function() {
                 if (window.innerWidth >= desktopMinWidth) {
                    clearTimeout(hoverTimeout); // Batalkan penutupan jika mouse masuk ke menu
                 }
            });
             menuElement.addEventListener('mouseleave', function() {
                 if (window.innerWidth >= desktopMinWidth) {
                    hoverTimeout = setTimeout(function() {
                        // Cek apakah mouse keluar dari area nav-item dan juga menu
                         if (!element.matches(':hover') && !menuElement.matches(':hover')) {
                            bsDropdownInstance.hide();
                         }
                    }, 150);
                 }
            });
        }


        // Menangani klik pada toggle di mobile (Bootstrap sudah menghandle ini)
        // Namun, kita perlu memastikan hover tidak aktif di mobile
        // Fungsi resize event listener bisa ditambahkan untuk menghapus/menambah event listener hover
        // atau cukup cek window.innerWidth di dalam event listener seperti di atas.
    });

    // Re-evaluate on resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Untuk saat ini, logika di dalam event listener sudah memeriksa window.innerWidth
            // Jika ingin lebih robust, bisa destroy dan re-init dropdowns atau event listeners
            // berdasarkan ukuran window setelah resize.
        }, 250);
    });
}


// Jalankan fungsi global saat DOM siap
document.addEventListener("DOMContentLoaded", function() {
    updateFooterYear();
    setActiveNav(); // Panggil setelah DOM siap dan semua link ada
    smoothScroll();
    setupNavbarHoverDropdown(); // Panggil fungsi baru

    console.log("Global scripts loaded and executed with hover dropdown!");
});