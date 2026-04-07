
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const mainMenu = document.querySelector('.main-menu');
    const navLinks = document.querySelectorAll('.main-menu a');

    /**
     * Toggles the menu active state
     */
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        mainMenu.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (mainMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    /**
     * Closes the menu
     */
    const closeMenu = () => {
        hamburger.classList.remove('active');
        mainMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close menu when clicking outside (on the overlay)
    document.addEventListener('click', (e) => {
        if (mainMenu.classList.contains('active') && !mainMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Bonus Requirement: Close menu automatically when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    // Ensure menu is closed when resizing to desktop view
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    });
});
