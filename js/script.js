document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriter');
    const text = "@villelabrasilbank"; // O texto que você quer animar
    const typingSpeed = 150; // Velocidade de digitação (em milissegundos)
    const erasingSpeed = 100; // Velocidade de apagamento (em milissegundos)
    const waitBeforeErasing = 2000; // Tempo de espera antes de apagar (em milissegundos)
    const waitBeforeRetyping = 1000; // Tempo de espera antes de redigitar (em milissegundos)
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
        if (i > 1) { // Mudamos para 1 para manter o primeiro caractere
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

    // Inicializa com o primeiro caractere
    typewriterElement.innerHTML = text.charAt(0);
    
    // Inicia o loop de animação após um breve delay
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
    
    window.addEventListener('scroll', function() {
        let scrollPosition = window.pageYOffset;
        parallaxBg.style.backgroundPosition = `calc(50% + ${scrollPosition * 0.1}px) calc(50% + ${scrollPosition * 0.1}px)`;
    });

});