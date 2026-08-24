document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const idCard = document.getElementById('idCard');
    const idCardWrapper = document.getElementById('idCardWrapper');
    const cardGlare = document.getElementById('cardGlare');
    const navLinks = document.querySelectorAll('.nav-btn');
    const panels = document.querySelectorAll('.panel');

    /* ==========================================================================
       INTERACTIVE 3D TILT EFFECT FOR ID CARD (EARTHY RETRO PAPERLIKE)
       ========================================================================== */
    if (idCard && idCardWrapper) {
        const MAX_TILT = 8; // Maximum tilt angle in degrees (subtle retro tilt)

        const handleMove = (e) => {
            const rect = idCard.getBoundingClientRect();

            // Get touch or mouse coordinates
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            // Calculate position relative to card center (-0.5 to 0.5)
            const xVal = (clientX - rect.left) / rect.width;
            const yVal = (clientY - rect.top) / rect.height;

            const xOffset = xVal - 0.5;
            const yOffset = yVal - 0.5;

            // Calculate tilt angles
            const rotateX = (-yOffset * MAX_TILT).toFixed(2);
            const rotateY = (xOffset * MAX_TILT).toFixed(2);

            // Apply 3D Transform
            idCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Dynamic Retro Paper Shadow offset
            const shadowX = Math.round(-xOffset * 16 + 8);
            const shadowY = Math.round(-yOffset * 16 + 8);
            idCard.style.boxShadow = `${shadowX}px ${shadowY}px 0px #004D40`;

            // Subtle paper sheen overlay
            if (cardGlare) {
                const glareX = (xVal * 100).toFixed(1);
                const glareY = (yVal * 100).toFixed(1);
                cardGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`;
                cardGlare.style.opacity = '1';
            }
        };

        const handleReset = () => {
            // Smooth reset to neutral transform & solid retro paper shadow
            idCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            idCard.style.boxShadow = '8px 8px 0px #004D40';
            if (cardGlare) {
                cardGlare.style.opacity = '0';
            }
        };

        // Event Listeners for Mouse
        idCardWrapper.addEventListener('mousemove', handleMove);
        idCardWrapper.addEventListener('mouseleave', handleReset);

        // Touch support
        idCardWrapper.addEventListener('touchmove', handleMove, { passive: true });
        idCardWrapper.addEventListener('touchend', handleReset);
    }

    /* ==========================================================================
       SCROLL OBSERVER & ACTIVE NAVIGATION LINK HIGHLIGHTING
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    panels.forEach(panel => observer.observe(panel));

    /* Smooth scroll handler for nav clicks */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ==========================================================================
       AUDIO PLAYER & WAVEFORM LOGIC (UNTITLED.MP3)
       ========================================================================== */
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const audioStatus = document.getElementById('audioStatus');
    const waveform = document.getElementById('waveform');

    if (audioPlayer && playBtn && waveform) {
        const waveBars = waveform.querySelectorAll('.wave-bar');

        const togglePlay = () => {
            if (audioPlayer.paused) {
                audioPlayer.play().then(() => {
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                    audioStatus.textContent = 'Playing...';
                    waveform.classList.add('playing');
                }).catch(err => {
                    console.log('Audio playback error:', err);
                    audioStatus.textContent = 'Click to play';
                });
            } else {
                audioPlayer.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                audioStatus.textContent = 'Paused';
                waveform.classList.remove('playing');
            }
        };

        playBtn.addEventListener('click', togglePlay);

        // Update waveform progress as audio plays
        audioPlayer.addEventListener('timeupdate', () => {
            if (!audioPlayer.duration) return;
            const progress = audioPlayer.currentTime / audioPlayer.duration;
            const activeIndex = Math.floor(progress * waveBars.length);

            waveBars.forEach((bar, idx) => {
                if (idx <= activeIndex) {
                    bar.classList.add('played');
                } else {
                    bar.classList.remove('played');
                }
            });
        });

        // Click waveform to seek
        waveform.addEventListener('click', (e) => {
            const rect = waveform.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            if (audioPlayer.duration) {
                audioPlayer.currentTime = percentage * audioPlayer.duration;
            }
            if (audioPlayer.paused) {
                togglePlay();
            }
        });

        // When audio ends
        audioPlayer.addEventListener('ended', () => {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            audioStatus.textContent = 'Playback finished. Click to replay.';
            waveform.classList.remove('playing');
            waveBars.forEach(bar => bar.classList.remove('played'));
        });
    }
});
