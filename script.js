// Detectar si es móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// Control de audio de fondo
const backgroundMusic = document.getElementById('backgroundMusic');
const audioControl = document.getElementById('audioControl');
const audioIcon = document.getElementById('audioIcon');
let isPlaying = false;
let audioInitialized = false;

// Configurar volumen y propiedades iniciales
if (backgroundMusic) {
    backgroundMusic.volume = 0.7;
    backgroundMusic.muted = false;
    // Intentar reproducir automáticamente tan pronto como sea posible
    backgroundMusic.autoplay = true;
}

// Función para reproducir audio
function playAudio() {
    if (!backgroundMusic) return;
    
    // Asegurar que no esté muteado
    backgroundMusic.muted = false;
    backgroundMusic.volume = 0.7;
    
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            audioIcon.textContent = '🔊';
            console.log('Audio reproduciéndose');
        }).catch(error => {
            console.log('Autoplay bloqueado, esperando interacción del usuario:', error.message);
            // Mantener el icono en 🔊 para indicar que intentará reproducir
            audioIcon.textContent = '🔊';
            isPlaying = false;
        });
    } else {
        // Si play() no retorna una promesa, asumir que está reproduciendo
        isPlaying = true;
        audioIcon.textContent = '🔊';
    }
}

// Función para pausar audio
function pauseAudio() {
    if (!backgroundMusic) return;
    backgroundMusic.pause();
    isPlaying = false;
    audioIcon.textContent = '🔇';
}

// Control de play/pause con el botón
if (audioControl) {
    audioControl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (backgroundMusic.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    });
}

// Actualizar icono cuando el audio cambie de estado
if (backgroundMusic) {
    backgroundMusic.addEventListener('play', () => {
        audioIcon.textContent = '🔊';
        isPlaying = true;
    });

    backgroundMusic.addEventListener('pause', () => {
        audioIcon.textContent = '🔇';
        isPlaying = false;
    });

    backgroundMusic.addEventListener('error', (e) => {
        console.error('Error en el audio:', e);
        const error = backgroundMusic.error;
        if (error) {
            console.error('Código de error:', error.code);
            console.error('Mensaje:', error.message);
        }
        
        // Intentar con diferentes rutas
        const currentSrc = backgroundMusic.currentSrc || backgroundMusic.src;
        const alternativePaths = [
            './Daft Punk - Touch (Official Audio) ft. Paul Williams [0Gkhol2Q1og].mp3',
            'Daft Punk - Touch (Official Audio) ft. Paul Williams [0Gkhol2Q1og].mp3',
            './Daft Punk - Touch.mp3',
            'Daft Punk - Touch.mp3'
        ];
        
        let triedPaths = [];
        if (currentSrc) {
            triedPaths.push(currentSrc);
        }
        
        // Si no hemos probado todas las rutas, intentar la siguiente
        for (let path of alternativePaths) {
            if (!triedPaths.includes(path)) {
                console.log('Intentando cargar audio desde:', path);
                backgroundMusic.src = path;
                backgroundMusic.load();
                break;
            }
        }
    });

    backgroundMusic.addEventListener('loadeddata', () => {
        console.log('Audio cargado correctamente');
        // Intentar reproducir automáticamente cuando esté cargado
        if (!audioInitialized) {
            playAudio();
        }
    });

    backgroundMusic.addEventListener('canplay', () => {
        console.log('Audio listo para reproducir');
        // Intentar reproducir cuando esté listo
        if (!audioInitialized && backgroundMusic.paused) {
            playAudio();
        }
    });

    backgroundMusic.addEventListener('canplaythrough', () => {
        console.log('Audio completamente cargado');
        // Intentar reproducir cuando esté completamente cargado
        if (!audioInitialized && backgroundMusic.paused) {
            playAudio();
        }
    });

    backgroundMusic.addEventListener('loadstart', () => {
        console.log('Cargando audio...');
        audioIcon.textContent = '⏳';
    });
}

// Intentar reproducir automáticamente inmediatamente
function tryAutoPlay() {
    if (!audioInitialized && backgroundMusic) {
        audioInitialized = true;
        // Si el audio ya está cargado, reproducir inmediatamente
        if (backgroundMusic.readyState >= 2) { // HAVE_CURRENT_DATA o superior
            playAudio();
        } else {
            // Si no está cargado, esperar a que se cargue
            if (backgroundMusic.addEventListener) {
                const playWhenReady = () => {
                    playAudio();
                    backgroundMusic.removeEventListener('canplay', playWhenReady);
                };
                backgroundMusic.addEventListener('canplay', playWhenReady);
            }
        }
    }
}

// Intentar reproducir inmediatamente cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAutoPlay);
} else {
    tryAutoPlay();
}

// También intentar cuando la página cargue completamente
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!audioInitialized || backgroundMusic.paused) {
            tryAutoPlay();
        }
    }, 500);
});

// Múltiples eventos para capturar cualquier interacción del usuario
document.addEventListener('click', () => {
    if (backgroundMusic && backgroundMusic.paused) {
        playAudio();
    }
}, { once: true });

document.addEventListener('touchstart', () => {
    if (backgroundMusic && backgroundMusic.paused) {
        playAudio();
    }
}, { once: true });

document.addEventListener('scroll', () => {
    if (backgroundMusic && backgroundMusic.paused) {
        playAudio();
    }
}, { once: true });

document.addEventListener('keydown', () => {
    if (backgroundMusic && backgroundMusic.paused) {
        playAudio();
    }
}, { once: true });

// Crear partículas decorativas (menos en móviles para mejor rendimiento)
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = isMobile ? 15 : 30; // Menos partículas en móviles

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Precargar imágenes inmediatamente (no esperar a window.load)
const imagePaths = [
    './imagen1.jpg',
    './imagen2.jpg',
    './imagen3.jpg',
    './imagen4.jpg',
    './imagen5.jpeg',
    './imagen6.jpeg',
    './imagen7.jpeg',
    './imagen8.jpeg',
    './imagen9.jpeg'
];

// Precargar imágenes de forma optimizada y agresiva
function preloadImages() {
    // Cargar todas las imágenes en paralelo de forma inmediata
    const loadPromises = imagePaths.map((path, index) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // Precargar las primeras 5 imágenes con alta prioridad
            if (index < 5 && img.fetchPriority !== undefined) {
                img.fetchPriority = 'high';
            }
            img.onload = () => {
                console.log(`✓ Imagen ${index + 1} cargada`);
                resolve(img);
            };
            img.onerror = () => {
                console.error(`✗ Error al cargar imagen ${index + 1}, intentando ruta alternativa`);
                // Intentar con ruta alternativa
                const altPath = path.replace('./', '');
                const altImg = new Image();
                altImg.onload = () => {
                    // Actualizar todas las instancias de esta imagen
                    const slideshowImgs = document.querySelectorAll('.slideshow-image');
                    slideshowImgs.forEach(slideshowImg => {
                        if (slideshowImg.src.includes(path.split('/').pop()) || slideshowImg.src.includes(altPath.split('/').pop())) {
                            slideshowImg.src = altPath;
                        }
                    });
                    resolve(altImg);
                };
                altImg.onerror = () => {
                    reject(new Error(`No se pudo cargar ${path} ni ${altPath}`));
                };
                altImg.src = altPath;
            };
            // Iniciar carga inmediatamente
            img.src = path;
        });
    });
    
    // No esperar a que todas terminen, pero sí iniciar la carga
    Promise.allSettled(loadPromises).then(() => {
        console.log('Todas las imágenes procesadas');
    });
}

// Iniciar precarga inmediatamente, incluso antes de DOMContentLoaded
preloadImages();

// También asegurar carga cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadImages);
}

// Configurar carrusel infinito
window.addEventListener('load', () => {
    createParticles();

    // Carrusel infinito sin saltos (optimizado para móviles)
    const slideshowContainer = document.getElementById('slideshowContainer');
    let currentPosition = 0;
    let imageWidth = window.innerWidth / 9;
    const speed = isMobile ? 1.2 : 1.5; // Velocidad ligeramente más lenta en móviles
    let resetPoint = imageWidth * 9; // Punto donde resetear (final de primera serie)
    
    function animateSlideshow() {
        currentPosition -= speed;
        
        // Cuando llegue al final de la primera serie, resetear a 0 sin que se note
        // (porque la segunda serie es idéntica a la primera)
        if (Math.abs(currentPosition) >= resetPoint) {
            currentPosition = 0;
        }
        
        slideshowContainer.style.transform = `translateX(${currentPosition}px)`;
        requestAnimationFrame(animateSlideshow);
    }
    
    // Ajustar en resize (importante para móviles en orientación horizontal/vertical)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newImageWidth = window.innerWidth / 9;
            // Ajustar posición proporcionalmente
            if (imageWidth > 0) {
                currentPosition = (currentPosition / imageWidth) * newImageWidth;
            }
            imageWidth = newImageWidth;
            resetPoint = imageWidth * 9;
        }, 250); // Debounce para mejor rendimiento
    });
    
    // Iniciar animación continua
    animateSlideshow();
});

// Animación de entrada para las secciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Efecto parallax suave en scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const particles = document.getElementById('particles');
    
    if (particles) {
        particles.style.transform = `translateY(${currentScroll * 0.3}px)`;
    }
    
    lastScroll = currentScroll;
});

// Efecto de hover mejorado en los botones
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Animación de números si se agregan fechas
const animateNumbers = (element) => {
    if (element.textContent && /^\d/.test(element.textContent.trim())) {
        element.style.animation = 'fadeInUp 0.6s ease-out';
    }
};

document.querySelectorAll('.date-info').forEach(animateNumbers);

