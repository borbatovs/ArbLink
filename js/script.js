document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const cards = carousel.querySelectorAll('.card');
    const pagination = document.querySelector('.pagination');
    let currentIndex = null;
    const totalCards = cards.length;
    let isMobile = window.innerWidth <= 768;

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
                event.stopPropagation(); // Impede que o clique no card propague para o documento
                if (currentIndex === index) {
                    // Se o card já está ativo, redireciona para a URL
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

        // Adiciona um event listener ao documento para fechar o card ativo quando clicar fora
        document.addEventListener('click', () => {
            if (currentIndex !== null) {
                currentIndex = null;
                updateCarousel(currentIndex);
            }
        });
    } else {
        // Para dispositivos móveis, adiciona redirecionamento direto no clique
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
});