document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriter');
    const text = "@villelabrasilbank";
    const typingSpeed = 150;
    const erasingSpeed = 100;
    const waitBeforeErasing = 2000;
    const waitBeforeRetyping = 1000;
    const carousel = document.querySelector('.carousel');
    const cards = carousel.querySelectorAll('.card');
    const pagination = document.querySelector('.pagination');
    const parallaxBg = document.querySelector('.parallax-bg');
    let currentIndex = null;
    const totalCards = cards.length;
    let isMobile = window.innerWidth <= 768;

    function typeWriter(text, i, cb) {
        if (i < text.length) {
            typewriterElement.innerHTML = text.substring(0, i+1);
            i++;
            setTimeout(function() {
                typeWriter(text, i, cb)
            }, typingSpeed);
        } else if (typeof cb == 'function') {
            setTimeout(cb, waitBeforeErasing);
        }
    }

    function eraseText(i, cb) {
        if (i > 1) {
            typewriterElement.innerHTML = text.substring(0, i);
            i--;
            setTimeout(function() {
                eraseText(i, cb)
            }, erasingSpeed);
        } else if (typeof cb == 'function') {
            setTimeout(cb, waitBeforeRetyping);
        }
    }

    function typeLoop() {
        typeWriter(text, 0, function() {
            eraseText(text.length, typeLoop);
        });
    }

    // Initialize with the first character
    typewriterElement.innerHTML = text.charAt(0);
    
    // Start the animation loop after a brief delay
    setTimeout(typeLoop, 1000);
    
    function updateCarousel(index) {
        if (!isMobile) {
            cards.forEach((card, i) => {
                if (i === index) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            updateDots(index);
        }
    }

    function updateDots(index) {
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Create pagination dots (only for desktop)
    if (!isMobile) {
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel(currentIndex);
            });
            pagination.appendChild(dot);
        }
    }

    // Click functionality (only for desktop)
    if (!isMobile) {
        cards.forEach((card, index) => {
            card.addEventListener('click', (event) => {
                event.stopPropagation(); // // Prevents the click on the card from propagating to the document
                if (currentIndex === index) {
                    // If the card is already active, redirect to the URL
                    const url = card.getAttribute('data-url');
                    if (url) {
                        window.location.href = url;
                    }
                } else {
                    currentIndex = index;
                    updateCarousel(currentIndex);
                }
            });
        });

        // Add an event listener to the document to close the active card when clicking outside
        document.addEventListener('click', () => {
            if (currentIndex !== null) {
                currentIndex = null;
                updateCarousel(currentIndex);
            }
        });
    } else {
        // For mobile devices, add direct redirection on click
        cards.forEach((card) => {
            card.addEventListener('click', () => {
                const url = card.getAttribute('data-url');
                if (url) {
                    window.location.href = url;
                }
            });
        });
    }

    // Initial setup
    updateCarousel(currentIndex);
    
    // Resize event listener
    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;
        if (wasMobile !== isMobile) {
            if (isMobile) {
                pagination.innerHTML = ''; // Remove pagination dots
            } else {
                // Re-create pagination dots
                pagination.innerHTML = '';
                for (let i = 0; i < totalCards; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    dot.addEventListener('click', () => {
                        currentIndex = i;
                        updateCarousel(currentIndex);
                    });
                    pagination.appendChild(dot);
                }
            }
            currentIndex = null;
            updateCarousel(currentIndex);
        }
    });
    
    window.addEventListener('scroll', function() {
        let scrollPosition = window.pageYOffset;
        parallaxBg.style.backgroundPosition = `calc(50% + ${scrollPosition * 0.1}px) calc(50% + ${scrollPosition * 0.1}px)`;
    });

});