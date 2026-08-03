/* -------------------------------------------------------------
   MAIN JAVASCRIPT — SHAHID KHAN MINIMALIST PORTFOLIO
------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // THEME TOGGLE (DARK / LIGHT MODE WITH LOCALSTORAGE)
    // ---------------------------------------------------------
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    // Default to light theme matching the reference layout, or restore stored
    const savedTheme = localStorage.getItem('portfolio_theme') || 'light';
    applyTheme(savedTheme);

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio_theme', theme);
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // ---------------------------------------------------------
    // SMOOTH SCROLLING FOR NAVIGATION LINKS
    // ---------------------------------------------------------
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ---------------------------------------------------------
    // CONTACT FORM INTERACTION
    // ---------------------------------------------------------
    const contactForm = document.getElementById('portfolioContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('formName');
            const name = nameInput ? nameInput.value : 'Friend';
            alert(`Thank you, ${name}! Your message has been received. Shahid will get back to you shortly.`);
            contactForm.reset();
        });
    }
});
